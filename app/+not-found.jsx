import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaWrapper } from "../components/wrappers";
import { useColor, useConstant, useDebounce } from "../hooks";
import { router } from "expo-router";

export default function NotFound() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    page: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.m,
    },
    top: {
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.xxs,
    },
    error: {
      fontSize: constant.font.size.xxxb * 3,
      fontWeight: constant.font.weight.bold,
      color: color.error,
      textAlign: "center",
    },
    desc: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
      textAlign: "center",
    },
    btnText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.primary,
      textAlign: "center",
    },
  });

  const _goHome = useDebounce(() => {
    router.dismissTo("/(tabs)/");
  }, []);

  return (
    <SafeAreaWrapper>
      <View style={styles.page}>
        <View style={styles.top}>
          <Text style={styles.error}>404</Text>
          <Text style={styles.desc}>
            The page to tried to access does not exist
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.6} onPress={_goHome}>
          <Text style={styles.btnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({});
