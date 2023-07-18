const CracoLessPlugin = require("craco-less");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      });
      return webpackConfig;
    },
  },
  rules: [
    // Add this rule for @wagmi/connectors
    {
      test: /\.js$/,
      include: /@wagmi\/connectors/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'], // Add the plugin here
          // Add any other necessary Babel plugins here
        },
      },
    },
    // ... other rules ...
  ],
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
