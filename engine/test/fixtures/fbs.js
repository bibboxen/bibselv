var nock = require('nock');

/**
 * Login request
 */
nock('https://cicero-fbs.com:443')
    .post('/rest/sip2/DK-775100', /<request>23009\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AC\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>24              00920170619    125151AODK-775100|AALN:3210519784|AETestkort Mickey Mouse|BLY|CQY|</response></ns2:sip>');

/**
 * Login request - fails
 */
nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>23009\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AC\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>24              00920170619    125151AODK-775100|AAANY:3210519792|BLN|CQN|</response></ns2:sip>');

/**
 * Request library status
 */
nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .persist()
    .post('/rest/sip2/DK-775100', /<request>990xxx2.00<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>98YYYYYY60099920170619    1307082.00AODK-775100|AMAarhus Kommunes Biblioteker. Borgerservice og Biblioteker|BXYYYYYYYYYYYNNYYY|</response></ns2:sip>');

/**
 * Load patron information
 */
nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>63009\d{8}\s{4}\d{6}YYYYYYYYY\|AODK-775100\|AA3210\d{6}\|AC\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>64              00920170619    125152000000000006000000000000AODK-775100|AALN:3210000000|AETestkort Mickey Mouse|BZ9999|CA9999|CB9999|BLY|CQY|BHDKK|BV0.00|CC220.00|AS|AT|AU3846731813%20170626%Prinsesse Mononoke%%m%th%77.7|AU3843081011%20170720%The computer game design course: principles, practices and techniques for the aspiring game designer%%a%xx%79.41|AU4935636731%20170720%Mirjams flugt%Stig Christensen, Christoffer Rosenløv%a%xx%99.4 Jurkofsky Mirjam f. 1925|AU3847679564%20170720%Handbook of computer game studies%%a%xx%79.41|AU3279280422%20170720%Det hemmelige våben%Hergé%a%xx%te sk|AU3841409697%20170720%Bjørnens kløer%Derib%a%xx%te sk|AV|BU|CD|BDJesper Kristensen%Hack Kampmanns Plads 2%8000%Aarhus%DK|BEjeskr@aarhus.dk|PB20000405|</response></ns2:sip>');

/**
 * Checkout (loan) book with id "3274626533"
 */
nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>11NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AB3274626533\|AC\|CH\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>121NUY20170619    125152AODK-775100|AA3210519784|AB3274626533|AJ06850537|AH20170720    000000|CHHelbred dit liv%Hay, Louise L.%a%xx%61.36|BK19adc5e7-2734-4aeb-b255-d259c68928a5|</response></ns2:sip>');

/**
 * Renew book with is "3274626533".
 */
nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>29NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AD\d{5}\|AB3274626533\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>300NUN20170619    125153AODK-775100|AA3210519784|AB3274626533|AJ06850537|AH20170720    000000|CHHelbred dit liv%Hay, Louise L.%a%xx%61.36|BKe0c0d0f5-eb25-4eb7-98d6-c234611c94b9|AF[BEFORE_RENEW_PERIOD]|</response></ns2:sip>');

/**
 * Renew all books all
 */
nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>65\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>6610000000720170619    125153AODK-775100|BN3846731813%UNSUCCESSFUL%20170626%Prinsesse Mononoke%%m%th%77.7|BN3843081011%UNSUCCESSFUL%20170720%The computer game design course: principles, practices and techniques for the aspiring game designer%%a%xx%79.41|BN4935636731%UNSUCCESSFUL%20170720%Mirjams flugt%Stig Christensen, Christoffer Rosenløv%a%xx%99.4 Jurkofsky Mirjam f. 1925|BN3847679564%UNSUCCESSFUL%20170720%Handbook of computer game studies%%a%xx%79.41|BN3279280422%UNSUCCESSFUL%20170720%Det hemmelige våben%Hergé%a%xx%te sk|BN3841409697%UNSUCCESSFUL%20170720%Bjørnens kløer%Derib%a%xx%te sk|BN3274626533%UNSUCCESSFUL%20170720%Helbred dit liv%Hay, Louise L.%a%xx%61.36|</response></ns2:sip>');

/**
 * Check-in (return) book with id "3274626533"
 */
nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>09N\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|APhb\|AODK-775100\|AB3274626533\|AC\|CH\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>101YUN20170619    125154AODK-775100|AB3274626533|AQHovedbiblioteket%Voksen%%|AJ06850537|AALN:C0016351730|CHHelbred dit liv%Hay, Louise L.%a%xx%61.36|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>11NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AB5135661602\|AC\|CH\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>121NUY20170619    125155AODK-775100|AA3210519784|AB5135661602|AJ53045650|AH20170703    000000|CHTørst%Nesbø, Jo%a%xx%sk|BK04856336-974e-49a1-a019-800a04f8dbcd|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>11NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AB4879770462\|AC\|CH\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>121NUY20170619    125155AODK-775100|AA3210519784|AB4879770462|AJ29017638|AH20170720    000000|CHDen store bog om LEGO Star Wars%Beecroft, Simon%a%xx%79.31|BKaed0bc1f-ed8c-454e-ba11-7f2acb5bba92|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>11NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AB3849870423\|AC\|CH\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>121NUY20170619    125155AODK-775100|AA3210519784|AB3849870423|AJ52735696|AH20170703    000000|CHKemikeren%Meyer, Stephenie%a%xx%sk|BK6e6ecdbb-b999-455a-9a0e-609299c6aba5|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>11NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AB5052159786\|AC\|CH\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>121NUY20170619    125155AODK-775100|AA3210519784|AB5052159786|AJ51320352|AH20170720    000000|CHKvinden de meldte savnet: krimi%Blædel, Sara%a%xx%sk|BK95f2aff3-3089-4a61-b2a3-f20058d36ef1|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>11NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AB5118794313\|AC\|CH\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>121NUY20170619    125155AODK-775100|AA3210519784|AB5118794313|AJ22254901|AH20170703    000000|CHFlunkerne er over os%Cera, Joaquín%a%xx%bi sk|BKcc6450c2-5299-467d-9b0e-20a11ec19c4e|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>09N\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|APhb\|AODK-775100\|AB5052159786\|AC\|CH\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>101YUN20170619    125156AODK-775100|AB5052159786|AQHovedbiblioteket%Voksen%Krimi%|AJ51320352|AALN:C0016351730|CHKvinden de meldte savnet: krimi%Blædel, Sara%a%xx%sk|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>09N\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|APhb\|AODK-775100\|AB3849870423\|AC\|CH\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>101YUN20170619    125156AODK-775100|AB3849870423|AQHovedbiblioteket%Voksen%Bestsellers%Marked|AJ52735696|AALN:C0016351730|CHKemikeren%Meyer, Stephenie%a%xx%sk|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>09N\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|APhb\|AODK-775100\|AB5135661602\|AC\|CH\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>101YUN20170619    125156AODK-775100|AB5135661602|AQHovedbiblioteket%Voksen%Bestsellers%Marked|AJ53045650|AALN:C0016351730|CHTørst%Nesbø, Jo%a%xx%sk|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>09N\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|APhb\|AODK-775100\|AB5118794313\|AC\|CH\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>101YUN20170619    125156AODK-775100|AB5118794313|AQHovedbiblioteket%Børn%Bestsellers%|AJ22254901|AALN:C0016351730|CHFlunkerne er over os%Cera, Joaquín%a%xx%bi sk|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>09N\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|APhb\|AODK-775100\|AB4879770462\|AC\|CH\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>101YUN20170619    125156AODK-775100|AB4879770462|AQHovedbiblioteket%Børn%%|AJ29017638|AALN:C0016351730|CHDen store bog om LEGO Star Wars%Beecroft, Simon%a%xx%79.31|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>11NN\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|AODK-775100\|AA3210\d{6}\|AB3274626533\|AC\|CH\|AD\d{5}\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>121NUY20170619    125152AODK-775100|AA3210519784|AB3274626533|AJ06850537|AH20170720    000000|CHHelbred dit liv%Hay, Louise L.%a%xx%61.36|BK19adc5e7-2734-4aeb-b255-d259c68928a5|</response></ns2:sip>');

nock('https://cicero-fbs.com:443', { encodedQueryParams: true })
    .post('/rest/sip2/DK-775100', /<request>09N\d{8}\s{4}\d{6}\d{8}\s{4}\d{6}\|APhb\|AODK-775100\|AB3274626533\|AC\|CH\|<\/request>/)
    .reply(200, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:sip xmlns:ns2="http://axiell.com/Schema/sip.xsd"><response>101YUN20170619    125154AODK-775100|AB3274626533|AQHovedbiblioteket%Voksen%%|AJ06850537|AALN:C0016351730|CHHelbred dit liv%Hay, Louise L.%a%xx%61.36|</response></ns2:sip>');
