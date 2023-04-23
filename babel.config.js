module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          assets: './src/assets',
          components: './src/components',
          config: './src/config',
          store: './src/store',
          context: './src/context',
          router: './src/router',
          screens: './src/screens',
          services: './src/services',
          theme: './src/theme',
          types: './src/types',
          utils: './src/utils',
          font: './src/font',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        whitelist: ['API_PATH', 'ENV'],
        moduleName: 'env',
        path: '.env',
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
