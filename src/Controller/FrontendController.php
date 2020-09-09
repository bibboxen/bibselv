<?php

namespace App\Controller;

use App\Entity\Token;
use App\Repository\BoxConfigurationRepository;
use App\Repository\TokenRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("", name="frontend_")
 */
class FrontendController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private BoxConfigurationRepository $boxConfigurationRepository;
    private TokenRepository $tokenRepository;

    public function __construct(EntityManagerInterface $entityManager, BoxConfigurationRepository $boxConfigurationRepository, TokenRepository $tokenRepository)
    {
        $this->boxConfigurationRepository = $boxConfigurationRepository;
        $this->tokenRepository = $tokenRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/", name="index")
     *
     * @return Response
     */
    public function index(Request $request)
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

        // Lookup token or generate new token.
        $token = $this->tokenRepository->findOneBy(['boxConfiguration' => $boxConfig]);
        if (is_null($token)) {
            $token = new Token();
            $token->setToken(bin2hex(random_bytes(16)))
                ->setTokenExpires(time() + 86400)
                ->setBoxConfiguration($boxConfig);
            // @TODO: move expire into configuration.
        }
        else {
            $token->setTokenExpires(time() + 86400);
        }

        // Make it sticky in the database.
        $this->entityManager->persist($token);
        $this->entityManager->flush();

        return $this->render(
            'frontend.html.twig',
            [
                'token' => $token->getToken(),
                'socketUri' => 'http://0.0.0.0:3000',
            ]
        );
    }

    /**
     * @Route("/token/get", name="gettoken")
     *
     * @return Response
     */
    public function getToken() {
        $token = bin2hex(random_bytes(16));

        return new JsonResponse([]);
    }
}
