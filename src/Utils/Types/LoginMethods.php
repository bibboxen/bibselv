<?php

declare(strict_types=1);

namespace App\Utils\Types;

/**
 * Class LoginMethods.
 */
class LoginMethods
{
    public const string LOGIN_BARCODE = 'login_barcode';
    public const string LOGIN_BARCODE_PASSWORD = 'login_barcode_password';
    public const string AZURE_AD_LOGIN = 'azure_ad_login';

    /**
     * Get array of all defined login methods.
     *
     * @return array
     *   An array of login methods.
     *   Uppercase method name in key, lower case method in value.
     */
    public static function getLoginMethodList(): array
    {
        $oClass = new \ReflectionClass(self::class);

        return $oClass->getConstants();
    }
}
