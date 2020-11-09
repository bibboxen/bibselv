<?php
/**
 * @file
 * Handle authentication base on token.
 */

namespace App\Security;

use App\Exception\UnsupportedCredentialsTypeException;
use App\Service\TokenService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

/**
 * Class TokenAuthenticator.
 */
class TokenAuthenticator extends AbstractGuardAuthenticator
{
    private TokenService $tokenService;

    /**
     * TokenAuthenticator constructor.
     *
     * @param tokenService $tokenService
     *  Token service for token handling
     */
    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    /**
     * {@inheritdoc}
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $data = [
            'message' => 'Authentication Required',
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * {@inheritdoc}
     */
    public function supports(Request $request)
    {
        return $request->headers->has('authorization');
    }

    /**
     * {@inheritdoc}
     */
    public function getCredentials(Request $request)
    {
        return $request->headers->get('authorization');
    }

    /**
     * {@inheritdoc}
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        if (null === $credentials) {
            // The token header was empty, authentication fails with HTTP Status
            // Code 401 "Unauthorized"
            return null;
        }

        // Token form the request headers.
        $token = $this->getToken($credentials);

        $user = null;
        if ($this->tokenService->isValid($token)) {
            $entity = $this->tokenService->getToken($token);
            $user = new TokenUser();
            $user->setToken($entity->getToken());
            $user->setExpires($entity->getTokenExpires());
        }

        return $user;
    }

    /**
     * {@inheritdoc}
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        // In case of a token, no credential check is needed.
        // Return `true` to cause authentication success
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $data = [
            'message' => 'Authentication failed',
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * {@inheritdoc}
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey)
    {
        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function supportsRememberMe()
    {
        return false;
    }

    /**
     * Get the bearer token from credentials.
     *
     * @param mixed $credentials
     *   Request credentials
     *
     * @return string|null
     *   Token string if found, null if no token or empty credentials
     *
     * @throws UnsupportedCredentialsTypeException
     */
    private function getToken($credentials): ?string
    {
        if (null === $credentials) {
            // The token header was empty, authentication fails with HTTP Status
            // Code 401 "Unauthorized"
            return null;
        }

        // Parse token information from the bearer authorization header.
        if (is_string($credentials) && 1 === preg_match('/Bearer\s(\w+)/', $credentials, $matches)) {
            return $matches[1];
        }

        throw new UnsupportedCredentialsTypeException('Only credentials of type string (e.g. bearer authorization header) supported');
    }
}
