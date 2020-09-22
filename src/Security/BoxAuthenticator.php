<?php

namespace App\Security;

use App\Repository\BoxConfigurationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

/**
 * Class BoxAuthenticator.
 */
class BoxAuthenticator extends AbstractGuardAuthenticator
{
    private BoxConfigurationRepository $boxConfigurationRepository;
    private EntityManagerInterface $entityManager;

    /**
     * BoxAuthenticator constructor.
     *
     * @param BoxConfigurationRepository $boxConfigurationRepository
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(BoxConfigurationRepository $boxConfigurationRepository, EntityManagerInterface $entityManager)
    {
        $this->boxConfigurationRepository = $boxConfigurationRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * @param Request $request
     *
     * @return bool
     */
    public function supports(Request $request)
    {
        return $request->query->has('token');
    }

    /**
     * @param Request $request
     *
     * @return bool|float|int|mixed|string|null
     */
    public function getCredentials(Request $request)
    {
        return $request->query->get('token');
    }

    /**
     * Get box configuration.
     *
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     *
     * @return UserInterface|null
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        if (null === $credentials) {
            return null;
        }

        // Check if user exists with token.
        $boxConfiguration = $this->boxConfigurationRepository->findOneBy(['authToken' => $credentials]);
        if (null === $boxConfiguration) {
            return null;
        }

        // Check if token is expired.
        if ($boxConfiguration->getAuthTokenExpires() <= Carbon::now()->getTimestamp()) {
            return null;
        }

        // Remove token to enabled on-time-login.
        $boxConfiguration->setAuthTokenExpires(0);
        $boxConfiguration->setAuthToken(null);
        $this->entityManager->flush();

        return $boxConfiguration;
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     *
     * @return bool
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        return true;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     *
     * @return Response|Response|null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new Response('Authentication failed', 401);
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     *
     * @return Response|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey)
    {
        return null;
    }

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     *
     * @return false|Response
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        return false;
    }

    /**
     * @return Response|bool
     */
    public function supportsRememberMe()
    {
        return new Response('Authentication required', 401);
    }
}
