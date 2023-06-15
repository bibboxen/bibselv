module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    [
      "react-intl",
      {
        extractFromFormatMessageCall: true,
        idInterpolationPattern: "[sha512:contenthash:base64:6]",
        ast: true,
      },
    ],
  ],
};
