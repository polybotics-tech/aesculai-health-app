import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router, Slot, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { ImageView, PrimaryButton } from "../../components/reuseables";
import { SafeAreaWrapper, ScrollViewWrapper } from "../../components/wrappers";
import {
  useAlert,
  useColor,
  useConstant,
  useDebounce,
  useImageLoader,
} from "../../hooks";
import Helper__supabase from "../../hooks/helpers/supabase.api";

export default function AuthLayout() {
  const color = useColor();
  const constant = useConstant();
  const imageLoader = useImageLoader();

  const styles = StyleSheet.create({
    page: {
      padding: constant.size.m,
      paddingBottom: 0,
      gap: constant.size.m,
    },
    scroll: {
      padding: 0,
      gap: constant.size.m,
    },
    topBar: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logoHolder: {
      width: 42,
      height: 42,
      overflow: "hidden",
    },
    logo: {
      width: "100%",
      height: "100%",
    },
    titleBlock: {
      gap: constant.size.xs,
      marginBottom: constant.size.xxb,
    },
    title: {
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.black,
    },
    description: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
    switchText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
      textAlign: "center",
    },
    switchLink: {
      fontWeight: constant.font.weight.semibold,
      color: color.primary,
    },
    seperator: {
      width: "100%",
      height: 0.5,
      marginVertical: constant.size.xxb,
      backgroundColor: color.gray100,
      alignItems: "center",
      justifyContent: "center",
    },
    seperatorText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
      backgroundColor: color.white,
      height: constant.size.m,
      paddingHorizontal: constant.size.xs,
    },
  });

  //--
  const session = useSelector((state) => state.app.session);
  const user = useSelector((state) => state.app.user);

  //--look out for updates in session and user
  useEffect(() => {
    if (session?.user && user?.id && user?.full_name) {
      router.dismissTo("/(tabs)/"); //force user to complete registration
    }
  }, [session, user]);

  //--
  const pathname = usePathname();
  const currentPage = pathname.split("/").pop();

  //dynamically set page details based on the current page
  const pageDetails = {
    login: {
      title: "Log in to your account",
      description: "Enter your credentials to access your account.",
      switch: "Don't have an account?",
      switchText: "Register now.",
      switchTo: "/(auth)/register",
    },
    register: {
      title: "Create a new account",
      description: "Fill in the details to create a new account.",
      switch: "Already have an account?",
      switchText: "Log in.",
      switchTo: "/(auth)/login",
    },
    complete: {
      title: "Complete account registration",
      description: "Fill in the remaining details of your account.",
    },
    photo: {
      title: "Set profile photo",
      description: "Upload your preferred photo as your avatar.",
    },
  };

  //handle switch between auth page
  const _handleSwitch = () => {
    router.replace(pageDetails[currentPage]?.switchTo);
  };

  return (
    <SafeAreaWrapper style={styles.page}>
      {/**top bar */}
      <View style={styles.topBar}>
        <View></View>

        {/**logo */}
        <View style={styles.logoHolder}>
          <ImageView uri={imageLoader.logo()} blur={""} />
        </View>
      </View>

      <ScrollViewWrapper style={styles.scroll}>
        {/**title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{pageDetails[currentPage]?.title}</Text>
          <Text style={styles.description}>
            {pageDetails[currentPage]?.description}
          </Text>
        </View>

        {/**different pages */}
        <Slot />

        {Boolean(currentPage === "login" || currentPage === "register") && (
          <>
            {/**bottom options */}

            <Text style={styles.switchText}>
              {pageDetails[currentPage]?.switch}{" "}
              <Text style={styles.switchLink} onPress={_handleSwitch}>
                {pageDetails[currentPage]?.switchText}
              </Text>
            </Text>

            {/**seperator */}
            <View style={styles.seperator}>
              <Text style={styles.seperatorText}>OR</Text>
            </View>

            {/**google */}
            <SignInWithGoogle />
          </>
        )}
      </ScrollViewWrapper>
    </SafeAreaWrapper>
  );
}

const SignInWithGoogle = ({}) => {
  const color = useColor();
  const constant = useConstant();
  const alert = useAlert();

  const styles = StyleSheet.create({
    googleBtn: {
      width: "100%",
      height: constant.size.btn,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: constant.size.xs,
      borderRadius: constant.size.s,
      backgroundColor: color.primaryFaded,
      borderWidth: 1,
      borderColor: color.primary,
    },
    googleText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.primary,
    },
  });

  //--
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "1098437746889-odhgbcs267tdkmekfush312eti0piqer.apps.googleusercontent.com",
      iosClientId:
        "385057153859-vuav0b4a4tp84vg7vsredf9vkd281ntj.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      profileImageSize: 1280,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  //--handle supabase auth
  const _submitTokenToSupabase = async (token) => {
    await Helper__supabase.googleAuth(setIsLoading, token);
  };

  //check if google auth is availabke for device
  const _googleAuthIsAvailable = async () => {
    const check = await GoogleSignin.hasPlayServices();

    return check;
  };

  const _signInWithGoogle = useDebounce(async () => {
    try {
      setIsLoading(true);

      //check availability
      const canProceed = await _googleAuthIsAvailable();

      if (!canProceed) {
        alert("Google authentication is not available on this device").error();
        return;
      }

      const googleInfo = await GoogleSignin.signIn();

      if (googleInfo) {
        if (googleInfo?.type === "cancelled") {
          alert(
            "Google authentication failed. Request was interupted or canceled"
          ).error();
          return;
        }

        //continue to supabase
        await _submitTokenToSupabase(googleInfo?.idToken);
      } else {
        alert(
          "Google authentication failed. Check internet connection"
        ).error();
        return;
      }
    } catch (error) {
      alert(
        `Google authentication failed. ${
          error?.message || "Something went wrong"
        }`
      ).error();
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <PrimaryButton
      title={"Continue with Google"}
      type={"secondary"}
      onPress={_signInWithGoogle}
      isLoading={isLoading}
    />
  );
};
