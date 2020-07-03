module.exports = {
    root: true,
    extends: [
        'standard',
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    rules: {
        indent: ['error', 4],
        semi: ['error', 'always'],
        'space-before-function-paren': ['error', 'never']
    },
    env: {
        jest: true
    }
};
