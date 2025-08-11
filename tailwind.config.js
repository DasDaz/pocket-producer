
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#111111',
        muted: '#f5f5f5',
        'muted-foreground': '#666666',
      },
    },
  },
  plugins: [],
};
