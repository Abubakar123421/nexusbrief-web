import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background:    '#FFFFFF',
        surface:       '#F8F7F4',
        'surface-2':   '#EFEFED',
        ink:           '#0A0A0A',
        'ink-secondary':'#3D3D3D',
        'ink-muted':   '#8A8A8A',
        border:        '#E0DDD8',
        'border-strong':'#1A1A1A',
        accent:        '#0A0A0A',
        success:       '#1A5C2A',
        danger:        '#8C1F1F',
        highlight:     '#F5F0E0',
      },
      fontFamily: {
        playfair:   ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
        montserrat: ['var(--font-montserrat)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        garamond:   ['var(--font-garamond)', 'Georgia', 'serif'],
        poppins:    ['var(--font-poppins)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display-hero': ['clamp(52px, 8vw, 96px)', { lineHeight: '1.03', fontWeight: '900' }],
        'display-xl':   ['clamp(36px, 5vw, 64px)',  { lineHeight: '1.1',  fontWeight: '700' }],
        'display-lg':   ['40px',  { lineHeight: '1.15', fontWeight: '700' }],
        'display-md':   ['28px',  { lineHeight: '1.25', fontWeight: '500' }],
        'display-sm':   ['20px',  { lineHeight: '1.3',  fontWeight: '400' }],
        'ui-lg':        ['16px',  { lineHeight: '1.5',  fontWeight: '600' }],
        'ui-md':        ['13px',  { lineHeight: '1.4',  fontWeight: '500' }],
        'ui-sm':        ['11px',  { lineHeight: '1.4',  fontWeight: '400' }],
        'body-lg':      ['18px',  { lineHeight: '1.7',  fontWeight: '400' }],
        'body-md':      ['16px',  { lineHeight: '1.65', fontWeight: '400' }],
        'caption':      ['11px',  { lineHeight: '1.4',  fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'scrollLine': 'scrollLine 2s ease-in-out infinite',
        'fadeInUp':   'fadeInUp 0.7s ease forwards',
        'fadeIn':     'fadeIn 0.5s ease forwards',
        'shimmer':    'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        scrollLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      maxWidth: {
        'content': '1400px',
      },
    },
  },
  plugins: [],
};

export default config;
