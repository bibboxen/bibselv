const nock = require('nock');
const path = require('path');
const fs = require('fs');

module.exports = function(name, options) {
    // options tell us where to store our fixtures
    options = options || {};

    const fixturesFolder = options.fixturesFolder || 'fixtures';
    const fp = path.join(fixturesFolder, name + '.js');

    let hasFixtures = false;

    return {
        // starts recording, or ensure the fixtures exist
        before: function() {
            // Live tests request, so just return.
            if (Object.prototype.hasOwnProperty.call(process.env, 'LIVE') && process.env.LIVE) {
                return;
            }

            // Try to load fixtures, if they don't exists record new ones.
            try {
                require('./' + fp);
                hasFixtures = true;
            } catch (e) {
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
