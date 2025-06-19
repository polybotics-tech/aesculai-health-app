import * as WebBrowser from "expo-web-browser";
//import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
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
import ImageLibrary from "../../lib/image";

WebBrowser.maybeCompleteAuthSession();

export default function AuthLayout() {
  const color = useColor();
  const constant = useConstant();

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

  //--warm up browser for faster popup authentication with google
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

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
          <ImageView uri={ImageLibrary.load_app_logo()} blur={""} />
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

            {/** remove comment to make google sign in visible

            {/**seperator /}
            <View style={styles.seperator}>
              <Text style={styles.seperatorText}>OR</Text>
            </View>

            {/**google /}
            <SignInWithGoogle />
            */}
          </>
        )}
      </ScrollViewWrapper>
    </SafeAreaWrapper>
  );
}

{
  /**not visible to user, but can be added back later 
const SignInWithGoogle = ({}) => {
  const alert = useAlert();

  //const redirectUri = makeRedirectUri();
  const redirectUri =
    "https://beccgvnzkynvedceyolx.supabase.co/auth/v1/callback";

  //--handle supabase auth
  const _submitTokenToSupabase = async (token) => {
    await Helper__supabase.googleAuth(setIsLoading, token);
  };

  //--
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "1098437746889-odhgbcs267tdkmekfush312eti0piqer.apps.googleusercontent.com", // Web client ID
    iosClientId:
      "1098437746889-2bdl76f5na8dqh5epvmbnkfi3aettc91.apps.googleusercontent.com",
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response?.authentication?.idToken;
      if (!idToken) {
        alert("No ID token received from Google. Please try again").error();
        return;
      }
      _submitTokenToSupabase(idToken);
    } else if (response?.type === "error") {
      alert("Google authentication failed").error();
    }
  }, [response]);

  const [isLoading, setIsLoading] = useState(false);
  const _signInWithGoogle = useDebounce(async () => {
    try {
      setIsLoading(true);

      //check availability
      if (!request) {
        alert(
          "Google authentication is not ready/available on this device"
        ).error();
        return;
      }

      await promptAsync({ redirectUri }); //call google auth
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

*/
}
