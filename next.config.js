// @ts-check

const withPWA = require("next-pwa");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withPWA({
  images: {
    domains: [
      "artworks.thetvdb.com",
      "www.themoviedb.org",
      "i.kym-cdn.com",
      "img.youtube.com",
      "image.tmdb.org",
    ],
  },
  pwa: {
    buildExcludes: [/middleware-manifest.json$/], // See: https://github.com/shadowwalker/next-pwa/issues/288
    dest: "public",
  },
});

module.exports = nextConfig;
