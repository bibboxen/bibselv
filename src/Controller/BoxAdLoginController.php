<?php

/**
 * @file
 * Box frontend controller for managing Azure AD login flow.
 */

namespace App\Controller;

use App\Service\AzureAdService;
use ItkDev\OpenIdConnect\Exception\ItkOpenIdConnectException;
use ItkDev\OpenIdConnect\Exception\ValidationException;
use ItkDev\OpenIdConnectBundle\Exception\InvalidProviderException;
use Psr\Cache\InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * class BoxAdLoginController.
 *
 * Handles login flow for Azure Ad B2C
 */
class BoxAdLoginController extends AbstractController
{
    private AzureAdService $azureAdService;
    private LoggerInterface $securityLogger;

    /**
     * BoxAdLoginController constructor.
     *
     * @param AzureAdService $azureAdService
     * @param LoggerInterface $securityLogger
     */
    public function __construct(AzureAdService $azureAdService, LoggerInterface $securityLogger)
    {
        $this->azureAdService = $azureAdService;
        $this->securityLogger = $securityLogger;
    }

    /**
     * Endpoint for starting the box login flow.
     *
     * Sets the unique id and box state in the openid connect state
     * and redirects to Azure AD for login
     *
     * @Route("/box/ad-login/{uniqueId}/{boxState}", name="box_ad_login")
     *
     * @param SessionInterface $session
     * @param string $uniqueId
     *   The id of the box
     * @param string $boxState
     *   The checkout|status state of the box
     *
     * @return RedirectResponse
     */
    public function index(SessionInterface $session, string $uniqueId, string $boxState): RedirectResponse
    {
        try {
            $session->set('boxId', $uniqueId);
            $authUrl = $this->azureAdService->getLoginUrl($uniqueId, $boxState);

            return new RedirectResponse($authUrl);

        } catch (InvalidProviderException | ItkOpenIdConnectException $exception) {
            $session->set('exceptionMessage', $exception->getMessage());

            $this->securityLogger->error($exception);

            return $this->redirectToRoute('app_box_error');
        }
    }

    /**
     * Redirect endpoint that receives return redirects from Azure AD.
     *
     * Validates and gets credentials, sets them on the session and redirects to the
     * specific box URL
     *
     * @Route("/oidc", name="box_ad_redirect_uri")
     *
     * @param Request $request
     * @param SessionInterface $session
     *
     * @return RedirectResponse
     */
    public function oidc(Request $request, SessionInterface $session): RedirectResponse
    {
        try {
            $loginState = $this->azureAdService->getAdLoginState($request);
            $this->azureAdService->saveBoxLoginState($loginState);

            $boxUrl = $this->generateUrl('box_frontend_load', ['uniqueId' => $loginState->boxId]);

            return new RedirectResponse($boxUrl);

        } catch (ValidationException | InvalidArgumentException | InvalidProviderException $exception) {
            $session->set('exceptionMessage', $exception->getMessage());

            $this->securityLogger->error($exception);

            return $this->redirectToRoute('app_box_error');
        }
    }
}
