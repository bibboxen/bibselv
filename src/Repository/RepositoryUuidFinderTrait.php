<?php

namespace App\Repository;

use App\Service\UuidEncoder;

/**
 * Trait RepositoryUuidFinderTrait.
 */
trait RepositoryUuidFinderTrait
{
    /**
     * @var UuidEncoder
     */
    protected UuidEncoder $uuidEncoder;

    /**
     * Find entity by encoded uuid
     *
     * @param string $encodedUuid
     * @return mixed
     */
    public function findOneByEncodedUuid(string $encodedUuid)
    {
        return $this->findOneBy([
            'uuid' => $this->uuidEncoder::decode($encodedUuid)
        ]);
    }
}
