module.exports = {
    root: true,
    plugins: ['jasmine'],
    extends: ['standard', 'plugin:jasmine/recommended'],
    rules: {
        indent: ['error', 4],
        semi: ['error', 'always'],
        'space-before-function-paren': ['error', 'never']
    },
    globals: {
        setupArchitect: false,
        assert: false
    },
    env: {
        jasmine: true
    }
};
