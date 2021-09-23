<?php

/**
 * @file
 * Box frontend controller for managing Azure AD login flow.
 */

namespace App\Controller;

use App\Service\AzureAdService;
use ItkDev\OpenIdConnect\Exception\ItkOpenIdConnectException;
use ItkDev\OpenIdConnect\Exception\ValidationException;
use Psr\Cache\InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * class BoxAdLoginController
 *
 * Handles login flow for Azure Ad B2C
 */
class BoxAdLoginController extends AbstractController
{
    private AzureAdService $azureAdService;

    /**
     * BoxAdLoginController constructor
     *
     * @param AzureAdService $azureAdService
     */
    public function __construct(AzureAdService $azureAdService)
    {
        $this->azureAdService = $azureAdService;
    }

    /**
     * Endpoint for starting the box login flow.
     *
     * Sets the unique id and box state in the openid connect state
     * and redirects to Azure AD for login
     *
     * @Route("/box/ad-login/{uniqueId}/{boxState}", name="box_ad_login")
     *
     * @throws ItkOpenIdConnectException
     */
    public function index(string $uniqueId, string $boxState): RedirectResponse
    {
        $authUrl = $this->azureAdService->getLoginUrl($uniqueId, $boxState);

        return new RedirectResponse($authUrl);
    }

    /**
     * Redirect endpoint that recieves return redirects from Azure AD
     *
     * Validates and gets credentials, sets them on the session and redirects to the
     * specific box URL
     *
     * @Route("/oidc", name="box_ad_redirect_uri")
     *
     * @throws ValidationException
     * @throws InvalidArgumentException
     */
    public function oidc(Request $request): RedirectResponse
    {
        $loginState = $this->azureAdService->getAdLoginState($request);
        $this->azureAdService->saveBoxLoginState($loginState);
        
        $boxUrl = $this->generateUrl('box_frontend_load', array('uniqueId' => $loginState->boxId));
        
        return new RedirectResponse($boxUrl);
    }
}
