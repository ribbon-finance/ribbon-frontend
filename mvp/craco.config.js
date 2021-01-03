const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#0C345A",
              "@error-color": "#FF7676",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
