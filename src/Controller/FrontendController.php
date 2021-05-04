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
     * @Route("/fake-online", name="fake_online", condition="env('string:APP_ENV') === 'dev'"))
     *
     * Simulates an unstable FBS endpoint for 99 requests.
     *
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    public function fakeOnline() {
        if (rand(0,2) == 0) {
            return new Response('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>98YYYYYY60099920210503    1117392.00AODK-zzzzz|AMXXXXX|BXYYYYYYYYYYYNNYYY|</response></ns2:sip>', 200);
        }
        else if (rand(0,1) === 0) {
            return new Response('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>ERROR INPUT</response></ns2:sip>', 200);
        }
        else {
            return new Response('', 500);
        }
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
        return new Response('Bad request: Missing configuration id.', 400);
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
        if (empty($uniqueId)) {
            return new Response('Bad request: Missing configuration id', 400);
        }

        // Check that configuration exists.
        $boxConfig = $this->boxConfigurationRepository->findOneBy(['uniqueId' => $uniqueId]);
        if (is_null($boxConfig)) {
            return new Response('Bad request: Wrong configuration id', 400);
        }

        return $this->render(
            'frontend.html.twig',
            [
                'uniqueId' => $uniqueId,
                'socketUri' => $this->engineSocketURI,
            ]
        );
    }
}
