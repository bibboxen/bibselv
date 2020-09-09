<?php

namespace App\Entity;

use App\Repository\TokenRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=TokenRepository::class)
 */
class Token
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=32)
     */
    private $token;

    /**
     * @ORM\Column(type="integer", options={"default" = 0})
     */
    private $token_expires = 0;

    /**
     * @ORM\ManyToOne(targetEntity=BoxConfiguration::class)
     */
    private $boxConfiguration;

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
        return $this->token_expires;
    }

    /**
     * @param int $token_expires
     * @return $this
     */
    public function setTokenExpires(int $token_expires): self
    {
        $this->token_expires = $token_expires;

        return $this;
    }
}
