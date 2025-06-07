import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ImageView, PrimaryButton } from "../components/reuseables";
import { SafeAreaWrapper } from "../components/wrappers";
import { useColor, useConstant, useDebounce } from "../hooks";
import ImageLibrary from "../lib/image";

export default function Onboarding() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    page: {
      padding: constant.size.m,
      paddingBottom: constant.size.xxb,
      justifyContent: "space-between",
    },
  });

  //redirect to auth screen
  const _redirectToAuth = useDebounce(async () => {
    router.dismissTo("/(auth)/login/");
  });

  //--
  return (
    <SafeAreaWrapper style={styles.page}>
      {/**slider */}
      <OnboardSlider />

      {/**start button */}
      <PrimaryButton title={"Get started"} onPress={_redirectToAuth} />
    </SafeAreaWrapper>
  );
}

const OnboardSlider = ({}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    slider: {
      width: "100%",
      gap: constant.size.xb,
    },
    imageHolder: {
      width: "100%",
      height: 400,
      maxHeight: constant.dimension.height.ratio(1 / 2),
      overflow: "hidden",
    },
    textHolder: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.s,
    },
    title: {
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.black,
      textAlign: "center",
    },
    description: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
      textAlign: "center",
    },
  });

  //--
  const sections = [
    {
      title: "Welcome to Aesculai",
      description:
        "Your AI-powered clinical companion for faster, smarter assessments and insights—built with doctors and students in mind.",
      uri: "",
    },
    {
      title: "Take Smarter Assessments",
      description:
        "Use structured AI-guided history taking to collect key information and generate differential diagnoses, and test recommendations.",
      uri: "",
    },
    {
      title: "Stay Informed Anywhere",
      description:
        "Access relevant medical articles, engage with real-time assessments, and sharpen your clinical reasoning—all from your device.",
      uri: "",
    },
  ];
  const sectionsLength = sections?.length;
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prevIndex) => (prevIndex + 1) % sectionsLength);
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [sectionsLength, setActiveSection]);

  //--
  return (
    <View style={styles.slider}>
      {/**image holder */}
      <View style={styles.imageHolder}>
        <ImageView
          uri={ImageLibrary.load_onboard_photos(activeSection)}
          blur=""
        />
      </View>

      {/**indicator holder */}
      <IndicatorComponent active={activeSection} arr={sections} />

      {/**text holder */}
      <View style={styles.textHolder}>
        {/**title */}
        <Text style={styles.title}>{sections[activeSection]?.title}</Text>

        {/**description */}
        <Text style={styles.description}>
          {sections[activeSection]?.description}
        </Text>
      </View>
    </View>
  );
};

const IndicatorComponent = ({ active, arr }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.s,
    },
    indicator: (isActive) => ({
      width: 8,
      height: 8,
      borderRadius: constant.size.r,
      backgroundColor: isActive ? color.primary : color.gray100,
    }),
  });

  return (
    <View style={styles.component}>
      {Boolean(arr) &&
        arr?.map((item, index) => (
          <View
            key={index}
            style={styles.indicator(Boolean(index === active))}
          ></View>
        ))}
    </View>
  );
};
