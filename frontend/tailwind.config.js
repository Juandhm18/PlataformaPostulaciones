/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'jp-serif': ['"Noto Serif JP"', 'serif'],
                'jp-sans': ['"Zen Kaku Gothic New"', 'sans-serif'],
            },
            colors: {
                'washi': '#F9F8F6', // Rice paper white
                'sumi': '#2B2B2B',   // Ink black
                'indigo-dye': '#3D4C53', // Muted indigo/slate
                'hanko-red': '#B23A48', // Stamp red (accent)
                'bamboo': '#E8E6E1', // Subtle divider color
            }
        },
    },
    plugins: [],
}
