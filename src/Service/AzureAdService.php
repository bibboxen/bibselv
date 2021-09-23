<?php

namespace App\Service;

use App\Utils\AdLoginState;
use App\Utils\Types\BoxFlowStates;
use ItkDev\OpenIdConnect\Exception\ItkOpenIdConnectException;
use ItkDev\OpenIdConnect\Exception\ValidationException;
use ItkDev\OpenIdConnect\Security\OpenIdConfigurationProvider;
use Psr\Cache\InvalidArgumentException;
use Symfony\Component\Cache\Adapter\AdapterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Class AzureAdService.
 */
class AzureAdService
{
    private OpenIdConfigurationProvider $provider;
    private RequestStack $requestStack;
    private AdapterInterface $cache;
    private int $leeway;

    /**
     * AzureAdService constructor.
     *
     * @param OpenIdConfigurationProvider $provider
     * @param RequestStack $requestStack
     * @param AdapterInterface $cache
     * @param int $leeway
     */
    public function __construct(OpenIdConfigurationProvider $provider, RequestStack $requestStack, AdapterInterface $cache, int $leeway = 10)
    {
        $this->provider = $provider;
        $this->leeway = $leeway;
        $this->requestStack = $requestStack;
        $this->cache = $cache;
    }

    /**
     * Get the Azure B2C login URL.
     *
     * @param string $uniqueId
     *   The id of the box
     * @param string $boxState
     *   The checkout|status state of the box
     *
     * @return string
     *   The Azure login URL with state
     *
     * @throws ItkOpenIdConnectException
     */
    public function getLoginUrl(string $uniqueId, string $boxState = BoxFlowStates::CHECK_OUT_ITEMS): string
    {
        $session = $this->requestStack->getSession();
        $boxState = $uniqueId.':'.$boxState;

        $nonce = $this->provider->generateNonce();
        $session->set('oauth2nonce', $nonce);

        return $this->provider->getAuthorizationUrl(['state' => $boxState, 'nonce' => $nonce]);
    }

    /**
     * Get the Azure B2C logout URL.
     *
     * @return string
     *   The Azure logout URL with state
     */
    public function getLogoutUrl(): string
    {
        //@TODO Needs to be implemented in https://github.com/itk-dev/openid-connect

        return '';
    }

    /**
     * Get the ad login state from the redirect request.
     *
     * @param Request $request
     *
     * @return AdLoginState
     *
     * @throws ValidationException
     */
    public function getAdLoginState(Request $request): AdLoginState
    {
        $loginState = new AdLoginState();
        $state = $request->query->get('state');

        if ($state) {
            $state = explode(':', $state);

            $loginState->boxId = $state[0];
            $loginState->state = $state[1];
        }

        $claims = $this->getCredentials($request);
        $loginState->accountType = $claims['AccountType'];
        $loginState->userName = $claims['UserName'];

        return $loginState;
    }

    /**
     * Save the login state.
     *
     * @param AdLoginState $adLoginState
     *
     * @throws InvalidArgumentException
     */
    public function saveBoxLoginState(AdLoginState $adLoginState): void
    {
        $item = $this->cache->getItem($adLoginState->boxId);
        $item->set($adLoginState)->expiresAfter(100);
        $this->cache->save($item);
    }

    /**
     * Get the saved login state for a box.
     *
     * @param string $uniqueId
     *
     * @return AdLoginState|null
     *
     * @throws InvalidArgumentException
     */
    public function getBoxLoginState(string $uniqueId): ?AdLoginState
    {
        $adLoginState = null;

        $item = $this->cache->getItem($uniqueId);
        if ($item->isHit()) {
            $adLoginState = $item->get();
            assert($adLoginState instanceof AdLoginState);
        }

        return $adLoginState;
    }

    /**
     * Get credentials from the redirect request.
     *
     * @param Request $request
     *
     * @return array
     *
     * @throws ValidationException
     */
    private function getCredentials(Request $request): array
    {
        $session = $this->requestStack->getSession();
        try {
            $idToken = $request->query->get('id_token');

            if (null === $idToken) {
                throw new ValidationException('Id token not found.');
            }

            if (!is_string($idToken)) {
                throw new ValidationException('Id token not type string');
            }

            $oauth2nonce = $session->get('oauth2nonce');
            if (null === $oauth2nonce) {
                throw new ValidationException('oauth2 nonce not found.');
            }

            $claims = $this->provider->validateIdToken($idToken, $oauth2nonce, $this->leeway);
            // Authentication successful
        } catch (ItkOpenIdConnectException $exception) {
            // Handle failed authentication
            throw new ValidationException($exception->getMessage());
        } finally {
            $session->remove('oauth2nonce');
        }

        return ['AccountType' => $claims->AccountType, 'UserName' => $claims->UserName];
    }
}
