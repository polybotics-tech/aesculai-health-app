import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { memo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useColor, useConstant } from "../../hooks";

const SafeAreaWrapper = ({ children, style = {} }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      width: constant.dimension.width.full,
      backgroundColor: color.white,
    },
  });

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      {/**status bar */}
      <AppStatusBar />

      {children}
    </SafeAreaView>
  );
};

export default memo(SafeAreaWrapper);

const AppStatusBar = ({}) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} animated={true} />

      <Stack.Screen
        options={{
          headerShown: false,
          navigationBarHidden: false,
          animation: "none",
        }}
      />
    </>
  );
};
