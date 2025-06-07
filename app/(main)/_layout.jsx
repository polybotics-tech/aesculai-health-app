import { Slot, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BackBtn } from "../../components/reuseables";
import { SafeAreaWrapper } from "../../components/wrappers";
import { useColor, useConstant } from "../../hooks";

export default function MainLayout() {
  const styles = StyleSheet.create({});

  //--
  return (
    <SafeAreaWrapper>
      {/**header component */}
      <MainHeaderComponent />

      {/**page slot */}
      <Slot />
    </SafeAreaWrapper>
  );
}

const MainHeaderComponent = ({}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      paddingVertical: constant.size.s,
      paddingHorizontal: constant.size.m,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: color.white,
      borderBottomWidth: 0.8,
      borderBottomColor: color.gray50,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.black,
      textTransform: "capitalize",
    },
    placeholder: {
      width: constant.size.b,
    },
  });

  //--
  const pathname = usePathname();
  const page = pathname.split("/").pop();
  const pageTitles = {
    profile: "Personal Account",
    assessment: "Take Assessment",
    article: "Article Details",
  };

  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (page) {
      default:
        setTitle(pageTitles[page]);
        break;
    }
  }, [page]);

  //--
  return (
    <View style={styles.component}>
      <BackBtn />

      {/**page title */}
      <Text style={styles.title}>{title}</Text>

      <View style={styles.placeholder}></View>
    </View>
  );
};
