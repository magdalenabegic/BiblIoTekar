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
      },
    },
  },
  plugins: [],
} satisfies Config;
