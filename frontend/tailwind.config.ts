import type { Config } from "tailwindcss"
 
const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx,js,jsx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        '1000-blue': {
          DEFAULT: 'hsl(var(--1000-blue))',
          light: 'hsl(var(--1000-blue-light))',
        },
        '1000-charcoal': 'hsl(var(--1000-charcoal))',
        '1000-green': 'hsl(var(--1000-green))',
        '1000-gold': 'hsl(var(--1000-gold))',
        '1000-cream': 'hsl(var(--1000-cream))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #1E40AF 0%, #2563eb 100%)',
        'gradient-green': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #d97706 100%)',
        'gradient-page': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        'gradient-card': 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
      },
      boxShadow: {
        'blue': '0 4px 15px rgba(30, 64, 175, 0.3)',
        'green': '0 4px 15px rgba(16, 185, 129, 0.3)',
        'gold': '0 4px 15px rgba(245, 158, 11, 0.3)',
        'card': '0 4px 15px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 20px rgba(0, 0, 0, 0.15)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
 
export default config
