import { Ionicons, Octicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import { useColor, useConstant, useDebounce } from "../../hooks";
import ImageLibrary from "../../lib/image";
import { ImageView } from "../reuseables";

const ImagingPhotoComponent = ({
  form = {},
  setForm = () => {},
  name = "image",
  isLoading = false,
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      height: 250,
      backgroundColor: color.gray50,
      borderRadius: constant.size.m,
      overflow: "hidden",
    },
  });

  //--
  return (
    <View style={styles.component}>
      {Boolean(form[name]?.uri && form[name]?.base64) ? (
        <PreviewComponent
          form={form}
          setForm={setForm}
          name={name}
          isLoading={isLoading}
        />
      ) : (
        <PickerComponent setForm={setForm} name={name} />
      )}
    </View>
  );
};

export default memo(ImagingPhotoComponent);

const PickerComponent = ({ setForm = () => {}, name = "image" }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      height: "100%",
      padding: constant.size.m,
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.s,
    },
    text: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.gray100,
    },
  });

  //--pull up gallery to select photo and convert to base 64
  const _pickImageAndConvertToBase64 = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setForm((prev) => ({ ...prev, [name]: { base64, uri } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: { uri: "", base64: "" } }));
    }

    return;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.component}
      onPress={_pickImageAndConvertToBase64}
    >
      <Ionicons
        name="image-outline"
        size={constant.size.xxb}
        color={color.gray100}
      />
      <Text style={styles.text}>Tap to upload photo imaging for analyzing</Text>
    </TouchableOpacity>
  );
};

const PreviewComponent = ({
  form = {},
  setForm = () => {},
  name = "image",
  isLoading = false,
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      height: "100%",
      position: "relative",
    },
    delete: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color.white,
      borderRadius: constant.size.s,
      position: "absolute",
      top: constant.size.s,
      right: constant.size.s,
    },
    overlay: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.s,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      position: "absolute",
      top: 0,
      left: 0,
    },
    analyzing: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.primary,
    },
    progress: {
      width: 200,
    },
  });

  //--
  const [previewUri, setPreviewUri] = useState("");
  useEffect(() => {
    const _compressImageForPreview = async () => {
      const compressed = await ImageLibrary.compress_image(form?.image?.uri);

      setPreviewUri(compressed?.uri);
    };

    if (form?.image?.uri) {
      _compressImageForPreview();
    }
  }, [form?.image?.uri]);

  //--
  const _removeImage = useDebounce(() => {
    setForm((prev) => ({ ...prev, [name]: { uri: "", base64: "" } }));
  });

  return (
    <View style={styles.component}>
      <ImageView
        uri={ImageLibrary.load_picker_thumbnail(previewUri)}
        blur=""
        scale={true}
      />

      {/**delete button */}
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.delete}
        onPress={_removeImage}
      >
        <Octicons name="trash" size={constant.size.m} color={color.error} />
      </TouchableOpacity>

      {/**analyzing overlay */}
      {isLoading && (
        <View style={styles.overlay}>
          <Text style={styles.analyzing}>Analyzation in progress...</Text>
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
        </View>
      )}
    </View>
  );
};
