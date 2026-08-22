/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "#F8FAFC",
        chrome: "#FFFFFF",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        hub: {
          primary: "#5B4BDB",
          "primary-content": "#FFFFFF",
          secondary: "#334155",
          accent: "#5B4BDB",
          "accent-content": "#FFFFFF",
          neutral: "#1E293B",
          "neutral-content": "#F8FAFC",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          "base-300": "#E2E8F0",
          info: "#5B4BDB",
          success: "#047857",
          warning: "#B45309",
          error: "#B91C1C",
        },
      },
    ],
  },
};
