module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        [
            "react-intl",
            {
                "extractFromFormatMessageCall": true,
                "idInterpolationPattern": "[sha512:contenthash:base64:6]",
                "ast": true
            }
        ]
    ]
};
