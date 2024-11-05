<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\Sip2UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: Sip2UserRepository::class)]
class Sip2User implements \Stringable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::STRING, length: 255)]
    #[Groups('boxConfiguration')]
    private ?string $username = null;

    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::STRING, length: 255)]
    #[Groups('boxConfiguration')]
    private ?string $password = null;

    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::STRING, length: 16)]
    #[Groups('boxConfiguration')]
    private ?string $agencyId = null;

    /**
     * @var \Doctrine\Common\Collections\Collection<int, \App\Entity\BoxConfiguration>
     */
    #[ORM\OneToMany(targetEntity: BoxConfiguration::class, mappedBy: 'sip2User')]
    private Collection $boxConfigurations;

    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::STRING, length: 255)]
    #[Groups('boxConfiguration')]
    private ?string $location = null;

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
    public function __toString(): string
    {
        return (string) $this->username;
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
     * Get SIP2 Institution Id.
     *
     * @return mixed
     */
    public function getAgencyId(): ?string
    {
        return $this->agencyId;
    }

    /**
     * Set SIP2 Institution Id.
     *
     * @param string $agencyId
     *
     * @return $this
     */
    public function setAgencyId(string $agencyId): self
    {
        $this->agencyId = $agencyId;

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

    /**
     * Get location.
     *
     * @return string
     *   The location string
     */
    public function getLocation(): ?string
    {
        return $this->location;
    }

    /**
     * Set location.
     *
     * @param string $location
     *   Location string to set
     *
     * @return $this
     */
    public function setLocation(string $location): self
    {
        $this->location = $location;

        return $this;
    }
}
