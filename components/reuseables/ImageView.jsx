import { Octicons } from "@expo/vector-icons";
//import { Image } from "expo-image";
import { memo } from "react";
import { Image as RNImage } from "react-native";
import { StyleSheet, View } from "react-native";
import { useColor } from "../../hooks";

let ExpoImage = null;
try {
  // Dynamically require expo-image
  ExpoImage = require("expo-image").Image;
} catch (error) {
  console.log(
    "expo-image not available. Falling back to react-native Image. This usually happens when using Expo Go."
  );
}

const ImageView = ({ uri, blur = "", scale, iconName = "image" }) => {
  const color = useColor();
  const blurhash = blur;

  const styles = StyleSheet.create({
    image: {
      width: "100%",
      height: "100%",
      objectFit: Boolean(scale) ? "scale-down" : "cover",
    },
    empty: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <>
      {uri ? (
        <>
          {Boolean(ExpoImage) ? (
            <ExpoImage
              source={uri}
              style={styles.image}
              placeholder={{ blurhash }}
              contentFit={Boolean(scale) ? "contain" : "cover"}
              transition={1000}
            />
          ) : (
            <RNImage
              source={uri}
              style={styles.image}
              resizeMode={Boolean(scale) ? "contain" : "cover"}
            />
          )}
        </>
      ) : (
        <View style={styles.empty}>
          <Octicons name={iconName} size={18} color={color.gray100} />
        </View>
      )}
    </>
  );
};

export default memo(ImageView);
