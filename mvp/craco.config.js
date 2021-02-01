const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#000000",
              "@error-color": "#FF7676",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
