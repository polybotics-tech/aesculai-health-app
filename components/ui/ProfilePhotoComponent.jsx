import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { memo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__supabase from "../../hooks/helpers/supabase.api";
import { ImageView } from "../reuseables";
import ImageLibrary from "../../lib/image";

const ProfilePhotoComponent = () => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: 150,
      height: 150,
      backgroundColor: color.gray50,
      borderRadius: constant.size.s,
      borderWidth: 1.3,
      borderColor: color.gray100,
    },
    preview: {
      width: "100%",
      height: "100%",
      borderRadius: constant.size.s,
      overflow: "hidden",
    },
    editBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color.white,
      borderRadius: constant.size.s,
      position: "absolute",
      bottom: constant.size.xs,
      right: constant.size.xs,
    },
    modalTab: {
      width: "100%",
      paddingVertical: constant.size.xb,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.xxb,
    },
  });

  //--
  const user = useSelector((state) => state.app.user);
  const [isLoading, setIsLoading] = useState(false);

  //--pull up gallery to select photo
  const _pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      return image;
    }

    return null;
  };

  //--upload to supabase
  const _handlePhotoUpload = useDebounce(async () => {
    const image = await _pickImageFromGallery();
    if (!image) return;

    await Helper__supabase.updateProfilePhoto(
      setIsLoading,
      { image },
      user?.id
    );

    return;
  });

  //--
  return (
    <View style={styles.component}>
      {/**preview */}
      <View style={styles.preview}>
        <ImageView
          uri={ImageLibrary.load_thumbnail(user?.avatar_url)}
          blur=""
        />
      </View>

      {/**edit button */}
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.editBtn}
        onPress={_handlePhotoUpload}
      >
        {isLoading ? (
          <ActivityIndicator size={constant.size.b} color={color.gray200} />
        ) : (
          <Feather name="camera" size={constant.size.b} color={color.gray200} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default memo(ProfilePhotoComponent);
