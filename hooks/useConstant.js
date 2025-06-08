import { Dimensions, PixelRatio, Platform } from "react-native";

const ScrW = Dimensions.get("window").width;
const ScrH = Dimensions.get("window").height;

const scaleSizeToDevicePixel = (size) => {
  const baseFontScale = 1; //--base design scale (default system scale)
  const leastFontScale = 0.8; //--least design scale (smallest recommended system scale)

  const currentScale = PixelRatio.getFontScale();
  const ratio = Number(baseFontScale / currentScale);

  const adjustedSize = Boolean(ratio > 1.1)
    ? size * baseFontScale
    : Boolean(ratio < 0.7)
    ? size * leastFontScale
    : size * ratio;

  return adjustedSize;
};

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
    xxs: scaleSizeToDevicePixel(2),
    xs: scaleSizeToDevicePixel(4),
    s: scaleSizeToDevicePixel(8),
    xm: scaleSizeToDevicePixel(12),
    m: scaleSizeToDevicePixel(16),
    b: scaleSizeToDevicePixel(18),
    xb: scaleSizeToDevicePixel(24),
    xxb: scaleSizeToDevicePixel(32),
    set: (value) => value,
    r: 1000,
    btn: scaleSizeToDevicePixel(48),
  },
  font: {
    weight: {
      regular: 400,
      semibold: 500,
      bold: 700,
    },
    size: {
      xs: scaleSizeToDevicePixel(10),
      s: scaleSizeToDevicePixel(12),
      m: scaleSizeToDevicePixel(14),
      b: scaleSizeToDevicePixel(16),
      xb: scaleSizeToDevicePixel(20),
      xxb: scaleSizeToDevicePixel(24),
      xxxb: scaleSizeToDevicePixel(32),
    },
  },
});

export default useConstant;
