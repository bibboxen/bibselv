<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\SchoolRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SchoolRepository::class)]
class School implements \Stringable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::STRING, length: 255)]
    #[Groups('boxConfiguration')]
    private ?string $name = null;

    /**
     * @var \Doctrine\Common\Collections\Collection<int, \App\Entity\BoxConfiguration>
     */
    #[ORM\OneToMany(targetEntity: BoxConfiguration::class, mappedBy: 'school')]
    private Collection $boxConfigurations;

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
    public function __toString(): string
    {
        return (string) $this->name;
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
