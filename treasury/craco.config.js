const CracoLessPlugin = require("craco-less");
const webpack = require('webpack');
module.exports = {
  reactStrictMode: true,
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",

      });
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false, // Mock 'fs' with an empty module.
        "path": require.resolve("path-browserify"),
        "buffer": require.resolve("buffer")
      };
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );
      return webpackConfig;
    },
  },
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
