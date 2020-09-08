<?php

namespace App\DataFixtures;

use App\Entity\BoxConfiguration;
use App\Entity\School;
use App\Entity\Sip2User;
use App\Utils\Types\LoginMethods;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

/**
 * Class AppFixtures.
 */
class AppFixtures extends Fixture
{
    private static $schoolNames = [
        'Bakkegårdsskolen',
        'Bavnehøj Skole',
        'Beder Skole',
        'Elev Skole',
        'Ellekærskolen',
        'Ellevangskolen',
        'Elsted Skole',
        'Engdalskolen',
        'Frederiksbjerg Skole',
        'Gammelgaardsskolen',
        'Hasle Skole',
        'Holme Skole',
        'Hårup Skole',
        'Højvangskolen',
        'Katrinebjergskolen',
        'Kolt Skole',
        'Kragelundskolen',
        'Lisbjergskolen',
        'Lystrup Skole',
        'Læssøesgades Skole',
        'Malling Skole',
        'Mårslet Skole',
        'Møllevangskolen',
        'Næshøjskolen',
        'Risskov Skole',
        'Rosenvangskolen',
        'Rundhøjskolen',
        'Sabro-Korsvejskolen',
        'Samsøgades Skole',
        'Skjoldhøjskolen',
        'Skovvangskolen',
        'Skåde Skole',
        'Skæring Skole',
        'Skødstrup Skole',
        'Solbjergskolen',
        'Strandskolen',
        'Sødalskolen',
        'Sølystskolen',
        'Søndervangskolen',
        'Tilst Skole',
        'Tovshøjskolen',
        'Tranbjergskolen',
        'Vejlby skole',
        'Vestergårdsskolen',
        'Viby Skole',
        'Virupskolen',
        'Vorrevangskolen',
        'Åby Skole',
    ];

    /**
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('da_DK');

        $schools = [];
        $sip2users = [];

        foreach (self::$schoolNames as $schoolName) {
            $school = new School();
            $school->setName($schoolName);

            $schools[] = $school;
            $manager->persist($school);
        }

        for ($i = 0; $i < 10; ++$i) {
            $sip2user = new Sip2User();
            $sip2user->setUsername($faker->userName);
            $sip2user->setPassword($faker->password);
            $libraryNumber = $faker->numberBetween(70000, 90000) * 10;
            $sip2user->setAgencyId('DK-'.$libraryNumber);

            $sip2users[] = $sip2user;
            $manager->persist($sip2user);
        }

        for ($i = 0; $i < 200; ++$i) {
            $boxConfiguration = new BoxConfiguration();
            $boxConfiguration->setName($faker->text(50));
            $boxConfiguration->setHasKeyboard($faker->boolean);
            $boxConfiguration->setHasPrinter($faker->boolean);
            $boxConfiguration->setHasTouch($faker->boolean);
            $boxConfiguration->setInactivityTimeOut($faker->numberBetween(60, 600));
            $boxConfiguration->setReservedMaterialInstruction($faker->sentence());
            $boxConfiguration->setSoundEnabled($faker->boolean);
            $boxConfiguration->setSchool($faker->randomElement($schools));
            $boxConfiguration->setSip2User($faker->randomElement($sip2users));
            $boxConfiguration->setLoginMethod($faker->randomElement(LoginMethods::getLoginMethodList()));

            $manager->persist($boxConfiguration);
        }

        $manager->flush();
    }
}
