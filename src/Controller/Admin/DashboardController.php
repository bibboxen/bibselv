<?php

namespace App\Controller\Admin;

use App\Entity\BoxConfiguration;
use App\Entity\School;
use App\Entity\Sip2User;
use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class DashboardController.
 */
class DashboardController extends AbstractDashboardController
{
    private $adminUrlGenerator;

    public function __construct(AdminUrlGenerator $adminUrlGenerator)
    {
        $this->adminUrlGenerator = $adminUrlGenerator;
    }

    /**
     * @Route("/admin", name="admin")
     *
     * @return Response
     */
    public function index(): Response
    {
        $url = $this->adminUrlGenerator
            ->setController(BoxConfigurationCrudController::class)
            ->generateUrl();

        return $this->redirect($url);
    }

    /**
     * @return Dashboard
     */
    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Bibbox Admin');
    }

    /**
     * @return iterable
     */
    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToCrud('Bibboxes', 'fa fa-laptop', BoxConfiguration::class);
        yield MenuItem::linkToCrud('Schools', 'fa fa-school', School::class);
        yield MenuItem::linkToCrud('SIP2users', 'fa fa-users-cog', Sip2User::class);
        yield MenuItem::linkToCrud('Users', 'fa fa-users', User::class);
    }
}
