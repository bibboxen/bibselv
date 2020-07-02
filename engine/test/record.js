const nock = require('nock');
const path = require('path');
const fs = require('fs');

module.exports = function(name, options) {
    // options tell us where to store our fixtures
    options = options || {};

    const fixturesFolder = options.fixturesFolder || 'fixtures';
    const fp = path.join(fixturesFolder, name + '.js');

    // `hasFixtures` indicates whether the test has fixtures we should read,
    // or doesn't, so we should record and save them.
    let hasFixtures = !!process.env.NOCK_RECORD;

    return {
        // starts recording, or ensure the fixtures exist
        before: function() {
            // Live tests request, so just return.
            if (Object.prototype.hasOwnProperty.call(process.env, 'LIVE') && process.env.LIVE) {
                return;
            }

            if (!hasFixtures) {
                try {
                    require('./' + fp);
                    hasFixtures = true;
                } catch (e) {
                    nock.recorder.rec({
                        dont_print: true
                    });
                }
            } else {
                hasFixtures = false;
                nock.recorder.rec({
                    dont_print: true
                });
            }
        },
        // saves our recording if fixtures didn't already exist
        after: function(done) {
            // Live tests request, so just return.
            if (Object.prototype.hasOwnProperty.call(process.env, 'LIVE') && process.env.LIVE) {
                done();
                return;
            }

            if (!hasFixtures) {
                const fixtures = nock.recorder.play();
                const text = 'var nock = require(\'nock\');\n' + fixtures.join('\n');
                fs.writeFile(fp, text, done);
            } else {
                done();
            }
        }
    };
};
