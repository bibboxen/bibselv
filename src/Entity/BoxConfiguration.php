<?php

namespace App\Entity;

use App\Repository\BoxConfigurationRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=BoxConfigurationRepository::class)
 */
class BoxConfiguration
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     */
    private $hasPrinter;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $reservedMaterialInstruction;

    /**
     * @ORM\Column(type="integer")
     */
    private $inactivityTimeOut;

    /**
     * @ORM\Column(type="boolean")
     */
    private $soundEnabled;

    /**
     * @ORM\ManyToOne(targetEntity=School::class, inversedBy="boxConfigurations")
     * @ORM\JoinColumn(nullable=false)
     */
    private $school;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @ORM\Column(type="boolean")
     */
    private $hasTouch;

    /**
     * @ORM\Column(type="boolean")
     */
    private $hasKeyboard;

    /**
     * @ORM\ManyToOne(targetEntity=Sip2User::class, inversedBy="boxConfigurations")
     * @ORM\JoinColumn(nullable=false)
     */
    private $sip2User;

    public function __toString()
    {
        return $this->name;
    }

    /**
     * Get the id.
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get has printer.
     *
     * @return bool|null
     */
    public function getHasPrinter(): ?bool
    {
        return $this->hasPrinter;
    }

    /**
     * Set has printer.
     *
     * @param bool $hasPrinter
     *
     * @return $this
     */
    public function setHasPrinter(bool $hasPrinter): self
    {
        $this->hasPrinter = $hasPrinter;

        return $this;
    }

    /**
     * Get instruction for reserved materials.
     *
     * @return string|null
     */
    public function getReservedMaterialInstruction(): ?string
    {
        return $this->reservedMaterialInstruction;
    }

    /**
     * Set instruction for reserved materials.
     *
     * @param string $reservedMaterialInstruction
     *
     * @return $this
     */
    public function setReservedMaterialInstruction(string $reservedMaterialInstruction): self
    {
        $this->reservedMaterialInstruction = $reservedMaterialInstruction;

        return $this;
    }

    /**
     * Get inactivity duration.
     *
     * @return int|null
     */
    public function getInactivityTimeOut(): ?int
    {
        return $this->inactivityTimeOut;
    }

    /**
     * Set inactivity duration.
     *
     * @param int $inactivityTimeOut
     *
     * @return $this
     */
    public function setInactivityTimeOut(int $inactivityTimeOut): self
    {
        $this->inactivityTimeOut = $inactivityTimeOut;

        return $this;
    }

    /**
     * Get sound enabled.
     *
     * @return bool|null
     */
    public function getSoundEnabled(): ?bool
    {
        return $this->soundEnabled;
    }

    /**
     * Set sound enabled.
     *
     * @param bool $soundEnabled
     *
     * @return $this
     */
    public function setSoundEnabled(bool $soundEnabled): self
    {
        $this->soundEnabled = $soundEnabled;

        return $this;
    }

    /**
     * Get school.
     *
     * @return School|null
     */
    public function getSchool(): ?School
    {
        return $this->school;
    }

    /**
     * Set school.
     *
     * @param School|null $school
     *
     * @return $this
     */
    public function setSchool(?School $school): self
    {
        $this->school = $school;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getHasTouch(): ?bool
    {
        return $this->hasTouch;
    }

    public function setHasTouch(bool $hasTouch): self
    {
        $this->hasTouch = $hasTouch;

        return $this;
    }

    public function getHasKeyboard(): ?bool
    {
        return $this->hasKeyboard;
    }

    public function setHasKeyboard(bool $hasKeyboard): self
    {
        $this->hasKeyboard = $hasKeyboard;

        return $this;
    }

    public function getSip2User(): ?Sip2User
    {
        return $this->sip2User;
    }

    public function setSip2User(?Sip2User $sip2User): self
    {
        $this->sip2User = $sip2User;

        return $this;
    }
}
