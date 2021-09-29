<?php

namespace App\Utils\Types;

/**
 * Class BoxFlowStates.
 */
class BoxFlowStates
{
    public const CHECK_OUT_ITEMS = 'checkoutitems';
    public const STATUS = 'status';

    /**
     * Get array of all defined flow states.
     *
     * @return array
     *   An array of flow states.
     *   Uppercase state name in key, lower case state in value.
     */
    public static function getLoginMethodList(): array
    {
        $oClass = new \ReflectionClass(__CLASS__);

        return $oClass->getConstants();
    }
}
