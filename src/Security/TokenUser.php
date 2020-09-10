<?php
/**
 * @file
 * User with information obtained during authentication.
 */

namespace App\Security;

use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class User.
 */
class TokenUser implements UserInterface
{
    private string $token;
    private int $expires;

    /**
     * {@inheritdoc}
     */
    public function getRoles()
    {
        return ['ROLE_BOX_CONFIGURATION_READ'];
    }

    /**
     * {@inheritdoc}
     */
    public function getPassword()
    {
        return $this->token;
    }

    /**
     * {@inheritdoc}
     */
    public function getSalt()
    {
        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function getUsername()
    {
        return $this->token;
    }

    /**
     * {@inheritdoc}
     */
    public function eraseCredentials()
    {
        return null;
    }

    /**
     * Get token.
     *
     * @return string
     *   The token
     */
    public function getToken(): string
    {
        return $this->token;
    }

    /**
     * Set token.
     *
     * @param string $token
     *   Token value to set
     */
    public function setToken(string $token): void
    {
        $this->token = $token;
    }

    /**
     * Get expires.
     *
     * @return int
     *   The timestamp for token expire
     */
    public function getExpires(): int
    {
        return $this->expires;
    }

    /**
     * Set expire.
     *
     * @param int $expires
     *   Timestamp for token expire
     */
    public function setExpires(int $expires): void
    {
        $this->expires = $expires;
    }
}
