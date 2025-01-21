// next.config.mjs
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.(ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
          },
        },
      });
      return config;
    },
  };
  
  export default nextConfig;