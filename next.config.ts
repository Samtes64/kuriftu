import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  future: {
    webpack5: true,
  },

  images: {
    domains: ['ujprsivpzetlejitztzk.supabase.co'], // ✅ Add your Supabase project domain here
  },
  
};

export default nextConfig;
