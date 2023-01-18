<?php

namespace App\Service;

use App\Exception\AzureAdException;
use App\Utils\AdLoginState;
use App\Utils\Types\BoxFlowStates;
use ItkDev\OpenIdConnect\Exception\ItkOpenIdConnectException;
use ItkDev\OpenIdConnect\Exception\ValidationException;
use ItkDev\OpenIdConnectBundle\Exception\InvalidProviderException;
use ItkDev\OpenIdConnectBundle\Security\OpenIdConfigurationProviderManager;
use Psr\Cache\InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Cache\Adapter\AdapterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Class AzureAdService.
 */
class AzureAdService
{
    private const AZURE_AD_KEY = 'AzureAd';

    private OpenIdConfigurationProviderManager $providerManager;
    private RequestStack $requestStack;
    private AdapterInterface $cache;
    private LoggerInterface $securityLogger;
    private int $leeway;

    /**
     * AzureAdService constructor.
     *
     * @param OpenIdConfigurationProviderManager $providerManager
     * @param RequestStack $requestStack
     * @param AdapterInterface $cache
     * @param LoggerInterface $securityLogger
     * @param int $leeway
     */
    public function __construct(OpenIdConfigurationProviderManager $providerManager, RequestStack $requestStack, AdapterInterface $cache, LoggerInterface $securityLogger, int $leeway = 10)
    {
        $this->providerManager = $providerManager;
        $this->requestStack = $requestStack;
        $this->cache = $cache;
        $this->securityLogger = $securityLogger;
        $this->leeway = $leeway;
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
     * @throws InvalidProviderException
     * @throws ItkOpenIdConnectException
     */
    public function getLoginUrl(string $uniqueId, string $boxState = BoxFlowStates::CHECK_OUT_ITEMS): string
    {
        $provider = $this->providerManager->getProvider(self::AZURE_AD_KEY);
        $session = $this->requestStack->getSession();
        $boxState = $uniqueId.':'.$boxState;

        $nonce = $provider->generateNonce();
        $session->set('oauth2nonce', $nonce);

        return $provider->getAuthorizationUrl(['state' => $boxState, 'nonce' => $nonce]);
    }

    /**
     * Get the Azure B2C logout URL.
     *
     * @return string
     *   The Azure logout URL with state
     */
    public function getLogoutUrl(): string
    {
        // @TODO Needs to be implemented in https://github.com/itk-dev/openid-connect

        return '';
    }

    /**
     * Get the ad login state from the redirect request.
     *
     * @param Request $request
     *
     * @return AdLoginState
     *
     * @throws ValidationException|InvalidProviderException
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
     * Remove the login state from cache.
     *
     * @param string $boxId
     *
     * @throws InvalidArgumentException
     */
    public function removeLoginState(string $boxId): void
    {
        $this->cache->deleteItem($boxId);
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
     * @throws AzureAdException
     */
    private function getCredentials(Request $request): array
    {
        try {
            $session = $this->requestStack->getSession();
            $provider = $this->providerManager->getProvider(self::AZURE_AD_KEY);

            $idToken = $request->query->get('id_token');

            if (null === $idToken) {
                throw new AzureAdException('Id token not found.');
            }

            if (!is_string($idToken)) {
                throw new AzureAdException('Id token not type string');
            }

            $oauth2nonce = $session->get('oauth2nonce');
            if (null === $oauth2nonce) {
                throw new AzureAdException('oauth2 nonce not found.');
            }

            $claims = $provider->validateIdToken($idToken, $oauth2nonce, $this->leeway);

            if (!property_exists($claims, 'AccountType')) {
                throw new AzureAdException('AccountType not set in claims');
            }
            if (!property_exists($claims, 'UserName')) {
                throw new AzureAdException('UserName not set in claims');
            }

            $this->securityLogger->info($claims->UserName.' logged in with claims '.print_r($claims, true));

            // Authentication successful
        } catch (ItkOpenIdConnectException|InvalidProviderException $e) {
            // Handle failed authentication
            if (isset($claims)) {
                $userName = $claims->UserName ?? 'UNKNOWN';
                $this->securityLogger->error($userName.' log in failed with claims '.print_r($claims, true));
            }

            throw new AzureAdException($e->getMessage(), $e->getCode(), $e);
        } finally {
            $session->remove('oauth2nonce');
        }

        return ['AccountType' => $claims->AccountType, 'UserName' => $claims->UserName];
    }
}
