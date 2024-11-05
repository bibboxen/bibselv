<?php

declare(strict_types=1);

/**
 * @file
 * Box frontend controller for managing Azure AD logout flow.
 */

namespace App\Controller;

use App\Service\AzureAdService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Attribute\Route;

/**
 * class BoxAdLogoutController.
 *
 * Handles login flow for Azure Ad B2C
 */
class BoxAdLogoutController extends AbstractController
{
    /**
     * BoxAdLogoutController constructor.
     *
     * @param AzureAdService $azureAdService
     */
    public function __construct(private readonly AzureAdService $azureAdService)
    {
    }

    /**
     * Endpoint for starting the box login flow.
     *
     * Sets the unique id and box state in the openid connect state
     * and redirects to Azure AD for login
     *
     * @return RedirectResponse
     */
    #[Route(path: '/box/ad-logout', name: 'box_ad_logout')]
    public function index(): RedirectResponse
    {
        $authUrl = $this->azureAdService->getLogoutUrl();

        return new RedirectResponse($authUrl);
    }
}
