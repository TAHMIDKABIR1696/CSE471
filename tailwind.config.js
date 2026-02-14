/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef7ff',
                    100: '#d9edff',
                    200: '#bce0ff',
                    300: '#8eccff',
                    400: '#59b0ff',
                    500: '#338dff',
                    600: '#1b6ff5',
                    700: '#1459e1',
                    800: '#1748b6',
                    900: '#193f8f',
                    950: '#142857',
                },
                accent: {
                    50: '#f0fdf5',
                    100: '#dcfce8',
                    200: '#bbf7d1',
                    300: '#86efad',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803c',
                    800: '#166533',
                    900: '#14532b',
                },
                dark: {
                    50: '#f6f6f9',
                    100: '#ececf1',
                    200: '#d5d6e0',
                    300: '#b1b3c5',
                    400: '#878aa5',
                    500: '#686b8a',
                    600: '#535572',
                    700: '#44465d',
                    800: '#3b3c4f',
                    900: '#343544',
                    950: '#0f1021',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'fade-in': 'fadeIn 0.6s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(51, 141, 255, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(51, 141, 255, 0.6)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
