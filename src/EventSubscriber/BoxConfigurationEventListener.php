<?php

namespace App\EventSubscriber;

use App\Entity\BoxConfiguration;
use App\Repository\BoxConfigurationRepository;
use EasyCorp\Bundle\EasyAdminBundle\Event\BeforeEntityPersistedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class BoxConfigurationEventListener implements EventSubscriberInterface
{
    private BoxConfigurationRepository $boxConfigurationRepository;

    /**
     * BoxConfigurationEventListener constructor.
     *
     * @param BoxConfigurationRepository $boxConfigurationRepository
     */
    public function __construct(BoxConfigurationRepository $boxConfigurationRepository)
    {
        $this->boxConfigurationRepository = $boxConfigurationRepository;
    }

    /**
     * Register events.
     *
     * @return array|\string[][]
     */
    public static function getSubscribedEvents()
    {
        return [
            BeforeEntityPersistedEvent::class => ['setUniqueId'],
        ];
    }

    /**
     * Set a unique id for the configuration.
     *
     * @param BeforeEntityPersistedEvent $event
     */
    public function setUniqueId(BeforeEntityPersistedEvent $event)
    {
        $entity = $event->getEntityInstance();

        if (!($entity instanceof BoxConfiguration)) {
            return;
        }

        $uniqueId = null;

        do {
            try {
                $bytes = random_bytes(5);
                $newUniqueId = bin2hex($bytes);

                // Test for uniqueness.
                $entitiesFound = $this->boxConfigurationRepository->findBy(['uniqueId' => $newUniqueId]);
                if (0 === \count($entitiesFound)) {
                    $uniqueId = $newUniqueId;
                }
            } catch (\Exception $e) {
            }
        } while (null === $uniqueId);

        $entity->setUniqueId($uniqueId);
    }
}
