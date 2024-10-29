<?php

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
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class UserCrudController.
 */
class UserCrudController extends AbstractCrudController
{
    private UserPasswordEncoderInterface $passwordEncoder;

    /**
     * UserCrudController constructor.
     *
     * @param userPasswordEncoderInterface $passwordEncoder
     *   Password encoder
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * Get entity fqcn.
     *
     * @return string
     */
    public static function getEntityFqcn(): string
    {
        return User::class;
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
            FormField::addPanel('User'),
                TextField::new('email'),
                TextField::new('plainPassword', 'Password')->hideOnIndex()->setRequired(true),
        ];
    }

    /**
     * Encode password on user save.
     *
     * {@inheritdoc}
     */
    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if (is_a($entityInstance, User::class)) {
            $this->setUserPassword($entityInstance);
        }

        parent::persistEntity($entityManager, $entityInstance);
    }

    /**
     * Encode password on user update.
     *
     * {@inheritdoc}
     */
    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if (is_a($entityInstance, User::class)) {
            $this->setUserPassword($entityInstance);
        }

        parent::updateEntity($entityManager, $entityInstance);
    }

    /**
     * Set encoded user password on entity.
     *
     * @param user $user
     *   The user entity to set encoded password on
     */
    private function setUserPassword(User $user)
    {
        $encodedPassword = $this->passwordEncoder->encodePassword($user, $user->getPlainPassword());
        $user->setPassword($encodedPassword);
    }
}
