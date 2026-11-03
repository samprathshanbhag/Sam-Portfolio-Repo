import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#141313',
        surface: {
          DEFAULT: '#1B1A1A',
          subtle: '#222120',
          elevated: '#2A2827',
          border: '#33302E',
        },
        accent: {
          DEFAULT: '#E8B04A',
          hover: '#F5C163',
          muted: 'rgba(232, 176, 74, 0.15)',
          glow: 'rgba(232, 176, 74, 0.35)',
        },
        content: {
          primary: '#F4F1EA',
          secondary: '#B8B3AA',
          muted: '#7A756F',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

