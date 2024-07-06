import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "../common/runtime/components/**/*.{vue,ts}",
    "./components/**/*.{vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.ts",
  ],
  theme: {
    screens: {
      xxs: "375px",
      xs: "484px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["Nata Sans", ...defaultTheme.fontFamily.sans],
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
};
