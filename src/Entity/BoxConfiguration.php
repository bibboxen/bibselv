<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\BoxConfigurationRepository;
use App\Utils\AdLoginState;
use App\Utils\Types\LoginMethods;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BoxConfigurationRepository::class)]
class BoxConfiguration implements \Stringable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    #[Groups('boxConfiguration')]
    private ?int $id = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups('boxConfiguration')]
    private ?bool $hasPrinter = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Groups('boxConfiguration')]
    private ?string $reservedMaterialInstruction = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    #[Groups('boxConfiguration')]
    private ?string $otherPermanentLocationInstruction = null;

    #[ORM\Column(type: Types::INTEGER)]
    #[Groups('boxConfiguration')]
    private ?int $inactivityTimeOut = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups('boxConfiguration')]
    private ?bool $soundEnabled = null;

    #[ORM\JoinColumn(nullable: false)]
    #[ORM\ManyToOne(targetEntity: School::class, inversedBy: 'boxConfigurations')]
    #[Groups('boxConfiguration')]
    private ?School $school = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(type: Types::STRING, length: 25, nullable: true)]
    #[Groups('boxConfiguration')]
    private ?string $loginMethod = null;

    #[Groups('boxConfiguration')]
    private ?AdLoginState $adLoginState = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups('boxConfiguration')]
    private ?bool $hasTouch = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups('boxConfiguration')]
    private ?bool $hasKeyboard = null;

    // phpcs:disable Zend.NamingConventions.ValidVariableName.MemberVarContainsNumbers
    /**
     * The SIP2 account.
     */
    #[ORM\JoinColumn(nullable: false)]
    #[ORM\ManyToOne(targetEntity: Sip2User::class, inversedBy: 'boxConfigurations')]
    #[Groups('boxConfiguration')]
    private ?Sip2User $sip2User = null;
    // phpcs:enable

    #[ORM\Column(type: Types::STRING, length: 32)]
    #[Groups('boxConfiguration')]
    private ?string $defaultPassword = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => false])]
    #[Groups('boxConfiguration')]
    private ?bool $debugEnabled = false;

    #[ORM\Column(type: Types::STRING, length: 2, nullable: true, options: ['default' => 'EN'])]
    #[Groups('boxConfiguration')]
    private ?string $defaultLanguageCode = 'EN';

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Groups('boxConfiguration')]
    private ?string $uniqueId = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true, options: ['default' => '1'])]
    #[Groups('boxConfiguration')]
    private ?bool $hasFrontpageCheckIn = true;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    #[Groups('boxConfiguration')]
    private ?int $loginSessionTimeout = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups('boxConfiguration')]
    private ?bool $loginSessionEnabled = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups('boxConfiguration')]
    private $loginSessionMethods = [];

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    #[Groups('boxConfiguration')]
    private ?int $barcodeTimeout = null;

    /**
     * BoxConfiguration toString.
     *
     * @return mixed
     */
    public function __toString(): string
    {
        return (string) $this->name;
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
     * Get instruction for material with another permanent location.
     *
     * @return string|null
     */
    public function getOtherPermanentLocationInstruction(): ?string
    {
        return $this->otherPermanentLocationInstruction;
    }

    /**
     * Set instruction for material with another permanent location.
     *
     * @param string $otherPermanentLocationInstruction
     *
     * @return $this
     */
    public function setOtherPermanentLocationInstruction(string $otherPermanentLocationInstruction): self
    {
        $this->otherPermanentLocationInstruction = $otherPermanentLocationInstruction;

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
     * @return AdLoginState
     */
    public function getAdLoginState(): ?AdLoginState
    {
        return $this->adLoginState;
    }

    /**
     * @param AdLoginState $adLoginState
     */
    public function setAdLoginState(?AdLoginState $adLoginState): void
    {
        $this->adLoginState = $adLoginState;
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

    /**
     * Get default box password (also known as pin code).
     *
     * @return string|null
     *   The default password
     */
    public function getDefaultPassword(): ?string
    {
        return $this->defaultPassword;
    }

    /**
     * Set default password (or pin code).
     *
     * @param string $defaultPassword
     *
     * @return $this
     */
    public function setDefaultPassword(string $defaultPassword): self
    {
        $this->defaultPassword = $defaultPassword;

        return $this;
    }

    /**
     * Get debug state.
     *
     * @return bool
     *   Is true if debug is enabled else false
     */
    public function isDebugEnabled(): bool
    {
        return $this->debugEnabled;
    }

    /**
     * Set debug state.
     *
     * @param bool $debugEnabled
     *  True to enable (default: false)
     *
     * @return $this
     */
    public function setDebugEnabled(bool $debugEnabled): self
    {
        $this->debugEnabled = $debugEnabled;

        return $this;
    }

    /**
     * Get the default language code.
     *
     * @return string
     *   The language code
     */
    public function getDefaultLanguageCode(): string
    {
        return $this->defaultLanguageCode;
    }

    /**
     * Set default language code.
     *
     * @param string $defaultLanguageCode
     *   The language code to use
     *
     * @return $this
     */
    public function setDefaultLanguageCode(string $defaultLanguageCode): self
    {
        $this->defaultLanguageCode = $defaultLanguageCode;

        return $this;
    }

    /**
     * Get unique id.
     *
     * @return string|null
     */
    public function getUniqueId(): ?string
    {
        return $this->uniqueId;
    }

    /**
     * Set unique id.
     *
     * @param string $uniqueId
     *   The unique id
     *
     * @return $this
     */
    public function setUniqueId(string $uniqueId): self
    {
        $this->uniqueId = $uniqueId;

        return $this;
    }

    /**
     * Get has frontpage check in.
     *
     * @return bool|null
     */
    public function getHasFrontpageCheckIn(): ?bool
    {
        return $this->hasFrontpageCheckIn;
    }

    /**
     * Set has frontpage check in.
     *
     * @param bool|null $hasFrontpageCheckIn
     *
     * @return $this
     */
    public function setHasFrontpageCheckIn(?bool $hasFrontpageCheckIn): self
    {
        $this->hasFrontpageCheckIn = $hasFrontpageCheckIn;

        return $this;
    }

    /**
     * Get Login session timeout.
     *
     * @return int|null
     */
    public function getLoginSessionTimeout(): ?int
    {
        return $this->loginSessionTimeout;
    }

    /**
     * Set Login session timeout.
     *
     * @param int|null $loginSessionTimeout
     *
     * @return $this
     */
    public function setLoginSessionTimeout(?int $loginSessionTimeout): self
    {
        $this->loginSessionTimeout = $loginSessionTimeout;

        return $this;
    }

    /**
     * Get login session enabled.
     *
     * @return bool|null
     */
    public function getLoginSessionEnabled(): ?bool
    {
        return $this->loginSessionEnabled;
    }

    /**
     * Set login session enabled.
     *
     * @param bool $loginSessionEnabled
     *
     * @return $this
     */
    public function setLoginSessionEnabled(bool $loginSessionEnabled): self
    {
        $this->loginSessionEnabled = $loginSessionEnabled;

        return $this;
    }

    /**
     * Get login session methods.
     *
     * @return array|null
     */
    public function getLoginSessionMethods(): ?array
    {
        return $this->loginSessionMethods;
    }

    /**
     * Set login session methods.
     *
     * @param array|null $loginSessionMethods
     *
     * @return $this
     */
    public function setLoginSessionMethods(?array $loginSessionMethods): self
    {
        $this->loginSessionMethods = $loginSessionMethods;

        return $this;
    }

    /**
     * Get barcode timeout.
     *
     * @return int|null
     */
    public function getBarcodeTimeout(): ?int
    {
        return $this->barcodeTimeout;
    }

    /**
     * Set barcode timeout.
     *
     * @param int|null $barcodeTimeout
     *
     * @return $this
     */
    public function setBarcodeTimeout(?int $barcodeTimeout): self
    {
        $this->barcodeTimeout = $barcodeTimeout;

        return $this;
    }
}
