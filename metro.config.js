// metro.config.js
module.exports = {
    resolver: {
      sourceExts: ['jsx', 'js', 'ts', 'tsx'], // Ensure Metro recognizes your file extensions
    },
    transformer: {
      babelTransformerPath: require.resolve('react-native-babel-transformer'),
    },
  };
  