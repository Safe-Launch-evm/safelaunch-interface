import type { Config } from 'tailwindcss';

const config = {
  // darkMode: ["class"],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        background: '#0A090E',
        foreground: '#FCFCFC',
        primary: {
          DEFAULT: '#80A8BA',
          foreground: '#3E3E3E'
        },
        secondary: {
          DEFAULT: '#FFF083',
          foreground: '#3E3E3E'
        },
        destructive: {
          DEFAULT: '#C96262',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: '#767676',
          foreground: 'hsl(var(--muted-foreground))'
        },
        card: {
          DEFAULT: '#151419',
          foreground: '#FCFCFC'
        },
        accent: {
          DEFAULT: '#D2DCF1',
          foreground: '#6100FF',
          200: '#F5841F'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        border: '#79787B',
        input: '#151419',
        ring: '#79787B',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      fontFamily: {
        bricolage: ['var(--font-bricolage)'],
        inter: ['var(--font-inter)']
      },
      boxShadow: {
        dip: '0px 4px 0px 0px #3E3E3E',
        btn: '0px 0px 8px 0px rgba(252, 252, 252, 0.45)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      // borderRadius: {
      //   lg: 'var(--radius)',
      //   md: 'calc(var(--radius) - 2px)',
      //   sm: 'calc(var(--radius) - 4px)'
      // }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;

export default config;
