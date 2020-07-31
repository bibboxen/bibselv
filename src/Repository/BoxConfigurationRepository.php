<?php

namespace App\Repository;

use App\Entity\BoxConfiguration;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method BoxConfiguration|null find($id, $lockMode = null, $lockVersion = null)
 * @method BoxConfiguration|null findOneBy(array $criteria, array $orderBy = null)
 * @method BoxConfiguration[]    findAll()
 * @method BoxConfiguration[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BoxConfigurationRepository extends ServiceEntityRepository
{
    /**
     * BoxConfigurationRepository constructor.
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BoxConfiguration::class);
    }

    // /**
    //  * @return BoxConfiguration[] Returns an array of BoxConfiguration objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?BoxConfiguration
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
