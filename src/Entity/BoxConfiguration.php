<?php

namespace App\Entity;

use App\Repository\BoxConfigurationRepository;
use App\Utils\Types\LoginMethods;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=BoxConfigurationRepository::class)
 */
class BoxConfiguration
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     *
     * @Groups("boxConfiguration")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     *
     * @Groups("boxConfiguration")
     */
    private $hasPrinter;

    /**
     * @ORM\Column(type="string", length=255)
     *
     * @Groups("boxConfiguration")
     */
    private $reservedMaterialInstruction;

    /**
     * @ORM\Column(type="integer")
     *
     * @Groups("boxConfiguration")
     */
    private $inactivityTimeOut;

    /**
     * @ORM\Column(type="boolean")
     *
     * @Groups("boxConfiguration")
     */
    private $soundEnabled;

    /**
     * @ORM\ManyToOne(targetEntity=School::class, inversedBy="boxConfigurations")
     * @ORM\JoinColumn(nullable=false)
     *
     * @Groups("boxConfiguration")
     */
    private $school;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=25, nullable=true)
     *
     * @Groups("boxConfiguration")
     */
    private $loginMethod;

    /**
     * @ORM\Column(type="boolean")
     *
     * @Groups("boxConfiguration")
     */
    private $hasTouch;

    /**
     * @ORM\Column(type="boolean")
     *
     * @Groups("boxConfiguration")
     */
    private $hasKeyboard;

    // phpcs:disable Zend.NamingConventions.ValidVariableName.MemberVarContainsNumbers
    /**
     * The SIP2 account.
     *
     * @ORM\ManyToOne(targetEntity=Sip2User::class, inversedBy="boxConfigurations")
     * @ORM\JoinColumn(nullable=false)
     */
    private $sip2User;
    // phpcs:enable

    /**
     * BoxConfiguration toString.
     *
     * @return mixed
     */
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
     * @param string|null $name
     *
     * @return $this
     */
    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get login method.
     *
     * @return string|null
     */
    public function getLoginMethod(): ?string
    {
        return $this->loginMethod;
    }

    /**
     * Set login method.
     *
     * @param string $loginMethod
     *
     * @return $this
     */
    public function setLoginMethod(string $loginMethod): self
    {
        if (!in_array($loginMethod, LoginMethods::getLoginMethodList())) {
            throw new \InvalidArgumentException('Invalid login method given');
        }

        $this->loginMethod = $loginMethod;

        return $this;
    }

    /**
     * Get has touch.
     *
     * @return bool|null
     */
    public function getHasTouch(): ?bool
    {
        return $this->hasTouch;
    }

    /**
     * Set has touch.
     *
     * @param bool $hasTouch
     *
     * @return $this
     */
    public function setHasTouch(bool $hasTouch): self
    {
        $this->hasTouch = $hasTouch;

        return $this;
    }

    /**
     * Get has keyboard.
     *
     * @return bool|null
     */
    public function getHasKeyboard(): ?bool
    {
        return $this->hasKeyboard;
    }

    /**
     * Set has keyboard.
     *
     * @param bool $hasKeyboard
     *
     * @return $this
     */
    public function setHasKeyboard(bool $hasKeyboard): self
    {
        $this->hasKeyboard = $hasKeyboard;

        return $this;
    }

    /**
     * Get Sip2User.
     *
     * @return Sip2User|null
     */
    public function getSip2User(): ?Sip2User
    {
        return $this->sip2User;
    }

    /**
     * Set Sip2User.
     *
     * @param Sip2User|null $sip2User
     *
     * @return $this
     */
    public function setSip2User(?Sip2User $sip2User): self
    {
        $this->sip2User = $sip2User;

        return $this;
    }
}
