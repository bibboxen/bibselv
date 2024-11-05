<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

/**
 * Class AdminLoginController.
 */
class AdminLoginController extends AbstractController
{
    /**
     * @param AuthenticationUtils $authenticationUtils
     *
     * @return Response
     */
    #[\Symfony\Component\Routing\Attribute\Route(path: '/login', name: 'admin_login')]
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

    #[\Symfony\Component\Routing\Attribute\Route(path: '/logout', name: 'admin_logout')]
    public function logout()
    {
    }
}
