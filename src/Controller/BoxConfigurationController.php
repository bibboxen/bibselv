<?php
/**
 * @file
 * Box configuration callback controller.
 */

namespace App\Controller;

use App\Repository\BoxConfigurationRepository;
use App\Service\AzureAdService;
use App\Utils\Types\LoginMethods;
use Psr\Cache\InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Cache\Adapter\AdapterInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\TerminateEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class BoxConfigurationController.
 */
class BoxConfigurationController extends AbstractController
{
    private BoxConfigurationRepository $boxConfigurationRepository;
    private AzureAdService $azureAdService;
    private SessionInterface $session;
    private AdapterInterface $cache;
    private EventDispatcherInterface $dispatcher;

    /**
     * BoxConfigurationController constructor.
     *
     * @param BoxConfigurationRepository $boxConfigurationRepository
     * @param AzureAdService $azureAdService
     * @param SessionInterface $session
     * @param AdapterInterface $boxAdStateCache
     */
    public function __construct(BoxConfigurationRepository $boxConfigurationRepository, AzureAdService $azureAdService, SessionInterface $session, AdapterInterface $boxAdStateCache, EventDispatcherInterface $dispatcher)
    {
        $this->boxConfigurationRepository = $boxConfigurationRepository;
        $this->azureAdService = $azureAdService;
        $this->session = $session;
        $this->cache = $boxAdStateCache;
        $this->dispatcher = $dispatcher;
    }

    /**
     * @Route("/box/configuration/{uniqueId}", name="box_configuration")
     *
     * @param SessionInterface $session
     * @param string $uniqueId
     *   Box configuration unique id
     *
     * @return JsonResponse
     *
     * @throws InvalidArgumentException
     */
    final public function index(SessionInterface $session, string $uniqueId): JsonResponse
    {
        $boxConfiguration = $this->boxConfigurationRepository->findOneBy(['uniqueId' => $uniqueId]);

        if (!$boxConfiguration) {
            throw $this->createNotFoundException('Unknown box configuration');
        }

        // @TODO: Hack - Output the languageCode is lowercase - this should be done in the serialisation process.
        $boxConfiguration->setDefaultLanguageCode(strtolower($boxConfiguration->getDefaultLanguageCode()));

        if (LoginMethods::AZURE_AD_LOGIN === $boxConfiguration->getLoginMethod()) {
            $boxState = $this->azureAdService->getBoxLoginState($boxConfiguration->getUniqueId());
            $boxConfiguration->setAdLoginState($boxState);

            // Cleanup after returning response.
            $uniqueId = $boxConfiguration->getUniqueId();
            $this->dispatcher->addListener(
                KernelEvents::TERMINATE,
                function () use ($uniqueId) {
                    $this->azureAdService->removeLoginState($uniqueId);
                }
            );
        }

        return $this->json($boxConfiguration, 200, [], ['groups' => ['boxConfiguration']]);
    }
}
