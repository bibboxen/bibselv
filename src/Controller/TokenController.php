<?php

/**
 * @file
 * Token request controller.
 */

namespace App\Controller;

use App\Repository\BoxConfigurationRepository;
use App\Service\TokenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class TokenController.
 */
class TokenController extends AbstractController
{
    private TokenService $tokenService;
    private BoxConfigurationRepository $boxConfigurationRepository;

    /**
     * TokenController constructor.
     *
     * @param tokenService $tokenService
     *   Token service to validate tokens and more
     * @param boxConfigurationRepository $boxConfigurationRepository
     *   Box configuration repository to load configuration
     */
    public function __construct(TokenService $tokenService, BoxConfigurationRepository $boxConfigurationRepository)
    {
        $this->tokenService = $tokenService;
        $this->boxConfigurationRepository = $boxConfigurationRepository;
    }

    /**
     * @Route("/token/validate/{token}", name="validate_token")
     *
     * @param string $token
     *   Token to validate
     *
     * @return JsonResponse
     */
    public function validateToken(string $token): JsonResponse
    {
        if (!$this->tokenService->isValid($token)) {
            return new JsonResponse(['valid' => false]);
        }

        $boxConfiguration = $this->tokenService->getBoxConfiguration($token);

        return new JsonResponse(['valid' => true, 'id' => $boxConfiguration->getId()]);
    }

    /**
     * @Route("/token/get/{id}", name="get_token")
     *
     * @param string $id
     *   Box configuration ID to create token for
     *
     * @return JsonResponse
     *
     * @throws \Exception
     */
    public function getToken($id): JsonResponse
    {
        if (empty($id)) {
            return new JsonResponse(['message' => 'Bad request missing configuration id'], 400);
        }

        // Check that configuration exists.
        $boxConfig = $this->boxConfigurationRepository->findOneBy(['id' => $id]);
        if (is_null($boxConfig)) {
            return new JsonResponse(['message' => 'Bad request wrong configuration id'], 400);
        }

        $token = $this->tokenService->create($boxConfig);

        return new JsonResponse(['token' => $token->getToken(), 'expire' => $token->getTokenExpires()]);
    }
}
