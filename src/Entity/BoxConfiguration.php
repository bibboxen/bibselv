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

    // phpcs:disable Zend.NamingConventions.ValidVariableName.MemberVarContainsNumbers
    /**
     * The username for the SIP2 account.
     *
     * @ORM\Column(type="string", length=255)
     */
    private $sip2User;
    // phpcs:enable

    /**
     * @ORM\Column(type="boolean")
     */
    private $soundEnabled;

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
     * Get keyboard type.
     *
     * @return string|null
     */
    public function getKeyboardType(): ?string
    {
        return $this->keyboardType;
    }

    /**
     * Set keyboard type.
     *
     * @param string $keyboardType
     *
     * @return $this
     */
    public function setKeyboardType(string $keyboardType): self
    {
        $this->keyboardType = $keyboardType;

        return $this;
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
     * Get SIP2 user.
     *
     * @return string|null
     */
    public function getSip2User(): ?string
    {
        return $this->sip2User;
    }

    /**
     * Set SIP2 user.
     *
     * @param string $sip2User
     *
     * @return $this
     */
    public function setSip2User(string $sip2User): self
    {
        $this->sip2User = $sip2User;

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
}
