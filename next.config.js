// /** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public'
})


const nextConfig = {
    reactStrictMode: false,
  swcMinify: false,
};

// export default nextConfig;
module.exports = withPWA(nextConfig)