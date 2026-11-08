/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  async rewrites() {
    return [
      {
        source: "/pixel",
        destination: "/?mode=os&app=pixel",
      },
      {
        source: "/studio",
        destination: "/?mode=os&app=pixel",
      },
      {
        source: "/pixelengine",
        destination: "/?mode=os&app=pixel",
      },
    ];
  },
};

export default nextConfig;
