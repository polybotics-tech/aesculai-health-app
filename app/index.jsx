import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import * as Application from "expo-application";
import { useSelector } from "react-redux";
import { SafeAreaWrapper } from "../components/wrappers";
import { useColor, useConstant, useDebounce } from "../hooks";
import ImageLibrary from "../lib/image";

export default function Index() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    page: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: color.white,
      paddingVertical: constant.size.m,
    },
    holder: {
      width: 200,
      height: 200,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    about: {
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.xs,
    },
    from: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
      textAlign: "center",
    },
    owner: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.gray200,
      textAlign: "center",
    },
    center: {
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.m,
    },
    appname: {
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.black,
      textAlign: "center",
    },
    primary: {
      color: color.primary,
    },
    progress: {
      width: 200,
    },
  });

  //--
  const session = useSelector((state) => state.app.session);
  const checkRef = useRef(null);
  const currentAppVersion = Application.nativeApplicationVersion;

  //--
  const _checkLoadStatus = useDebounce(async () => {
    // //if session and user exists, navigate to home
    if (session && session?.user) {
      router.dismissTo("/(tabs)/");
    } else {
      //if no session, navigate to onboarding
      router.dismissTo("/onboarding/");
    }
  });

  //check load status
  useEffect(() => {
    // Clear any previous timeout
    if (checkRef.current) clearTimeout(checkRef.current);

    checkRef.current = setTimeout(() => {
      _checkLoadStatus();
    }, 3000);

    return () => {
      if (checkRef.current) {
        clearTimeout(checkRef.current);
      }
    };
  }, [session]);

  return (
    <SafeAreaWrapper>
      <View style={styles.page}>
        <View></View>

        <View style={styles.center}>
          <View style={styles.holder}>
            <Image source={ImageLibrary.load_app_logo()} style={styles.image} />
          </View>

          <View style={styles.progress}>
            <Progress.Bar
              progress={0.3}
              indeterminate={true}
              indeterminateAnimationDuration={1000}
              width={null}
              height={4}
              color={color.primary}
              unfilledColor={color.primaryFaded}
              borderWidth={0}
              borderRadius={constant.size.b}
            />
          </View>

          <Text style={styles.appname}>
            Aesculai <Text style={styles.primary}>Health</Text> App
          </Text>
        </View>

        {/**about */}
        <View style={styles.about}>
          <Text style={styles.from}>version {currentAppVersion}</Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
