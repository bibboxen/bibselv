<?php

declare(strict_types=1);

/**
 * @file
 * Contains event listener for creating unique id for each box configuration.
 */

namespace App\EventSubscriber;

use App\Entity\BoxConfiguration;
use App\Repository\BoxConfigurationRepository;
use EasyCorp\Bundle\EasyAdminBundle\Event\BeforeEntityPersistedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class BoxConfigurationEventListener.
 */
class BoxConfigurationEventListener implements EventSubscriberInterface
{
    /**
     * BoxConfigurationEventListener constructor.
     *
     * @param BoxConfigurationRepository $boxConfigurationRepository
     */
    public function __construct(private readonly BoxConfigurationRepository $boxConfigurationRepository)
    {
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
                $hash = substr(sha1(time()), 0, 10);

                // Test for uniqueness.
                $entitiesFound = $this->boxConfigurationRepository->findBy(['uniqueId' => $hash]);
                if (0 === \count($entitiesFound)) {
                    $uniqueId = $hash;
                }
            } catch (\Exception) {
            }
        } while (null === $uniqueId);

        $entity->setUniqueId($uniqueId);
    }
}
