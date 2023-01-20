/** @type {import('next').NextConfig} */
const env = require("./env.json");

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env,
};

module.exports = nextConfig;
