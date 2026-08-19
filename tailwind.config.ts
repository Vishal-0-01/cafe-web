import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14181B",
        paper: "#FBF9F6",
        line: "#E7E2D9",
        brand: {
          50: "#F1F6F3",
          100: "#DCEAE1",
          200: "#B9D5C4",
          300: "#8FBCA3",
          400: "#5F9C7C",
          500: "#3D7D5E",
          600: "#2E6249",
          700: "#264F3C",
          800: "#203F31",
          900: "#1A3329",
        },
        clay: "#C1613F",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,24,27,0.04), 0 4px 16px rgba(20,24,27,0.06)",
        cardHover: "0 2px 4px rgba(20,24,27,0.06), 0 12px 28px rgba(20,24,27,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
