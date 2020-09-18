<?php

/**
 * @file
 * Front end controller mainly loading the index page.
 */

namespace App\Controller;

use App\Repository\BoxConfigurationRepository;
use App\Service\TokenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("", name="frontend_")
 */
class FrontendController extends AbstractController
{
    private BoxConfigurationRepository $boxConfigurationRepository;
    private string $engineSocketURI = '';
    private TokenService $tokenService;

    /**
     * FrontendController constructor.
     *
     * @param BoxConfigurationRepository $boxConfigurationRepository
     *   The box configuration repository
     * @param TokenService $tokenService
     *   Token service used for token validation
     * @param string $bindEngineSocketURI
     *   URI for the websocket from the environment
     */
    public function __construct(BoxConfigurationRepository $boxConfigurationRepository, TokenService $tokenService, string $bindEngineSocketURI)
    {
        $this->boxConfigurationRepository = $boxConfigurationRepository;
        $this->engineSocketURI = $bindEngineSocketURI;
        $this->tokenService = $tokenService;
    }

    /**
     * @Route("/", name="index")
     *
     * @param Request $request
     *   The http request
     *
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    public function index(Request $request): Response
    {
        $configId = $request->query->get('id');
        if (empty($configId)) {
            return new Response('Bad request missing configuration id', 400);
        }

        // Check that configuration exists.
        $boxConfig = $this->boxConfigurationRepository->findOneBy(['id' => $configId]);
        if (is_null($boxConfig)) {
            return new Response('Bad request wrong configuration id', 400);
        }

        // Generate new token on each page load. We have currently no way to identify if a page is a reload of a given
        // client, so we assume that every new frontpage is a new connection..
        // @TODO: Change the front-end to request a token if it does not have one or if it needs a new one.
        $token = $this->tokenService->create($boxConfig);

        return $this->render(
            'frontend.html.twig',
            [
                'token' => $token->getToken(),
                'socketUri' => $this->engineSocketURI,
            ]
        );
    }
}
