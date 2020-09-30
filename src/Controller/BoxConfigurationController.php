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
     * @Route("/box/configuration/{id}", name="box_configuration")
     *
     * @param $id
     *   Box configuration ID
     * @param BoxConfigurationRepository $boxConfigurationRepository
     *   Box configuration repository
     *
     * @return JsonResponse
     */
    public function index($id, BoxConfigurationRepository $boxConfigurationRepository)
    {
        $boxConfiguration = $boxConfigurationRepository->find($id);

        if (!$boxConfiguration) {
            throw $this->createNotFoundException('Unknown box configuration');
        }

        // HACK HACK HACK
        $boxConfiguration->setDefaultLanguageCode(strtolower($boxConfiguration->getDefaultLanguageCode()));

        return $this->json($boxConfiguration, 200, [], ['groups' => ['boxConfiguration']]);
    }
}
