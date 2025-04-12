import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // future: {
  //   webpack5: true,
  // },
  webpack(config) {
    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ['ujprsivpzetlejitztzk.supabase.co'], // ✅ Add your Supabase project domain here
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  
};

export default nextConfig;
