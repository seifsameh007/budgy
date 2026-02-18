/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.{html,js}", "./src/**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                alexandria: ['Alexandria', 'sans-serif'],
            },
            colors: {
                glass: "rgba(255, 255, 255, 0.25)",
                glassBorder: "rgba(255, 255, 255, 0.5)",
            }
        },
    },
    plugins: [],
}
