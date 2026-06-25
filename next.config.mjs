/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Assets are pre-sized webp/jpg served from S3. Skip Next/Amplify's
    // on-demand image optimizer entirely — it was a per-request Lambda cost and
    // is redundant now that files come straight from the bucket.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cimage-web.s3.ap-south-1.amazonaws.com",
        pathname: "/public/reels/**",
      },
      {
        protocol: "https",
        hostname: "cimage.in",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cimagedigital.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
