<?php

declare(strict_types=1);

/**
 * @file
 * Token entity.
 */

namespace App\Entity;

use App\Repository\TokenRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TokenRepository::class)]
class Token
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 32)]
    private ?string $token = null;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 0])]
    private ?int $tokenExpires = 0;

    #[ORM\ManyToOne(targetEntity: BoxConfiguration::class)]
    private ?BoxConfiguration $boxConfiguration = null;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getToken(): ?string
    {
        return $this->token;
    }

    /**
     * @param string $token
     *
     * @return $this
     */
    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    /**
     * @return BoxConfiguration|null
     */
    public function getBoxConfiguration(): ?BoxConfiguration
    {
        return $this->boxConfiguration;
    }

    /**
     * @param BoxConfiguration|null $boxConfiguration
     *
     * @return $this
     */
    public function setBoxConfiguration(?BoxConfiguration $boxConfiguration): self
    {
        $this->boxConfiguration = $boxConfiguration;

        return $this;
    }

    /**
     * @return int
     */
    public function getTokenExpires(): int
    {
        return $this->tokenExpires;
    }

    /**
     * @param int $tokenExpires
     *
     * @return $this
     */
    public function setTokenExpires(int $tokenExpires): self
    {
        $this->tokenExpires = $tokenExpires;

        return $this;
    }
}
