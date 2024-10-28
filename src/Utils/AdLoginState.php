<?php

namespace App\Utils;

use Symfony\Component\Serializer\Annotation\Groups;

/**
 * class AdLoginState
 * Represents the current user logged in and action on a box.
 */
class AdLoginState implements \Serializable
{
    public string $boxId;

    /**
     * @Groups("boxConfiguration")
     */
    public string $state;

    /**
     * @Groups("boxConfiguration")
     */
    public string $accountType;

    /**
     * @Groups("boxConfiguration")
     */
    public string $userName;

    /**
     * {@inheritDoc}
     */
    final public function serialize(): ?string
    {
        return serialize(
            [
                $this->boxId,
                $this->state,
                $this->accountType,
                $this->userName,
            ]
        );
    }

    /**
     * {@inheritDoc}
     */
    final public function unserialize($data): void
    {
        $list = unserialize($data);
        list(
            $this->boxId,
            $this->state,
            $this->accountType,
            $this->userName,
        ) = $list;
    }
}
