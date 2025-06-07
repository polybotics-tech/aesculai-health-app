import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { router, Tabs, usePathname } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import ImageView from "../../components/reuseables/ImageView";
import { SafeAreaWrapper } from "../../components/wrappers";
import {
  useColor,
  useConstant,
  useDebounce,
  useImageLoader,
  useKeyboardHeight,
} from "../../hooks";
import StringLibrary from "../../lib/string";

export default function TabsLayout() {
  const color = useColor();
  const constants = useConstant();
  const keyboardHeight = useKeyboardHeight();

  //--
  const path = usePathname();
  const currentPage = String(path)?.split("/")?.pop()?.toLowerCase();
  // This will give us the current page name, e.g., "" for index, "imaging", "drugs", "learn", "chats"

  //
  const pagesWithWhiteBackground = ["imaging", "drugs", "chats"];
  const pagesWithAdjustablePadding = ["imaging", "chats"];

  const styles = StyleSheet.create({
    safeView: {
      paddingBottom: Boolean(pagesWithAdjustablePadding?.includes(currentPage))
        ? keyboardHeight
        : 0,
    },
    tab: {
      height: constants.dimension.height.nav,
      backgroundColor: color.white,
      borderTopWidth: 0.8,
      borderColor: color.gray50,
      paddingTop: 4,
      elevation: 0,
    },
    scene: {
      backgroundColor: Boolean(pagesWithWhiteBackground?.includes(currentPage))
        ? color.white
        : color.gray50,
    },
  });

  return (
    <SafeAreaWrapper style={styles.safeView}>
      <Tabs
        screenOptions={{
          header: ({ ...props }) => (
            <TabsHeaderComponent props={props} activePage={currentPage} />
          ),
          tabBarStyle: styles.tab,
          sceneStyle: styles.scene,
          tabBarHideOnKeyboard: false,
          tabBarInactiveTintColor: color.gray100,
          tabBarActiveTintColor: color.primary,
          tabBarButton: ({ children, ...props }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={props?.style}
              onPress={props?.onPress}
            >
              {children}
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Octicons name="home" size={constants.size.b} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="imaging"
          options={{
            title: "Imaging",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="line-scan"
                size={constants.size.b}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="drugs"
          options={{
            title: "Drugs",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Octicons
                name="codescan-checkmark"
                size={constants.size.b}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="learn"
          options={{
            title: "Learn",
            tabBarIcon: ({ color }) => (
              <Octicons name="book" size={constants.size.b} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="chats"
          options={{
            title: "AI Chats",
            tabBarIcon: ({ color }) => (
              <Octicons name="comment" size={constants.size.b} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaWrapper>
  );
}

const TabsHeaderComponent = ({ props, activePage }) => {
  const color = useColor();
  const constant = useConstant();
  const imageLoader = useImageLoader();

  const styles = StyleSheet.create({
    titleComponent: {
      width: "100%",
      paddingVertical: constant.size.s,
      paddingHorizontal: constant.size.m,
      alignItems: "center",
      justifyContent: "center",
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
    component: {
      width: "100%",
      paddingVertical: constant.size.s,
      paddingHorizontal: constant.size.m,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: constant.size.m,
      backgroundColor: color.white,
      borderBottomWidth: 0.8,
      borderBottomColor: color.gray50,
    },
    top: {
      flexDirection: "row",
      alignItems: "center",
      gap: constant.size.xs,
    },
    logo: {
      width: constant.size.set(24),
      height: constant.size.set(24),
      overflow: "hidden",
    },
    appname: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.black,
    },
    userBlock: {
      flexDirection: "row",
      alignItems: "center",
      gap: constant.size.s,
    },
    user: {
      alignItems: "flex-end",
      gap: constant.size.xxs,
    },
    greeting: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
    userName: {
      maxWidth: constant.dimension.width.ratio(1 / 2.7),
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.gray200,
    },
    photo: {
      width: constant.size.set(40),
      height: constant.size.set(40),
      borderRadius: constant.size.s,
      backgroundColor: color.gray50,
      overflow: "hidden",
      borderWidth: 0.8,
      borderColor: color.gray100,
    },
  });

  //--
  const app = useSelector((state) => state.app);
  //--
  const session = app.session;
  const user = app.user;

  //--look out for updates in session and user
  useEffect(() => {
    if (session && session?.user && user) {
      if (!user?.full_name || !user?.role) {
        router.dismissTo("/(auth)/complete/"); //force user to complete registration
      }
    } else {
      router.dismissTo("/(auth)/login/"); //redirect to login page
    }
  }, [session, user]);

  //--
  const pagesToShowTitle = ["imaging", "learn", "chats"];

  const _goToProfile = useDebounce(() => {
    router.navigate("/(main)/profile/");
  });

  //--
  return (
    <>
      {Boolean(pagesToShowTitle?.includes(activePage)) ? (
        <View style={styles.titleComponent}>
          <Text style={styles.title}>{activePage}</Text>
        </View>
      ) : (
        <View style={styles.component}>
          {/**top */}
          <View style={styles.top}>
            {/**logo */}
            <View style={styles.logo}>
              <ImageView uri={imageLoader.logo()} blur="" />
            </View>

            <Text style={styles.appname}>
              {String(app?.name)?.split(" ")[0]}
            </Text>
          </View>

          <View style={styles.userBlock}>
            <View style={styles.user}>
              <Text style={styles.greeting}>Hi,</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {StringLibrary.extract_first_name(user?.full_name)}
              </Text>
            </View>

            {/**photo */}
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.photo}
              onPress={_goToProfile}
            >
              <ImageView
                uri={imageLoader.thumbnail(user?.avatar_url)}
                blur=""
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};
