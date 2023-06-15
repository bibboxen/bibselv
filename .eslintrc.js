module.exports = {
    root: true,
    extends: [
        'standard',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:cypress/recommended',
        'airbnb',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:cypress/recommended'
    ],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        semi: ['error', 'always'],
        'space-before-function-paren': ['error', 'never'],
        'require-jsdoc': ['error']
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    globals: {
        localStorage: true,
        alert: true,
        Worker: true
    }
};
