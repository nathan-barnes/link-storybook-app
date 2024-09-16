module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/pdfjs-dist/web/pdf_viewer.css', // Ensure Tailwind includes this file
  ],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        minecraftGreen: '#4CAF50',
        minecraftBrown: '#6B4226',
      },
    },
  },
  plugins: [],
}
