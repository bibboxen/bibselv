module.exports = {
    root: true,
    plugins: ['jasmine'],
    extends: ['standard', 'plugin:jasmine/recommended'],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        semi: ['error', 'always'],
        'space-before-function-paren': ['error', 'never'],
        'require-jsdoc': ['error']
    },
    globals: {
        setupArchitect: false,
        assert: false
    },
    env: {
        jasmine: true
    }
};
