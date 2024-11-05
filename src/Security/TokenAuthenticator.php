<?php

declare(strict_types=1);

/**
 * @file
 * Handle authentication base on token.
 */

namespace App\Security;

use App\Exception\UnsupportedCredentialsTypeException;
use App\Repository\TokenRepository;
use App\Service\TokenService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

/**
 * Class TokenAuthenticator.
 */
class TokenAuthenticator extends AbstractAuthenticator
{
    private const AUTHORIZATION_HEADER = 'authorization';

    public function __construct(private readonly TokenService $tokenService)
    {
    }

    public function supports(Request $request): ?bool
    {
        return $request->headers->has(self::AUTHORIZATION_HEADER);
    }

    public function authenticate(Request $request): Passport
    {
        $authorizationHeader = $request->headers->get(self::AUTHORIZATION_HEADER);
        if (null === $authorizationHeader) {
            // The token header was empty, authentication fails with HTTP Status
            // Code 401 "Unauthorized"
            throw new CustomUserMessageAuthenticationException('No authorization header set');
        }

        $tokenString = $this->getTokenStringFromHeader($authorizationHeader);

        if (!$this->tokenService->isValid($tokenString)) {
            throw new CustomUserMessageAuthenticationException('Token not valid');
        }

        return new SelfValidatingPassport(new UserBadge($tokenString));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            'message' => 'Authentication failed',
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Get the bearer token from credentials.
     *
     * @param string $credentials
     *   Request credentials
     *
     * @return string|null
     *   Token string if found, null if no token or empty credentials
     *
     * @throws UnsupportedCredentialsTypeException
     */
    private function getTokenStringFromHeader(string $credentials): ?string
    {
        // Parse token information from the bearer authorization header.
        if (1 === preg_match('/Bearer\s(\w+)/', $credentials, $matches)) {
            return $matches[1];
        }

        throw new UnsupportedCredentialsTypeException('Only credentials of type string (e.g. bearer authorization header) supported');
    }
}
