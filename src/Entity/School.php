<?php

namespace App\Entity;

use App\Repository\SchoolRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=SchoolRepository::class)
 */
class School
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
    private $name;

    // phpcs:disable Zend.NamingConventions.ValidVariableName.MemberVarContainsNumbers
    /**
     * @ORM\Column(type="string", length=16)
     */
    private $sip2InstitutionId;
    // phpcs:enable

    /**
     * @ORM\OneToMany(targetEntity=BoxConfiguration::class, mappedBy="school")
     */
    private $boxConfigurations;

    /**
     * School constructor.
     */
    public function __construct()
    {
        $this->boxConfigurations = new ArrayCollection();
    }

    /**
     * School toString.
     *
     * @return mixed
     */
    public function __toString()
    {
        return $this->name;
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
     * Get name.
     *
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * Set name.
     *
     * @param string $name
     *
     * @return $this
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get SIP2 Institution Id.
     *
     * @return mixed
     */
    public function getSip2InstitutionId(): ?string
    {
        return $this->sip2InstitutionId;
    }

    /**
     * Set SIP2 Institution Id.
     *
     * @param string $sip2InstitutionId
     *
     * @return $this
     */
    public function setSip2InstitutionId(string $sip2InstitutionId): self
    {
        $this->sip2InstitutionId = $sip2InstitutionId;

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
            $boxConfiguration->setSchool($this);
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
            if ($boxConfiguration->getSchool() === $this) {
                $boxConfiguration->setSchool(null);
            }
        }

        return $this;
    }
}
