import { Octicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColor, useConstant } from "../../hooks";

const ToastComponent = ({ type = "error", text = "", props }) => {
  const color = useColor();
  const constant = useConstant();

  const isSuccess = Boolean(type === "success");
  const isPending = Boolean(type === "pending");

  const styles = StyleSheet.create({
    component: {
      width: constant.dimension.width.subtract(0, constant.size.m * 2, 0),
      padding: constant.size.m,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: constant.size.m,
      borderRadius: constant.size.s,
      backgroundColor: isSuccess
        ? color.successFaded
        : isPending
        ? color.primaryFaded
        : color.errorFaded,
      borderWidth: 0.8,
      borderColor: isSuccess
        ? color.success
        : isPending
        ? color.primary
        : color.error,
    },
    text: {
      maxWidth: constant.dimension.width.subtract(
        constant.size.m,
        constant.size.m * 2 + constant.size.s * 2,
        24
      ),
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: isSuccess
        ? color.success
        : isPending
        ? color.primary
        : color.error,
    },
  });

  //--

  return (
    <View style={styles.component}>
      <Text style={styles.text}>{text}</Text>

      <TouchableOpacity activeOpacity={0.6} onPress={() => props?.hide()}>
        <Octicons
          name="x"
          size={constant.size.b}
          color={
            isSuccess ? color.success : isPending ? color.gray200 : color.error
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(ToastComponent);
