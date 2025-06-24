// tailwind.config.js
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        kosmos: ['"Planet Kosmos"', 'sans-serif'],
      },
      colors: {
        background: '#0f172a',
        card: '#1e293b',
        textMain: '#f1f5f9',
        textMuted: '#cbd5e1',
        accentBlue: '#38bdf8',
        danger: '#ef4444',
        darkBg: '#000000',
        darkText: '#cccccc',
      },
    },
  },
  plugins: [],
};
