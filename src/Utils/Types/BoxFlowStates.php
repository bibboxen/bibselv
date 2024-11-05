<?php

declare(strict_types=1);

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
        $oClass = new \ReflectionClass(self::class);

        return $oClass->getConstants();
    }
}
