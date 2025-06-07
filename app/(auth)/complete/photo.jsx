import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { PrimaryButton } from "../../../components/reuseables";
import { ProfilePhotoComponent } from "../../../components/ui";
import { useColor, useConstant, useDebounce } from "../../../hooks";

export default function SetProfilePhoto() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    page: {
      height: constant.dimension.height.full - 260,
      gap: constant.size.m,
      justifyContent: "space-between",
    },
    button: {
      marginTop: constant.size.xb * 3,
    },
    userBlock: {
      width: "100%",
      marginBottom: constant.size.xxb,
      alignItems: "center",
      gap: constant.size.xb,
    },
    userDetails: {
      width: "100%",
      gap: constant.size.xs,
    },
    userName: {
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.black,
      textAlign: "center",
      textTransform: "capitalize",
    },
    userMail: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
      textAlign: "center",
    },
  });

  //--
  const user = useSelector((state) => state.app.user);

  //--
  const _continueToHomePage = useDebounce(() => {
    router.dismissTo("/(tabs)/");
  });

  return (
    <View style={styles.page}>
      {/**user block */}
      <View style={styles.userBlock}>
        {/**profile photo */}
        <ProfilePhotoComponent />

        {/**user data */}
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user?.full_name}</Text>
          <Text style={styles.userMail} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
      </View>

      {/**button */}
      <View style={styles.button}>
        <PrimaryButton title={"Continue"} onPress={_continueToHomePage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
