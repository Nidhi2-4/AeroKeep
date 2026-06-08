/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#131314",
        "surface": "#131314",
        "surface-container-lowest": "#0e0e0f",
        "surface-container-low": "#1c1b1c",
        "surface-container": "#201f20",
        "surface-container-high": "#2a2a2b",
        "surface-container-highest": "#353435",
        "on-surface": "#e5e2e2",
        "on-surface-variant": "#c7c6cc",
        "outline": "#919096",
        "outline-variant": "#46464c",
        "primary": "#c5c5d4",
        "primary-fixed": "#e1e1f1",
        "primary-fixed-dim": "#c5c5d4",
        "primary-container": "#070913",
        "on-primary": "#2e303b",
        "on-primary-fixed": "#191b26",
        "on-primary-container": "#777886",
        "tertiary": "#4cd7f6",
        "tertiary-fixed": "#acedff",
        "tertiary-fixed-dim": "#4cd7f6",
        "tertiary-container": "#000c10",
        "on-tertiary": "#003640",
        "on-tertiary-container": "#00859c",
        "secondary": "#c1c6db",
        "secondary-container": "#44485a",
        "on-secondary": "#2b3040",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "surface-variant": "#353435",
        "surface-bright": "#3a393a",
        "inverse-surface": "#e5e2e2",
        "inverse-on-surface": "#313031",
        "surface-tint": "#c5c5d4"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      fontFamily: {
        "body-base": ["Outfit"],
        "display-lg": ["Outfit"],
        "headline-lg": ["Outfit"],
        "title-md": ["Outfit"],
        "data-mono": ["JetBrains Mono"],
        "label-sm": ["JetBrains Mono"]
      },
      fontSize: {
        "body-base": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "title-md": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "600"}],
        "data-mono": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em"}],
        "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "500"}]
      }
    }
  },
  plugins: [],
}