import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keeps Next.js from guessing the wrong project folder if another package-lock.json exists higher up.
  outputFileTracingRoot: here,
};

export default nextConfig;
