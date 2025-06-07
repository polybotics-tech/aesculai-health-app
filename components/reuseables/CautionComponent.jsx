import { Octicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColor, useConstant } from "../../hooks";

const CautionComponent = ({
  title = "Caution",
  message = "This is a precautionary message",
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.s,
      backgroundColor: color.primaryFaded,
      borderRadius: constant.size.s,
    },
    top: {
      flexDirection: "row",
      alignItems: "center",
      gap: constant.size.xs,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.primary,
    },
    message: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
  });

  return (
    <View style={styles.component}>
      <View style={styles.top}>
        <Octicons name="info" size={constant.size.m} color={color.primary} />
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default memo(CautionComponent);
