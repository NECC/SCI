// tailwind.config.js
const {nextui} = require("@nextui-org/react");

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': {
          1: '#0583D2',
          2: '#B8E3FF',
        }, // cor do logo das jornadas poderá ser utilizado
      },
      fontFamily: {
        'comfortaa': ['Comfortaa', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },  
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
