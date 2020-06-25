const nock = require('nock');
const path = require('path');
const fs = require('fs');

module.exports = function (name, options) {
    // options tell us where to store our fixtures
    options = options || {};

    const fixtures_folder = options.fixtures_folder || 'fixtures';
    const fp = path.join(fixtures_folder, name + '.js');

    // `has_fixtures` indicates whether the test has fixtures we should read,
    // or doesn't, so we should record and save them.
    let has_fixtures = !!process.env.NOCK_RECORD;

    return {
        // starts recording, or ensure the fixtures exist
        before: function () {
            // Live tests request, so just return.
            if (process.env.hasOwnProperty('LIVE') && process.env.LIVE) {
                return;
            }

            if (!has_fixtures) {
                try {
                    require('./' + fp);
                    has_fixtures = true;
                } catch (e) {
                    nock.recorder.rec({
                        dont_print: true
                    });
                }
            }
            else {
                has_fixtures = false;
                nock.recorder.rec({
                    dont_print: true
                });
            }
        },
        // saves our recording if fixtures didn't already exist
        after: function (done) {
            // Live tests request, so just return.
            if (process.env.hasOwnProperty('LIVE') && process.env.LIVE) {
                done();
                return;
            }

            if (!has_fixtures) {
                const fixtures = nock.recorder.play();
                const text = 'var nock = require(\'nock\');\n' + fixtures.join('\n');
                fs.writeFile(fp, text, done);
            }
            else {
                done();
            }
        }
    };
};
