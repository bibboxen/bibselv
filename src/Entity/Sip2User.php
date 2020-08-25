<?php

namespace App\Entity;

use App\Repository\Sip2UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=Sip2UserRepository::class)
 */
class Sip2User
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @ORM\OneToMany(targetEntity=BoxConfiguration::class, mappedBy="sip2User")
     */
    private $boxConfigurations;

    /**
     * Sip2User constructor.
     */
    public function __construct()
    {
        $this->boxConfigurations = new ArrayCollection();
    }

    /**
     * Sip2User toString.
     *
     * @return mixed
     */
    public function __toString()
    {
        return $this->username;
    }

    /**
     * Get id.
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get username.
     *
     * @return string|null
     */
    public function getUsername(): ?string
    {
        return $this->username;
    }

    /**
     * Set password.
     *
     * @param string $password
     *
     * @return $this
     */
    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password.
     *
     * @return string|null
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * Set username.
     *
     * @param string $username
     *
     * @return $this
     */
    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get box configurations.
     *
     * @return Collection|BoxConfiguration[]
     */
    public function getBoxConfigurations(): Collection
    {
        return $this->boxConfigurations;
    }

    /**
     * Add box configuration.
     *
     * @param BoxConfiguration $boxConfiguration
     *
     * @return $this
     */
    public function addBoxConfiguration(BoxConfiguration $boxConfiguration): self
    {
        if (!$this->boxConfigurations->contains($boxConfiguration)) {
            $this->boxConfigurations[] = $boxConfiguration;
            $boxConfiguration->setSip2User($this);
        }

        return $this;
    }

    /**
     * Remove box configuration.
     *
     * @param BoxConfiguration $boxConfiguration
     *
     * @return $this
     */
    public function removeBoxConfiguration(BoxConfiguration $boxConfiguration): self
    {
        if ($this->boxConfigurations->contains($boxConfiguration)) {
            $this->boxConfigurations->removeElement($boxConfiguration);
            // set the owning side to null (unless already changed)
            if ($boxConfiguration->getSip2User() === $this) {
                $boxConfiguration->setSip2User(null);
            }
        }

        return $this;
    }
}
