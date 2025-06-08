import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const ImageLibrary = {
  load_thumbnail: (url) => {
    if (!url) {
      return null;
    }

    return { uri: `${url}` };
  },
  load_picker_thumbnail: (url) => {
    if (!url) {
      return null;
    }

    return { uri: url };
  },
  load_app_logo: () => {
    return require("../assets/images/splash-icon.png");
  },
  load_onboard_photos: (index) => {
    const section = Number(index + 1);

    if (Number(section) === 1) {
      return require("../assets/images/onboard1.png");
    }

    if (Number(section) === 2) {
      return require("../assets/images/onboard2.png");
    }

    if (Number(section) === 3) {
      return require("../assets/images/onboard3.png");
    }
  },
  compress_image: async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // resize width to 800px, keep aspect ratio
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult; // contains uri, width, height
  },
  generate_logo_base64: async () => {
    const asset = Asset.fromModule(require("../assets/images/icon.png"));
    await asset.downloadAsync(); // Ensure it's available locally

    const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return `${base64}`;
  },
};

export default ImageLibrary;
