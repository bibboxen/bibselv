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
use Symfony\Component\Security\Core\Encoder\EncoderFactory;
use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

/**
 * Class UserCrudController.
 */
class UserCrudController extends AbstractCrudController
{
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
            $encodedPassword = $this->encodePassword($entityInstance, $entityInstance->getPlainPassword());
            $entityInstance->setPassword($encodedPassword);
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
            $encodedPassword = $this->encodePassword($entityInstance, $entityInstance->getPlainPassword());
            $entityInstance->setPassword($encodedPassword);
        }

        parent::updateEntity($entityManager, $entityInstance);
    }

    /**
     * Helper function to encode users plain password.
     *
     * @param user $user
     *   The user to encode password for
     * @param string $password
     *   The password to encode
     *
     * @return string
     *   The encoded password
     */
    private function encodePassword(User $user, string $password)
    {
        $passwordEncoderFactory = new EncoderFactory([
            User::class => new MessageDigestPasswordEncoder(),
        ]);
        $encoder = $passwordEncoderFactory->getEncoder($user);

        return $encoder->encodePassword($password, $user->getSalt());
    }
}
