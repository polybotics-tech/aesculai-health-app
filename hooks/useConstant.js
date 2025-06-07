import { Dimensions, Platform } from "react-native";

const ScrW = Dimensions.get("window").width;
const ScrH = Dimensions.get("window").height;

const useConstant = () => ({
  dimension: {
    width: {
      full: ScrW,
      ratio: (ratio, width = ScrW) => Number(ratio * width),
      divide: (gap = 0, padding = 0, number = 1, width = ScrW) =>
        Number(width - (gap + padding)) / number,
      subtract: (gap = 0, padding = 0, target = 0, width = ScrW) =>
        Number(width - (gap + padding + target)),
    },
    height: {
      full: ScrH,
      nav: Platform.OS === "ios" ? 64 : 72,
      ratio: (ratio, height = ScrH) => Number(ratio * height),
      subtract: (gap = 0, padding = 0, target = 0, height = ScrH) =>
        Number(height - (gap + padding + target)),
    },
  },
  size: {
    xxs: 2,
    xs: 4,
    s: 8,
    xm: 12,
    m: 16,
    b: 18,
    xb: 24,
    xxb: 32,
    set: (value) => value,
    r: 1000,
    btn: 48,
  },
  font: {
    weight: {
      regular: 400,
      semibold: 500,
      bold: 700,
    },
    size: {
      xs: 11.5,
      s: 14,
      m: 16,
      b: 18,
      xb: 22,
      xxb: 28,
      xxxb: 32,
    },
  },
});

export default useConstant;
