<?php

/**
 * @file
 * Box frontend controller for managing Azure AD logout flow.
 */

namespace App\Controller;

use App\Service\AzureAdService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * class BoxAdLogoutController.
 *
 * Handles login flow for Azure Ad B2C
 */
class BoxAdLogoutController extends AbstractController
{
    private AzureAdService $azureAdService;

    /**
     * BoxAdLogoutController constructor.
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
     * @Route("/box/ad-logout", name="box_ad_logout")
     */
    public function index(string $uniqueId, string $boxState): RedirectResponse
    {
        $authUrl = $this->azureAdService->getLogoutUrl();

        return new RedirectResponse($authUrl);
    }
}
