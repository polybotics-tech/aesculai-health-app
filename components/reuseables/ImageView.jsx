import { Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useColor } from "../../hooks";

const ImageView = ({
  uri,
  blur = "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
  scale,
  iconName = "image",
}) => {
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
        <Image
          source={uri}
          style={styles.image}
          placeholder={{ blurhash }}
          contentFit={Boolean(scale) ? "contain" : "cover"}
          transition={1000}
        />
      ) : (
        <View style={styles.empty}>
          <Octicons name={iconName} size={18} color={color.gray100} />
        </View>
      )}
    </>
  );
};

export default memo(ImageView);
