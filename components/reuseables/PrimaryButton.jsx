import { memo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColor, useConstant } from "../../hooks";

const PrimaryButton = ({ ...props }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    primaryBtn: (type = "primary") => ({
      width: "100%",
      height: constant.size.btn,
      borderRadius: constant.size.s,
      backgroundColor: type === "primary" ? color.primary : color.primaryFaded,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    }),
    primaryBtnText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
    },
    primaryBtnIcon: {
      alignItems: "center",
      justifyContent: "center",
    },
  });

  //--

  return (
    <TouchableOpacity
      style={[
        styles.primaryBtn(props?.type),
        props?.style,
        { opacity: props?.disabled ? 0.5 : 1 },
      ]}
      disabled={props?.disabled || props?.isLoading}
      onPress={props?.onPress}
      activeOpacity={0.6}
    >
      <Text
        style={[
          styles.primaryBtnText,
          {
            color:
              props?.color || props?.type === "secondary"
                ? color.primary
                : color.white,
          },
        ]}
      >
        {props?.title}
      </Text>

      {props?.isLoading ? (
        <ActivityIndicator
          size={constant.font.size.s}
          color={
            props?.color || props?.type === "secondary"
              ? color.primary
              : color.white
          }
        />
      ) : (
        <>
          {props?.icon && (
            <View
              style={[
                styles.primaryBtnIcon,
                props?.iconSize && { width: props?.iconSize },
              ]}
            >
              {props?.icon}
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default memo(PrimaryButton);
