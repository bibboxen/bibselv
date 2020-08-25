<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Class Version20200814151852.
 */
final class Version20200814151852 extends AbstractMigration
{
    /**
     * Get description.
     *
     * @return string
     */
    public function getDescription(): string
    {
        return '';
    }

    /**
     * Run up migration.
     *
     * @param Schema $schema
     */
    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE box_configuration (id INT AUTO_INCREMENT NOT NULL, school_id INT NOT NULL, sip2_user_id INT NOT NULL, has_printer TINYINT(1) NOT NULL, reserved_material_instruction VARCHAR(255) NOT NULL, inactivity_time_out INT NOT NULL, sound_enabled TINYINT(1) NOT NULL, name VARCHAR(255) DEFAULT NULL, has_touch TINYINT(1) NOT NULL, has_keyboard TINYINT(1) NOT NULL, INDEX IDX_CB4156DCC32A47EE (school_id), INDEX IDX_CB4156DC4312BD9B (sip2_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE school (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sip2_user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE box_configuration ADD CONSTRAINT FK_CB4156DCC32A47EE FOREIGN KEY (school_id) REFERENCES school (id)');
        $this->addSql('ALTER TABLE box_configuration ADD CONSTRAINT FK_CB4156DC4312BD9B FOREIGN KEY (sip2_user_id) REFERENCES sip2_user (id)');
    }

    /**
     * Run down migration.
     *
     * @param Schema $schema
     */
    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE box_configuration DROP FOREIGN KEY FK_CB4156DCC32A47EE');
        $this->addSql('ALTER TABLE box_configuration DROP FOREIGN KEY FK_CB4156DC4312BD9B');
        $this->addSql('DROP TABLE box_configuration');
        $this->addSql('DROP TABLE school');
        $this->addSql('DROP TABLE sip2_user');
    }
}
