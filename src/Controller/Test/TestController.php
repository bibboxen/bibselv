<?php

declare(strict_types=1);

/**
 * @file
 * Test controller.
 */

namespace App\Controller\Test;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

#[\Symfony\Component\Routing\Attribute\Route(path: '/test', name: 'test_')]
class TestController extends AbstractController
{
    /**
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    #[\Symfony\Component\Routing\Attribute\Route(path: '/fake-online-stable', name: 'online_stable', condition: "env('string:APP_ENV') === 'dev'")] // Simulates a stable FBS endpoint for 99 requests.
    public function fakeOnlineStable()
    {
        return new Response('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>98YYYYYY60099920210503    1117392.00AODK-zzzzz|AMXXXXX|BXYYYYYYYYYYYNNYYY|</response></ns2:sip>', Response::HTTP_OK);
    }

    /**
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    #[\Symfony\Component\Routing\Attribute\Route(path: '/fake-online-unstable', name: 'online_unstable', condition: "env('string:APP_ENV') === 'dev'")] // Simulates an unstable FBS endpoint for 99 requests.
    public function fakeOnlineUnstable()
    {
        if (0 === random_int(0, 2)) {
            $response = new Response('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>98YYYYYY60099920210503    1117392.00AODK-zzzzz|AMXXXXX|BXYYYYYYYYYYYNNYYY|</response></ns2:sip>', Response::HTTP_OK);
        } elseif (0 === random_int(0, 1)) {
            $response = new Response('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>ERROR INPUT</response></ns2:sip>', Response::HTTP_OK);
        } else {
            $response = new Response('', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $response;
    }
}
