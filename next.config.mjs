/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cimage-web.s3.ap-south-1.amazonaws.com",
        pathname: "/public/reels/**",
      },
    ],
  },
};

export default nextConfig;
