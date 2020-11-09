<?php

/**
 * @file
 * Command to clean-up the token database table.
 */

namespace App\Command;

use App\Service\TokenService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class TokenCleanUpCommand.
 */
class TokenCleanUpCommand extends Command
{
    private TokenService $tokenService;

    protected static $defaultName = 'app:token:cleanup';

    /**
     * TokenCleanUpCommand constructor.
     *
     * @param tokenService $tokenService
     *   Service to handle tokens
     */
    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;

        parent::__construct();
    }

    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setDescription('Handle tokens clean up')
            ->addOption('token', null, InputOption::VALUE_OPTIONAL, 'If specified only this token will be removed. It will be removed no matter if it is expired or not.');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $token = $input->getOption('token');

        // If token is supplied then that token is removed, otherwise remove all expired tokens.
        if (!is_null($token)) {
            $this->tokenService->removeToken($token);
            $output->writeln('Token removed:'.$token);
        } else {
            $i = $this->tokenService->removeExpiredTokens();
            $output->writeln('Removed '.$i.' tokens');
        }

        return 0;
    }
}
