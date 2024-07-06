import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  plugins: [
    plugin(function ({ addUtilities }) {
      const top = "top";
      const paddingTop = "paddingTop";
      const marginTop = "marginTop";
      const paddingLeft = "paddingLeft";
      const paddingRight = "paddingRight";
      const paddingBottom = "paddingBottom";
      const newUtilities = {
        ".safe-top-top": {
          [top]: "constant(safe-area-inset-top)",
          // @ts-expect-error
          [top]: "env(safe-area-inset-top)",
        },
        ".safe-top": {
          [paddingTop]: "constant(safe-area-inset-top)",
          // @ts-expect-error
          [paddingTop]: "env(safe-area-inset-top)",
        },
        ".safe-top-margin": {
          [marginTop]: "constant(safe-area-inset-top)",
          // @ts-expect-error
          [marginTop]: "env(safe-area-inset-top)",
        },
        ".safe-left": {
          [paddingLeft]: "constant(safe-area-inset-left)",
          // @ts-expect-error
          [paddingLeft]: "env(safe-area-inset-left)",
        },
        ".safe-right": {
          [paddingRight]: "constant(safe-area-inset-right)",
          // @ts-expect-error
          [paddingRight]: "env(safe-area-inset-right)",
        },
        ".safe-bottom": {
          [paddingBottom]: "constant(safe-area-inset-bottom)",
          // @ts-expect-error
          [paddingBottom]: "env(safe-area-inset-bottom)",
        },
        ".disable-scrollbars": {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
            display: "none",
          },
          "& *::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
            display: "none",
          },
          "& *": {
            scrollbarWidth: "none",
            "-ms-overflow-style": "none",
          },
        },
        ".no-tap-highlighting": {
          "webkit-tap-highlight-color": "transparent",
          "-webkit-tap-highlight-color": "transparent",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
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
      height: {
        "100vh": "calc(var(--vh, 1vh) * 100)",
      },
      minHeight: {
        "100vh": "calc(var(--vh, 1vh) * 100)",
      },
      maxHeight: {
        xl: "9999px",
        "100vh": "calc(var(--vh, 1vh) * 100)",
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        secondary: "#71717A",
      },
      fontSize: {
        "h00-medium": [
          "2rem",
          {
            lineHeight: "1.25",
            fontWeight: "300",
          },
        ],
        "h0-medium": [
          "1.5rem",
          {
            lineHeight: "1.25",
            fontWeight: "500",
          },
        ],
        "h1-bold": [
          "1.25rem",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        "h1-medium": [
          "1.25rem",
          {
            lineHeight: "1.25",
            fontWeight: "500",
          },
        ],
        "h1-regular": [
          "1.25rem",
          {
            lineHeight: "1.25",
            fontWeight: "400",
          },
        ],
        "h2-regular": [
          "1.125rem",
          {
            lineHeight: "1.25",
            fontWeight: "400",
          },
        ],
        "h2-medium": [
          "1.125rem",
          {
            lineHeight: "1.25",
            fontWeight: "500",
          },
        ],
        "h2-bold": [
          "1.125rem",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        "h3-medium": [
          "1rem",
          {
            lineHeight: "1.25",
            fontWeight: "500",
          },
        ],
        "h3-bold": [
          "1rem",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        "t1-medium": [
          "1rem",
          {
            lineHeight: "1.25",
            fontWeight: "500",
          },
        ],
        "t1-regular": [
          "1rem",
          {
            lineHeight: "1.25",
            fontWeight: "400",
          },
        ],
        "t2-medium": [
          "0.875rem",
          {
            lineHeight: "1.25",
            fontWeight: "500",
          },
        ],
        "t2-regular": [
          "0.875rem",
          {
            lineHeight: "1.25",
            fontWeight: "400",
          },
        ],
        "t3-bold": [
          "0.75rem",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        "t3-light": [
          "0.75rem",
          {
            lineHeight: "1.25",
            fontWeight: "300",
          },
        ],
        "t3-regular": [
          "0.75rem",
          {
            lineHeight: "1.25",
            fontWeight: "400",
          },
        ],
        "t3-medium": [
          "0.75rem",
          {
            lineHeight: "1.25",
            fontWeight: "500",
          },
        ],
        "t4-medium": [
          "0.625rem",
          {
            lineHeight: "1.25",
            fontWeight: "500",
          },
        ],
        "t4-regular": [
          "0.625rem",
          {
            lineHeight: "1.25",
            fontWeight: "400",
          },
        ],
        "t5-regular": [
          "0.5rem",
          {
            lineHeight: "1.25",
            fontWeight: "400",
          },
        ],
      },
      boxShadow: {
        main: "0px -2px 4px rgba(0, 0, 0, 0.12)",
        web: "0px 0px 12px 0px rgba(30 ,41 ,59 , 0.16)",
      },
    },
    container: {
      center: true,
    },
  },
};
