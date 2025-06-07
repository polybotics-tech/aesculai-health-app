import { memo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useColor, useConstant } from "../../hooks";

const NotFoundComponent = ({
  text = "Not found",
  isLoading = true,
  height = 100,
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    card: {
      width: "100%",
      height,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
  });

  return (
    <View style={styles.card}>
      {isLoading ? (
        <ActivityIndicator size={constant.size.m} color={color.gray100} />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  );
};

export default memo(NotFoundComponent);
