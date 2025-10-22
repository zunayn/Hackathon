// File: babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This plugin is required for Expo Router and helps resolve module paths.
      'expo-router/babel',
    ],
  };
};
