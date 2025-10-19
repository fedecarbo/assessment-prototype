import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        'task-panel': '338px',
        'content-max': '1100px',
        'readable': '723px',
      },
      maxWidth: {
        'content': '1100px',
        'readable': '723px',
      },
    },
  },
}

export default config
