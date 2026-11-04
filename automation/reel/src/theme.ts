// ZeeBuild collage theme: graphite desk, cream paper, one neon-orange hero.
import { Easing } from "remotion";
import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as mono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as news } from "@remotion/google-fonts/OldStandardTT";
import { loadFont as hand } from "@remotion/google-fonts/PermanentMarker";

export const theme = {
  colors: {
    bg: "#141414", paper: "#EDE6D6", paper2: "#E3D9C3", receipt: "#F6F2EA", ink: "#1A1714",
    primary: "#FF8A33", red: "#D7332B", cyan: "#00F3FF", text: "#F2F0EC", textDim: "#8E8A84",
  },
  fonts: {
    sans: inter("normal", { weights: ["800", "900"], subsets: ["latin"] }).fontFamily,
    mono: mono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
    news: news("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
    newsItalic: news("italic", { weights: ["400"], subsets: ["latin"] }).fontFamily,
    hand: hand("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    slam: { damping: 12, stiffness: 260, mass: 0.7 },
  },
} as const;

// Every beat is keyed to a narration word, so timing lives here, not in components
export const beats = {
  dark: 49, sixty: 67, printIn: 20,
  second1: 108, receiptIn: 112, declined: 157,
  second10: 193, printOut: 188, payrollIn: 198, freezes: 269,
  follow: 298, part2: 328, end: 400,
};
