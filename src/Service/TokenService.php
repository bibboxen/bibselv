<?php

/**
 * @file
 * Service to handle tokens.
 */

namespace App\Service;

use App\Entity\BoxConfiguration;
use App\Entity\Token;
use App\Repository\TokenRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class TokenService.
 */
class TokenService
{
    private EntityManagerInterface $entityManager;
    private TokenRepository $tokenRepository;
    private int $tokenExpireSeconds;

    /**
     * TokenService constructor.
     *
     * @param EntityManagerInterface $entityManager
     *   Entity manager
     * @param TokenRepository $tokenRepository
     *   Token repository
     * @param int $bindTokenExpireSeconds
     *   The token expire in seconds
     */
    public function __construct(EntityManagerInterface $entityManager, TokenRepository $tokenRepository, int $bindTokenExpireSeconds)
    {
        $this->entityManager = $entityManager;
        $this->tokenRepository = $tokenRepository;
        $this->tokenExpireSeconds = $bindTokenExpireSeconds;
    }

    /**
     * Check if token is valid.
     *
     * @param string $token
     *   The token to check
     *
     * @return bool
     *   If valid true else false
     */
    public function isValid(string $token): bool
    {
        $entity = $this->tokenRepository->findOneBy(['token' => $token]);
        if (!is_null($entity) && $entity->getTokenExpires() > time()) {
            return true;
        }

        return false;
    }

    /**
     * Get box configuration from token, if token is valid.
     *
     * @param string $token
     *   The token to get config for
     *
     * @return boxConfiguration|null
     *   Box configuration or null if not found
     */
    public function getBoxConfiguration(string $token): ?BoxConfiguration
    {
        if ($this->isValid($token)) {
            $entity = $this->tokenRepository->findOneBy(['token' => $token]);
            if (!is_null($entity)) {
                return $entity->getBoxConfiguration();
            }
        }

        return null;
    }

    /**
     * Get token entity from token.
     *
     * @param string $token
     *   Token to load entity for
     *
     * @return token|null
     *   Token entity if found else null
     */
    public function getToken(string $token): ?Token
    {
        return $this->tokenRepository->findOneBy(['token' => $token]);
    }

    /**
     * Create new token.
     *
     * @param boxConfiguration $boxConfiguration
     *   Box configuration to link to the token
     *
     * @return token
     *   Token entity
     *
     * @throws \Exception
     */
    public function create(BoxConfiguration $boxConfiguration): Token
    {
        $token = new Token();
        $token->setToken($this->generate())
            ->setTokenExpires(time() + $this->tokenExpireSeconds)
            ->setBoxConfiguration($boxConfiguration);

        // Make it sticky in the database.
        $this->entityManager->persist($token);
        $this->entityManager->flush();

        return $token;
    }

    /**
     * Refresh token.
     *
     * @param token $token
     *   The token to refresh
     *
     * @return token
     *   Token entity
     */
    public function refresh(Token $token): Token
    {
        // Set new expire.
        $token->setTokenExpires(time() + $this->tokenExpireSeconds);

        // Make it sticky in the database.
        $this->entityManager->flush();

        return $token;
    }

    /**
     * Remove all expired tokens.
     *
     * @return int
     *   The number of removed tokens
     */
    public function removeExpiredTokens(): int
    {
        $batchSize = 100;
        $i = 1;
        $q = $this->entityManager->createQuery('SELECT t from App\Entity\Token t WHERE t.tokenExpires < :time')
            ->setParameter('time', time());
        $iterableResult = $q->iterate();
        while (false !== ($row = $iterableResult->next())) {
            $this->entityManager->remove($row[0]);
            if (0 === ($i % $batchSize)) {
                $this->entityManager->flush();
                $this->entityManager->clear();
            }
            ++$i;
        }
        $this->entityManager->flush();

        return $i - 1;
    }

    /**
     * Remove token from storage.
     *
     * @param string $token
     *   The token to remove
     */
    public function removeToken(string $token)
    {
        $entity = $this->getToken($token);
        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }

    /**
     * Generate new token.
     *
     * @return string
     *   Random 32 char token
     *
     * @throws \Exception
     */
    private function generate(): string
    {
        return bin2hex(random_bytes(16));
    }
}
