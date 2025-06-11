<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Sip2User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Sip2User|null find($id, $lockMode = null, $lockVersion = null)
 * @method Sip2User|null findOneBy(array $criteria, array $orderBy = null)
 * @method Sip2User[]    findAll()
 * @method Sip2User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class Sip2UserRepository extends ServiceEntityRepository
{
    /**
     * Sip2UserRepository constructor.
     *
     * @param ManagerRegistry $registry
     *   The manager registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Sip2User::class);
    }
}
