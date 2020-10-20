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
use Symfony\Component\HttpFoundation\Request;
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

        return new JsonResponse(['valid' => true, 'id' => $boxConfiguration->getUniqueId()]);
    }

    /**
     * @Route("/token/get/{uniqueId}", name="get_token")
     *
     * @param string $uniqueId
     *   Box configuration ID to create token for
     *
     * @return JsonResponse
     *
     * @throws \Exception
     */
    public function getToken(string $uniqueId): JsonResponse
    {
        if (empty($uniqueId)) {
            return new JsonResponse(['message' => 'Bad request: Missing configuration id'], 400);
        }

        // Check that configuration exists.
        $boxConfig = $this->boxConfigurationRepository->findOneBy(['uniqueId' => $uniqueId]);
        if (is_null($boxConfig)) {
            return new JsonResponse(['message' => 'Bad request: Wrong configuration id'], 400);
        }

        $token = $this->tokenService->create($boxConfig);

        return new JsonResponse(['token' => $token->getToken(), 'expire' => $token->getTokenExpires()]);
    }

    /**
     * @Route("/token/refresh", name="refresh_token", methods={"POST"})
     *
     * @param request $request
     *   The request
     *
     * @return JsonResponse
     *
     * @throws \Exception
     */
    public function refreshToken(Request $request): JsonResponse
    {
        $body = json_decode($request->getContent());

        $token = $body->token;

        if (empty($token)) {
            return new JsonResponse(['message' => 'Bad request: Missing token'], 400);
        }

        // Check that token exists.
        $token = $this->tokenService->getToken($token);
        if (is_null($token)) {
            return new JsonResponse(['message' => 'Bad request: Wrong token'], 400);
        }

        $token = $this->tokenService->refresh($token);

        return new JsonResponse(['token' => $token->getToken(), 'expire' => $token->getTokenExpires()]);
    }
}
