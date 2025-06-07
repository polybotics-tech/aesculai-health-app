import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useAlert, useColor, useConstant, useDebounce } from "../../hooks";

const BackBtn = ({ goTo = "" }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    button: {
      width: constant.size.b,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const _goBack = useDebounce(() => {
    if (goTo) {
      router.replace(goTo);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        useAlert("No page to go back to").error();
      }
    }
  });

  //--
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.button}
      onPress={_goBack}
    >
      <Octicons
        name={Platform.OS === "ios" ? "chevron-left" : "arrow-left"}
        size={constant.size.b}
        color={color.gray200}
      />
    </TouchableOpacity>
  );
};

export default memo(BackBtn);
