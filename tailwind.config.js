/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#11161D",
        navy: "#1b2a3d",
      },
      spacing: {
        'card-w': '150px',
        'card-h': '225px',
      },
      aspectRatio: {
        '2/3': '2 / 3', // ✅ penulisan yang benar (sebagai string)
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // 👍 pastikan ini sudah ter-install
  ],
}
