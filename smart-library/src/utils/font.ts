import { Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  adjustFontFallback: true,
  preload: true,
  display: "swap",
  variable: "--font-poppins",
});
