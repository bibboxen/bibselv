var nock = require('nock');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /^.+<request>63009\d{8}\s{4}\d{6}YYYYYYYYY\|AODK-775100\|AA3210\d{6}\|AC\|AD\d{5}\|<\/request>.+$/)
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
