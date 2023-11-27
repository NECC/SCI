// tailwind.config.js

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
  plugins: [],
};
