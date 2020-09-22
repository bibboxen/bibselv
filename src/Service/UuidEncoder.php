<?php

namespace App\Service;

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

/**
 * Class UuidEncoder.
 */
class UuidEncoder
{
    /**
     * Encode uuid
     *
     * @param UuidInterface $uuid
     *   The uuid to encode
     * @return string
     *   The encoded uuid
     */
    public static function encode(UuidInterface $uuid): string
    {
        return gmp_strval(
            gmp_init(
                str_replace('-', '', $uuid->toString()),
                16
            ),
            62
        );
    }

    /**
     * Decode uuid
     *
     * @param string $encoded
     *   The encoded uuid value
     * @return UuidInterface|null
     *   The decode uuid
     */
    public static function decode(string $encoded): ?UuidInterface
    {
        try {
            return Uuid::fromString(array_reduce(
                [20, 16, 12, 8],
                function ($uuid, $offset) {
                    return substr_replace($uuid, '-', $offset, 0);
                },
                str_pad(
                    gmp_strval(
                        gmp_init($encoded, 62),
                        16
                    ),
                    32,
                    '0',
                    STR_PAD_LEFT
                )
            ));
        } catch (\Throwable $e) {
            return null;
        }
    }
}
