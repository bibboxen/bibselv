<?php

declare(strict_types=1);

/**
 * @file
 * Handle User entities in the easy admin interface.
 */

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCrudController extends AbstractCrudController
{
    public function __construct(private readonly UserPasswordHasherInterface $userPasswordHasher)
    {
    }

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            FormField::addFieldset('User'),
            TextField::new('email'),
            TextField::new('plainPassword', 'Password')->hideOnIndex()->setRequired(true),
        ];
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if (is_a($entityInstance, User::class)) {
            $this->setUserPassword($entityInstance);
        }

        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if (is_a($entityInstance, User::class)) {
            $this->setUserPassword($entityInstance);
        }

        parent::updateEntity($entityManager, $entityInstance);
    }

    private function setUserPassword(User $user): void
    {
        $encodedPassword = $this->userPasswordHasher->hashPassword($user, $user->getPlainPassword());
        $user->setPassword($encodedPassword);
    }
}
