<?php

namespace App\Controller\Admin;

use App\Entity\Sip2User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

/**
 * Class Sip2UserCrudController.
 */
class Sip2UserCrudController extends AbstractCrudController
{
    /**
     * Get entity fqcn.
     *
     * @return string
     */
    public static function getEntityFqcn(): string
    {
        return Sip2User::class;
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
            FormField::addPanel('SIP2user'),
                TextField::new('username'),
                TextField::new('password')->hideOnIndex(),
                TextField::new('agencyId'),
                TextField::new('location'),
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
            ->add('username')
            ->add('boxConfigurations')
        ;
    }
}
