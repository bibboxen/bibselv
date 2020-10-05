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
     * @Route("/box/configuration/{uniqueId}", name="box_configuration")
     *
     * @param $uniqueId
     *   Box configuration unique id
     * @param BoxConfigurationRepository $boxConfigurationRepository
     *   Box configuration repository
     *
     * @return JsonResponse
     */
    public function index($uniqueId, BoxConfigurationRepository $boxConfigurationRepository)
    {
        $boxConfiguration = $boxConfigurationRepository->findOneBy(['uniqueId' => $uniqueId]);

        if (!$boxConfiguration) {
            throw $this->createNotFoundException('Unknown box configuration');
        }

        // @TODO: Hack - Output the languageCode is lowercase - this should be done in the serialisation process.
        $boxConfiguration->setDefaultLanguageCode(strtolower($boxConfiguration->getDefaultLanguageCode()));

        return $this->json($boxConfiguration, 200, [], ['groups' => ['boxConfiguration']]);
    }
}
