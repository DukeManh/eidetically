const CracoLessPlugin = require('craco-less');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer'), require('postcss-nested')],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#414141' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
