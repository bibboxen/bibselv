<?php

declare(strict_types=1);

/**
 * @file
 * Front end controller mainly loading the index page.
 */

namespace App\Controller;

use App\Repository\BoxConfigurationRepository;
use App\Service\TokenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

#[\Symfony\Component\Routing\Attribute\Route(path: '/box', name: 'box_frontend_')]
class BoxFrontendController extends AbstractController
{
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
    public function __construct(private readonly BoxConfigurationRepository $boxConfigurationRepository, private readonly TokenService $tokenService, private readonly string $bindEngineSocketURI)
    {
    }

    /**
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    #[\Symfony\Component\Routing\Attribute\Route(path: '/', name: 'index')]
    public function index(): never
    {
        throw $this->createNotFoundException('Bad request: Missing configuration id');
    }

    /**
     * @param string $uniqueId
     *   The unique id of the configuration
     *
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    #[\Symfony\Component\Routing\Attribute\Route(path: '/{uniqueId}', name: 'load')]
    public function load(string $uniqueId): Response
    {
        // Check that configuration exists.
        $boxConfig = $this->boxConfigurationRepository->findOneBy(['uniqueId' => $uniqueId]);
        if (is_null($boxConfig)) {
            throw $this->createNotFoundException('Bad request: Unknown configuration id');
        }

        return $this->render(
            'box/frontend.html.twig',
            [
                'uniqueId' => $uniqueId,
                'socketUri' => $this->bindEngineSocketURI,
            ]
        );
    }
}
