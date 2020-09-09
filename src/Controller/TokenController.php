<?php

namespace App\Controller;

use App\Repository\BoxConfigurationRepository;
use App\Repository\TokenRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class TokenController.
 */
class TokenController extends AbstractController
{
    /**
     * @Route("/token/validate/{token}", name="validate_token")
     *
     * @param $token
     * @param TokenRepository $tokenRepository
     * @param BoxConfigurationRepository $boxConfigurationRepository
     *
     * @return JsonResponse
     */
    public function index($token, TokenRepository $tokenRepository, BoxConfigurationRepository $boxConfigurationRepository)
    {
        $entity = $tokenRepository->findOneBy([ 'token' => $token]);
        if (is_null($entity)) {
            return new JsonResponse(['valid' => false]);
        }

        return new JsonResponse(['valid' => true, 'id' => $entity->getBoxConfiguration()->getId() ]);
    }
}
