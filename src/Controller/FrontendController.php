<?php

namespace App\Controller;

use App\Entity\Token;
use App\Repository\BoxConfigurationRepository;
use App\Repository\TokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
    private $engineSocketURI = '';

    /**
     * FrontendController constructor.
     *
     * @param EntityManagerInterface $entityManager
     *   The entity manager to access the database
     * @param BoxConfigurationRepository $boxConfigurationRepository
     *   The box configuration repository
     * @param TokenRepository $tokenRepository
     *   The token repository
     */
    public function __construct(EntityManagerInterface $entityManager, BoxConfigurationRepository $boxConfigurationRepository, TokenRepository $tokenRepository, string $bindEngineSocketURI)
    {
        $this->boxConfigurationRepository = $boxConfigurationRepository;
        $this->tokenRepository = $tokenRepository;
        $this->entityManager = $entityManager;
        $this->engineSocketURI = $bindEngineSocketURI;
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
        } else {
            $token->setTokenExpires(time() + 86400);
        }

        // Make it sticky in the database.
        $this->entityManager->persist($token);
        $this->entityManager->flush();

        return $this->render(
            'frontend.html.twig',
            [
                'token' => $token->getToken(),
                'socketUri' => $this->engineSocketURI,
            ]
        );
    }
}
