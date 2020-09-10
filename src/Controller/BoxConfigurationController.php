<?php

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
     * @TODO: protect this end-point with "Bearer: $token" with lookup for valid token/configId.
     *
     * @param $id
     * @param BoxConfigurationRepository $boxConfigurationRepository
     *
     * @return JsonResponse
     */
    public function index($id, BoxConfigurationRepository $boxConfigurationRepository)
    {
        $boxConfiguration = $boxConfigurationRepository->find($id);

        if (!$boxConfiguration) {
            throw $this->createNotFoundException('Unknown box configuration');
        }

        return $this->json($boxConfiguration, 200, [], ['groups' => ['boxConfiguration']]);
    }
}
