<?php

namespace App\Controller\Admin;

use App\Entity\BoxConfiguration;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

/**
 * Class BoxConfigurationCrudController.
 */
class BoxConfigurationCrudController extends AbstractCrudController
{
    /**
     * Get entity fqcn.
     *
     * @return string
     */
    public static function getEntityFqcn(): string
    {
        return BoxConfiguration::class;
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
            FormField::addPanel('Details'),
                IdField::new('id')->hideOnForm()->hideOnIndex(),
                TextField::new('name'),
                AssociationField::new('school'),
                AssociationField::new('sip2User'),
                TextField::new('reservedMaterialInstruction'),

            FormField::addPanel('Options'),
                BooleanField::new('hasTouch')->hideOnIndex(),
                BooleanField::new('hasKeyboard')->hideOnIndex(),
                BooleanField::new('hasPrinter')->hideOnIndex(),
                BooleanField::new('soundEnabled')->hideOnIndex(),
                IntegerField::new('inactivityTimeOut')->hideOnIndex(),
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
            ->add('school')
            ->add('sip2User')
            ;
    }
}
