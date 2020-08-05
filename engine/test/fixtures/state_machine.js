var nock = require('nock');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /^.+<request>63009\d{8}\s{4}\d{6}YYYYYYYYY\|AODK-775100\|AA3210\d{6}\|AC\|AD\d{5}\|<\/request>.+$/)
    .times(2)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>64              00920170619    125152000000000006000000000000AODK-775100|AALN:3210000000|AETestkort Mickey Mouse|BZ9999|CA9999|CB9999|BLY|CQY|BHDKK|BV0.00|CC220.00|AS|AT|AU3846731813%20170626%Prinsesse Mononoke%%m%th%77.7|AU3843081011%20170720%The computer game design course: principles, practices and techniques for the aspiring game designer%%a%xx%79.41|AU4935636731%20170720%Mirjams flugt%Stig Christensen, Christoffer Rosenløv%a%xx%99.4 Jurkofsky Mirjam f. 1925|AU3847679564%20170720%Handbook of computer game studies%%a%xx%79.41|AU3279280422%20170720%Det hemmelige våben%Hergé%a%xx%te sk|AU3841409697%20170720%Bjørnens kløer%Derib%a%xx%te sk|AV|BU|CD|BDJesper Kristensen%Hack Kampmanns Plads 2%8000%Aarhus%DK|BEjeskr@aarhus.dk|PB20000405|</response></ns2:sip>', [
        'Connection',
        'close',
        'Server',
        'fbs-1',
        'Content-Type',
        'application/xml;charset=UTF-8',
        'Content-Length',
        '889',
        'X-RequestId',
        'c3b6abe1-8932-40ca-b883-b3f2607f7219',
        'Date',
        'Mon, 19 Jun 2017 11:07:09 GMT',
        'Strict-Transport-Security',
        'max-age=15552000;',
        'Set-Cookie',
        'f5avrbbbbbbbbbbbbbbbb=LCDEBBIFBJHIPCFHHHODJGOLLLADHJEIGOJOLCHHBKPPCFCDJBBMLAGJFBIIHLBHGIADLBHNBACDJLGOGEHAHHOCBLCPABHEIKFEMMLNHKNJPPPEMEOIEEBJGKCNFDKH; HttpOnly; secure'
    ]);

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /^.+<request>11NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AB3274626533\|AC\|CH\|AD\d{5}\|<\/request>.+$/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>121NUY20170619    125152AODK-775100|AA3210519784|AB3274626533|AJ06850537|AH20170720    000000|CHHelbred dit liv%Hay, Louise L.%a%xx%61.36|BK19adc5e7-2734-4aeb-b255-d259c68928a5|</response></ns2:sip>', [
        'Connection',
        'close',
        'Server',
        'fbs-1',
        'Content-Type',
        'application/xml;charset=UTF-8',
        'Content-Length',
        '317',
        'X-RequestId',
        'a2dc6bfd-5fbf-410a-8612-5f20caaf761d',
        'Date',
        'Mon, 19 Jun 2017 11:07:09 GMT',
        'Strict-Transport-Security',
        'max-age=15552000;',
        'Set-Cookie',
        'f5avrbbbbbbbbbbbbbbbb=IAMDMKMNEKADJKFMEALFOFFKAGEPDLKDKPICKGLLONEBGKJLDAOLBJLEEPOLJLLDKLIDDJMICAMFOBPIHBEACAJCBLFPBHKIPADKGOFEMKFCEOHEMNIOGDDLDBGNNBNG; HttpOnly; secure'
    ]);

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /^.+<request>09N\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|APhb\|AODK-775100\|AB3274626533\|AC\|CH\|<\/request>.+$/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>101YUN20170619    125154AODK-775100|AB3274626533|AQHovedbiblioteket%Voksen%%|AJ06850537|AALN:C0016351730|CHHelbred dit liv%Hay, Louise L.%a%xx%61.36|</response></ns2:sip>', [
        'Connection',
        'close',
        'Server',
        'fbs-1',
        'Content-Type',
        'application/xml;charset=UTF-8',
        'Content-Length',
        '289',
        'X-RequestId',
        'be83630e-b25d-4128-b5a9-814985787de2',
        'Date',
        'Mon, 19 Jun 2017 11:07:11 GMT',
        'Strict-Transport-Security',
        'max-age=15552000;',
        'Set-Cookie',
        'f5avrbbbbbbbbbbbbbbbb=AHCONMACMJGEBPOMMOBPBKLBPODJBGPEIOMAJIFMEAEEEJHLBPKJEKHPLDPCDABDFAADOHHKEAILHMJNLALAPMOPBLMJADEPLKFFCKBHKFLOOCAHILDNGKNBNMDAMFAH; HttpOnly; secure'
    ]);

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /^.+<request>63009\d{8}\s{4}\d{6}YYYYYYYYY\|AODK-775100\|AA3210\d{6}\|AC\|AD\d{5}\|<\/request>.+$/)
    .reply(200,
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>64              00920170619    125152000000000006000000000000AODK-775100|AALN:3210000000|AETestkort Mickey Mouse|BZ9999|CA9999|CB9999|BLY|CQY|BHDKK|BV0.00|CC220.00|' +
        'AS123%3846731813%Reserveringshylde 1%20300621%DK-000000 - Teststed 1%Prinsesse Mononoke%Okay%m%th%77.7|' +
        'AS124%3846731814%Reserveringshylde 2%20300621%DK-000000 - Teststed 2%Prinsesse Mononoke 2%Test Tastesen%m%th%77.7|' +
        'AS125%3846731815%Reserveringshylde 3%20300621%DK-000000 - Teststed 3%Prinsesse Mononoke 3%Toast Toastsen%m%th%77.7|' +
        'AT4935636731%20190720%En flugt%Forfatter Fattersen%a%xx%99.4 Jurkofsky Mirjam f. 1925|' +
        'AU3846731813%20170626%Prinsesse Mononoke%%m%th%77.7|' +
        'AU3843081011%20170720%The computer game design course: principles, practices and techniques for the aspiring game designer%%a%xx%79.41|' +
        'AU4935636731%20170720%Mirjams flugt%Stig Christensen, Christoffer Rosenløv%a%xx%99.4 Jurkofsky Mirjam f. 1925|' +
        'AV3843081014%100%20170721%1000.00%20170720%A computer game%A. Writer%a%xx%80.41|' +
        'BU3843081015%20300720%Two computer games%A. Writer%a%xx%80.41|' +
        'CD12345%3843081016%20250720%Three computer games%A. Writer%a%xx%80.41|' +
        'BDTest Testesen%TestAdresse 1%8000%Aarhus%DK|BEtest@test.dk|PB20000405|</response></ns2:sip>',
        [
            'Connection',
            'close',
            'Server',
            'fbs-1',
            'Content-Type',
            'application/xml;charset=UTF-8',
            'Content-Length',
            '889',
            'X-RequestId',
            'c3b6abe1-8932-40ca-b883-b3f2607f7219',
            'Date',
            'Mon, 19 Jun 2017 11:07:09 GMT',
            'Strict-Transport-Security',
            'max-age=15552000;',
            'Set-Cookie',
            'f5avrbbbbbbbbbbbbbbbb=LCDEBBIFBJHIPCFHHHODJGOLLLADHJEIGOJOLCHHBKPPCFCDJBBMLAGJFBIIHLBHGIADLBHNBACDJLGOGEHAHHOCBLCPABHEIKFEMMLNHKNJPPPEMEOIEEBJGKCNFDKH; HttpOnly; secure'
        ]
    );
