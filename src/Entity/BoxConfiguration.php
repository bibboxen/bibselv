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
     * @ORM\Column(type="string", length=255)
     */
    private $keyboardType;

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
     * @ORM\Column(type="string", length=255)
     */
    private $sip2User;

    /**
     * @ORM\Column(type="boolean")
     */
    private $soundEnabled;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getKeyboardType(): ?string
    {
        return $this->keyboardType;
    }

    public function setKeyboardType(string $keyboardType): self
    {
        $this->keyboardType = $keyboardType;

        return $this;
    }

    public function getHasPrinter(): ?bool
    {
        return $this->hasPrinter;
    }

    public function setHasPrinter(bool $hasPrinter): self
    {
        $this->hasPrinter = $hasPrinter;

        return $this;
    }

    public function getReservedMaterialInstruction(): ?string
    {
        return $this->reservedMaterialInstruction;
    }

    public function setReservedMaterialInstruction(string $reservedMaterialInstruction): self
    {
        $this->reservedMaterialInstruction = $reservedMaterialInstruction;

        return $this;
    }

    public function getInactivityTimeOut(): ?int
    {
        return $this->inactivityTimeOut;
    }

    public function setInactivityTimeOut(int $inactivityTimeOut): self
    {
        $this->inactivityTimeOut = $inactivityTimeOut;

        return $this;
    }

    public function getSip2User(): ?string
    {
        return $this->sip2User;
    }

    public function setSip2User(string $sip2User): self
    {
        $this->sip2User = $sip2User;

        return $this;
    }

    public function getSoundEnabled(): ?bool
    {
        return $this->soundEnabled;
    }

    public function setSoundEnabled(bool $soundEnabled): self
    {
        $this->soundEnabled = $soundEnabled;

        return $this;
    }
}
