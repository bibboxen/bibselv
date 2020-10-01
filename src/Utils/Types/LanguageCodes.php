<?php

/**
 * @file
 * Language codes - translations available.
 */

namespace App\Utils\Types;

/**
 * Class LanguageCodes.
 */
class LanguageCodes
{
    public const EN = 'English';
    public const DA = 'Dansk';

    /**
     * Get array of all defined language codes.
     *
     * @return array
     *   An array of language codes.
     *   Uppercase code name in key, lower case name in value.
     */
    public static function getLanguageCodeList(): array
    {
        $oClass = new \ReflectionClass(__CLASS__);

        return $oClass->getConstants();
    }
}
