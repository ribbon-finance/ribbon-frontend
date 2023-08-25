const CracoLessPlugin = require("craco-less");
const webpack = require('webpack');
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      });
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false, // Mock 'fs' with an empty module.
        "path": require.resolve("path-browserify"),
        "buffer": false
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
