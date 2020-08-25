<?php

namespace App\Controller\Admin;

use App\Entity\School;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

/**
 * Class SchoolCrudController.
 */
class SchoolCrudController extends AbstractCrudController
{
    /**
     * Get entity fqcn.
     *
     * @return string
     */
    public static function getEntityFqcn(): string
    {
        return School::class;
    }

    /**
     * Configure fields.
     *
     * @param string $pageName
     *
     * @return iterable
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm()->hideOnIndex(),
            TextField::new('name'),
            TextField::new('sip2InstitutionId'),
            AssociationField::new('boxConfigurations'),
        ];
    }

    /**
     * Configure filters.
     *
     * @param Filters $filters
     *
     * @return Filters
     */
    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add('name')
            ->add('boxConfigurations')
            ;
    }

    /**
     * Configure crud.
     *
     * @param Crud $crud
     *
     * @return Crud
     */
    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            // the max number of entities to display per page
            ->setPaginatorPageSize(20)
        ;
    }
}
