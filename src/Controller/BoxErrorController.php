<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\BoxConfigurationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Class BoxErrorController.
 */
class BoxErrorController extends AbstractController
{
    /**
     * BoxErrorController constructor.
     *
     * @param BoxConfigurationRepository $boxConfigurationRepository
     */
    public function __construct(private readonly BoxConfigurationRepository $boxConfigurationRepository)
    {
    }

    /**
     * Error page for failed AD logins.
     *
     * @param SessionInterface $session
     *
     * @return Response
     */
    #[Route(path: '/box/error', name: 'app_box_error')]
    public function index(SessionInterface $session): Response
    {
        $uniqueId = $session->get('boxId');
        $exceptionMessage = $session->get('exceptionMessage');
        $error = $session->get('error');
        $errorDescription = $session->get('errorDescription');

        if (null !== $uniqueId) {
            $boxUrl = $this->generateUrl('box_frontend_load', ['uniqueId' => $uniqueId], UrlGeneratorInterface::ABSOLUTE_URL);
            $box = $this->boxConfigurationRepository->findOneBy(['uniqueId' => $uniqueId]);
            $boxName = $box->getName();
        } else {
            $boxUrl = null;
            $boxName = null;
        }

        return $this->render('box_error/index.html.twig', [
            'controller_name' => 'BoxErrorController',
            'boxId' => $uniqueId,
            'boxUrl' => $boxUrl,
            'boxName' => $boxName,
            'exceptionMessage' => $exceptionMessage,
            'error' => $error,
            'errorDescription' => $errorDescription,
        ]);
    }
}
