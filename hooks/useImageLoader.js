const useImageLoader = () => ({
  thumbnail: (url) => {
    if (!url) {
      return null;
    }

    return { uri: `${url}` };
  },
  picker_thumbnail: (url) => {
    if (!url) {
      return null;
    }

    return { uri: url };
  },
  logo: () => {
    return require("../assets/images/icon.png");
  },
});

export default useImageLoader;
// This custom hook provides methods to load images from URLs or local assets.
