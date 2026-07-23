/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato_400Regular'],
        'lato-light': ['Lato_300Light'],
        'lato-bold': ['Lato_700Bold'],
        'lato-black': ['Lato_900Black']
      },
      colors: {
        primary: "#004AAD",
        text: "#000000",
        textSecondary: "#616161",
        background: "#FFFFFF",
        borderSecondary: "#A5A5A5",
        border: "#000000",
        secondary: "#EFF2F6",
        secondary2: "#E6EDF7",
        placeholder: "#BEBEBE",
        error: "#DC2626",
        screenTitle: "#616161",
        yellowPrimary: "#EDB310",
        backgroundTertiary: "#F5F8FC",
        cancel: "#E81212",
      },
    },
  },
  plugins: [],
};
