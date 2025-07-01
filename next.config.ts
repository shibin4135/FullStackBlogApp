import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'img.clerk.com', 
        port: '', 
        pathname: '**',
      },
      
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev', 
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
        port: '',
        pathname: '**',
      }
    ],
  },
};

export default nextConfig;
