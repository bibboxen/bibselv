<?php

declare(strict_types=1);

namespace App\Utils;

use Symfony\Component\Serializer\Annotation\Groups;

/**
 * class AdLoginState
 * Represents the current user logged in and action on a box.
 */
class AdLoginState implements \Serializable
{
    public string $boxId;

    #[Groups('boxConfiguration')]
    public string $state;

    #[Groups('boxConfiguration')]
    public string $accountType;

    #[Groups('boxConfiguration')]
    public string $userName;

    public function __serialize(): array
    {
        return [
            'boxId' => $this->boxId,
            'state' => $this->state,
            'accountType' => $this->accountType,
            'userName' => $this->userName,
        ];
    }

    public function __unserialize(array $data): void
    {
        $this->boxId = $data['boxId'];
        $this->state = $data['state'];
        $this->accountType = $data['accountType'];
        $this->userName = $data['userName'];
    }

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
        [$this->boxId, $this->state, $this->accountType, $this->userName] = $list;
    }
}
