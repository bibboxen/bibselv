<?php

/**
 * @file
 * Test controller.
 */

namespace App\Controller\Test;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/test", name="test_")
 */
class TestController extends AbstractController
{
    /**
     * @Route("/fake-online-stable", name="online_stable", condition="env('string:APP_ENV') === 'dev'"))
     *
     * Simulates a stable FBS endpoint for 99 requests.
     *
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    public function fakeOnlineStable()
    {
        return new Response('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>98YYYYYY60099920210503    1117392.00AODK-zzzzz|AMXXXXX|BXYYYYYYYYYYYNNYYY|</response></ns2:sip>', 200);
    }

    /**
     * @Route("/fake-online-unstable", name="online_unstable", condition="env('string:APP_ENV') === 'dev'"))
     *
     * Simulates an unstable FBS endpoint for 99 requests.
     *
     * @return Response
     *   Http response
     *
     * @throws \Exception
     */
    public function fakeOnlineUnstable()
    {
        if (0 === rand(0, 2)) {
            $response = new Response('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>98YYYYYY60099920210503    1117392.00AODK-zzzzz|AMXXXXX|BXYYYYYYYYYYYNNYYY|</response></ns2:sip>', 200);
        } elseif (0 === rand(0, 1)) {
            $response = new Response('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>ERROR INPUT</response></ns2:sip>', 200);
        } else {
            $response = new Response('', 500);
        }

        return $response;
    }
}
