import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'display-2xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-xl':  ['6rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg':  ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md':  ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm':  ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        'ag-bg':       'var(--bg-primary)',
        'ag-bg-2':     'var(--bg-secondary)',
        'ag-bg-3':     'var(--bg-tertiary)',
        'ag-text':     'var(--text-primary)',
        'ag-text-2':   'var(--text-secondary)',
        'ag-muted':    'var(--text-muted)',
        'ag-accent':   'var(--accent)',
        'ag-border':   'var(--border-medium)',
        'ag-success':  'var(--success)',
        'ag-error':    'var(--error)',
      }
    },
  },
  plugins: [],
};
export default config;
