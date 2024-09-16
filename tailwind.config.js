// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['"Press Start 2P"', 'cursive'], // Use a Minecraft-like font
      },
      colors: {
        minecraftGreen: '#4CAF50', // Minecraft-themed colors
        minecraftBrown: '#6B4226',
      },
    },
  },
  plugins: [],
}
