// tailwind.config.js
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'my-color': '#3b82f6',
                'primary': {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    900: '#1e3a8a',
                },
                'custom': {
                    light: '#f0f9ff',
                    DEFAULT: '#0ea5e9',
                    dark: '#0369a1',
                }
            },
        },
    },
    plugins: [],
}