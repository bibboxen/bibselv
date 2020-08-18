<?php

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
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Sip2User::class);
    }

    // /**
    //  * @return Sip2User[] Returns an array of Sip2User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Sip2User
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
