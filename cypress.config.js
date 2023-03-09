const { defineConfig } = require('cypress');

module.exports = defineConfig({
    component: {
        devServer: {
            framework: 'react',
            bundler: 'webpack'
        },
        viewportWidth: 1000,
        viewportHeight: 600
    },

    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        }
    }
});
