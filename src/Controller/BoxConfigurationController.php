<?php
/**
 * @file
 * Box configuration callback controller.
 */

namespace App\Controller;

use App\Repository\BoxConfigurationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class BoxConfigurationController.
 */
class BoxConfigurationController extends AbstractController
{
     /**
     * @Route("/box/configuration/{uuid}", name="box_configuration")
     *
     * @param $uuid
     *   Box configuration UUID
     * @param BoxConfigurationRepository $boxConfigurationRepository
     *   Box configuration repository
     *
     * @return JsonResponse
     */
    public function index($uuid, BoxConfigurationRepository $boxConfigurationRepository)
    {
        $boxConfiguration = $boxConfigurationRepository->findOneBy(['uuid' => $uuid]);

        if (!$boxConfiguration) {
            throw $this->createNotFoundException('Unknown box configuration');
        }

        return $this->json($boxConfiguration, 200, [], ['groups' => ['boxConfiguration']]);
    }
}
