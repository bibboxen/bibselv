<?php

namespace App\Utils\Types;

/**
 * Class LoginMethods.
 */
class LoginMethods
{
    public const LOGIN_BARCODE = 'login_barcode';
    public const LOGIN_BARCODE_PASSWORD = 'login_barcode_password';
    public const UNILOGIN = 'unilogin';

    /**
     * Get array of all defined login methods.
     *
     * @return array
     *   An array of login methods.
     *   Uppercase method name in key, lower case method in value.
     */
    public static function getLoginMethodList(): array
    {
        $oClass = new \ReflectionClass(__CLASS__);

        return $oClass->getConstants();
    }
}
