/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black:   '#1c1c1c',
        mercury: '#99afbf',
        surface: '#242424',
        blue: {
          DEFAULT: '#2e5bff',
          dark:    '#1a3acc',
        },
      },
      fontFamily: {
        sans:  ['var(--font-space)', 'Space Grotesk', 'sans-serif'],
        mono:  ['var(--font-mono-display)', 'Share Tech Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
