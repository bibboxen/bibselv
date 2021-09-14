<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class OidcRedirectUrlController extends AbstractController
{
    /**
     * @Route("/oidc", name="oidc_redirect_url", priority=10)
     */
    public function index(): Response
    {
        return $this->render('oidc_redirect_url/index.html.twig', [
            'controller_name' => 'OidcRedirectUrlController',
        ]);
    }
}
