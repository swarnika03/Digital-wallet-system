/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6ECFF',
          100: '#CCD9FF',
          200: '#99B3FF',
          300: '#668CFF',
          400: '#3366FF', // Main primary
          500: '#0040FF',
          600: '#0033CC',
          700: '#002699',
          800: '#001A66',
          900: '#000D33',
        },
        secondary: {
          50: '#E0FFF9',
          100: '#B3FFF0',
          200: '#80FFEA',
          300: '#4DFFE3',
          400: '#1AFFDC',
          500: '#00BFA5', // Main secondary
          600: '#00A696',
          700: '#008C82',
          800: '#00736E',
          900: '#005955',
        },
        accent: {
          50: '#FFF9E0',
          100: '#FFF4C2',
          200: '#FFEDA5',
          300: '#FFE587',
          400: '#FFDD6A',
          500: '#FFD700', // Main accent (Gold)
          600: '#CCAC00',
          700: '#998100',
          800: '#665700',
          900: '#332C00',
        },
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50', // Main success
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        warning: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107', // Main warning
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336', // Main error
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};