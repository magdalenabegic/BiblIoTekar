import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", ...fontFamily.sans],
      },
      colors: {
        'pretty-green': 'var(--pretty-green)',
        'white': 'var(--white)',
        'greywhite': 'var(--greywhite)',
        'color-black': 'var(--color-black)',
        'black': 'var(--black)',
      },
    },
  },
  plugins: [],
} satisfies Config;