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
     * @param managerRegistry $registry
     *   The manager registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BoxConfiguration::class);
    }
}
