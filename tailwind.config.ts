import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0A2463",
          secondary: "#D4AF37",
          accent: "#00B4D8",
          sand: "#F5EFE0",
          ink: "#0F172A",
        },
        "brand-primary": "#0A2463",
        "brand-secondary": "#D4AF37",
        "brand-accent": "#00B4D8",
        "brand-sand": "#F5EFE0",
        "brand-ink": "#0F172A",
      },
      fontFamily: {
        sans: ["Tajawal", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 20px 60px rgba(10, 36, 99, 0.18)",
      },
      backgroundImage: {
        "sea-glow":
          "radial-gradient(circle at top, rgba(0,180,216,0.20), transparent 40%), linear-gradient(135deg, rgba(10,36,99,1) 0%, rgba(9,18,44,1) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
