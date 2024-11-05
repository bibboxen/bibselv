<?php

declare(strict_types=1);

/**
 * @file
 * Command to create user in the database.
 */

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class UserCreateCommand.
 */
class UserCreateCommand extends Command
{
    protected static $defaultName = 'app:user:create';

    /**
     * TokenCleanUpCommand constructor.
     *
     * @param UserRepository $userRepository
     *   Handle users in the database
     * @param EntityManagerInterface $entityManager
     *   Database entity manager
     * @param UserPasswordEncoderInterface $passwordEncoder
     *   Password encoder
     */
    public function __construct(private readonly UserRepository $userRepository, private readonly EntityManagerInterface $entityManager, private readonly UserPasswordEncoderInterface $passwordEncoder)
    {
        parent::__construct();
    }

    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setDescription('Create new user')
            ->addOption('email', null, InputOption::VALUE_REQUIRED, 'The users e-mail to create')
            ->addOption('password', null, InputOption::VALUE_OPTIONAL, 'User password if not given random password will be crated');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = $input->getOption('email');
        $password = $input->getOption('password');

        $user = $this->userRepository->findOneBy(['email' => $email]);
        if (!is_null($user)) {
            $output->writeln('<error>User already exists with that e-mail.</error>');

            return 1;
        }

        if (is_null($password)) {
            $password = bin2hex(random_bytes(6));
            $output->writeln('<info>Password: '.$password.'</info>');
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($this->passwordEncoder->encodePassword($user, $password));
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return 0;
    }
}
