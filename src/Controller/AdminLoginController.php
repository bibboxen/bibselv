<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

/**
 * Class AdminLoginController.
 */
class AdminLoginController extends AbstractController
{
    /**
     * @Route("/login", name="admin_login")
     *
     * @param AuthenticationUtils $authenticationUtils
     *
     * @return Response
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('admin');
        }

        // Get login error if there is one.
        $error = $authenticationUtils->getLastAuthenticationError();

        // Get last username entered by the user.
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('@EasyAdmin/page/login.html.twig', [
            'csrf_token_intention' => 'authenticate',
            'forgot_password_enabled' => true,
            'username_parameter' => 'email',
            'password_parameter' => 'password',
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    /**
     * @Route("/logout", name="admin_logout")
     */
    public function logout()
    {
    }
}
