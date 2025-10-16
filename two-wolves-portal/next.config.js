/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./public/**/*'],
    },
  },
}

module.exports = nextConfig
