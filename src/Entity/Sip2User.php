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
     * @ORM\OneToMany(targetEntity=BoxConfiguration::class, mappedBy="sip2User")
     */
    private $boxConfigurations;

    public function __construct()
    {
        $this->boxConfigurations = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->username;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @return Collection|BoxConfiguration[]
     */
    public function getBoxConfigurations(): Collection
    {
        return $this->boxConfigurations;
    }

    public function addBoxConfiguration(BoxConfiguration $boxConfiguration): self
    {
        if (!$this->boxConfigurations->contains($boxConfiguration)) {
            $this->boxConfigurations[] = $boxConfiguration;
            $boxConfiguration->setSip2User($this);
        }

        return $this;
    }

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
