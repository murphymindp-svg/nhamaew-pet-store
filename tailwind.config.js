/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'dm-sans': ['var(--font-dm-sans)', 'Arial', 'Helvetica', 'sans-serif'],
                'noto-thai': ['var(--font-noto-sans-thai)', 'Arial', 'Helvetica', 'sans-serif'],
            },
            colors: {
                'primary': 'var(--color-primary)',
                'primary-light': 'var(--color-primary-light)',
                'primary-hover': 'var(--color-primary-hover)',
                'primary-dark': 'var(--color-secondary)',
                'secondary': 'var(--color-secondary)',
                'critical': 'var(--color-critical)',
                'warning': 'var(--color-warning)',
                'success': 'var(--color-success)',
                'subdube': 'var(--color-subdube)',
                'disabled': 'var(--color-disabled)',
                'gray-light': 'var(--color-gray-light)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
};