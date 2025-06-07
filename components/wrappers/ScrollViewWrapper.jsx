import { memo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useConstant, useKeyboardHeight } from "../../hooks";

const ScrollViewWrapper = ({ children, style }) => {
  const constant = useConstant();
  const keyboardHeight = useKeyboardHeight();

  const styles = StyleSheet.create({
    scroll: {
      width: "100%",
      minHeight: "100%",
      gap: constant.size.m,
      padding: constant.size.m,
      paddingBottom: constant.size.set(64) + keyboardHeight,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, style]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {children}
    </ScrollView>
  );
};

export default memo(ScrollViewWrapper);
