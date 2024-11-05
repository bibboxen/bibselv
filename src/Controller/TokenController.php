<?php

declare(strict_types=1);

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
    /**
     * TokenController constructor.
     *
     * @param TokenService $tokenService
     *   Token service to validate tokens and more
     * @param BoxConfigurationRepository $boxConfigurationRepository
     *   Box configuration repository to load configuration
     */
    public function __construct(private readonly TokenService $tokenService, private readonly BoxConfigurationRepository $boxConfigurationRepository)
    {
    }

    /**
     * @param string $token
     *   Token to validate
     *
     * @return JsonResponse
     */
    #[Route(path: '/token/validate/{token}', name: 'validate_token')]
    public function validateToken(string $token): JsonResponse
    {
        if (!$this->tokenService->isValid($token)) {
            return new JsonResponse(['valid' => false]);
        }

        $boxConfiguration = $this->tokenService->getBoxConfiguration($token);

        return new JsonResponse(['valid' => true, 'id' => $boxConfiguration->getUniqueId()]);
    }

    /**
     * @param string $uniqueId
     *   Box configuration ID to create token for
     *
     * @return JsonResponse
     *   The token on the form:
     *   {
     *     "token": "Token",
     *     "expire": "Timestamp in seconds for token expire"
     *   }
     *
     * @throws \Exception
     */
    #[Route(path: '/token/get/{uniqueId}', name: 'get_token')]
    public function getToken(string $uniqueId): JsonResponse
    {
        if (empty($uniqueId)) {
            return new JsonResponse(['message' => 'Bad request: Missing configuration id'], \Symfony\Component\HttpFoundation\Response::HTTP_BAD_REQUEST);
        }

        // Check that configuration exists.
        $boxConfig = $this->boxConfigurationRepository->findOneBy(['uniqueId' => $uniqueId]);
        if (is_null($boxConfig)) {
            return new JsonResponse(['message' => 'Bad request: Wrong configuration id'], \Symfony\Component\HttpFoundation\Response::HTTP_BAD_REQUEST);
        }

        $token = $this->tokenService->create($boxConfig);

        return new JsonResponse(['token' => $token->getToken(), 'expire' => $token->getTokenExpires()]);
    }

    /**
     * @param Request $request
     *   The request
     *
     * @return JsonResponse
     *   The token on the form:
     *   {
     *     "token": "Token",
     *     "expire": "Timestamp in seconds for token expire"
     *   }
     */
    #[Route(path: '/token/refresh', name: 'refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $body = json_decode($request->getContent(), false, 512, JSON_THROW_ON_ERROR);

            $token = $body->token ?? null;

            if (empty($token)) {
                return new JsonResponse(['message' => 'Bad request: Missing token'], \Symfony\Component\HttpFoundation\Response::HTTP_BAD_REQUEST);
            }

            // Check that token exists.
            $token = $this->tokenService->getToken($token);
            if (is_null($token)) {
                return new JsonResponse(['message' => 'Bad request: Wrong token'], \Symfony\Component\HttpFoundation\Response::HTTP_BAD_REQUEST);
            }

            $token = $this->tokenService->refresh($token);

            return new JsonResponse(['token' => $token->getToken(), 'expire' => $token->getTokenExpires()]);
        } catch (\JsonException) {
            return new JsonResponse(['message' => 'Bad request: Error parsing json'], \Symfony\Component\HttpFoundation\Response::HTTP_BAD_REQUEST);
        }
    }
}
