<?php

/**
 * @file
 * Front end controller mainly loading the index page.
 */

namespace App\Controller;

use App\Repository\BoxConfigurationRepository;
use App\Service\TokenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/box", name="box_frontend_")
 */
class BoxFrontendController extends AbstractController
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
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    public function index()
    {
        throw $this->createNotFoundException('Bad request: Missing configuration id');
    }

    /**
     * @Route("/{uniqueId}", name="load")
     *
     * @param string $uniqueId
     *   The unique id of the configuration
     *
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    public function load(string $uniqueId): Response
    {
        // Check that configuration exists.
        $boxConfig = $this->boxConfigurationRepository->findOneBy(['uniqueId' => $uniqueId]);
        if (is_null($boxConfig)) {
            throw $this->createNotFoundException('Bad request: Unknown configuration id');
        }

        return $this->render(
            'box.html.twig',
            [
                'uniqueId' => $uniqueId,
                'socketUri' => $this->engineSocketURI,
            ]
        );
    }
}
