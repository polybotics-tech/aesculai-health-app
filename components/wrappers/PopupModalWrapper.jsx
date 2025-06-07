import { memo } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColor, useConstant, useKeyboardHeight } from "../../hooks";

const PopupModalWrapper = ({ children, onCloseFunc = () => {}, ...props }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    modalInset: {
      width: "100%",
      minHeight: constant.dimension.height.ratio(1 / 3),
      maxHeight:
        Platform.OS === "ios"
          ? constant.dimension.height.ratio(1 / 1.5)
          : constant.dimension.height.ratio(1 / 2.5),
      position: "absolute",
      bottom: 0,
      left: 0,
      backgroundColor: color.white,
      shadowColor: color.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
      borderTopLeftRadius: constant.size.xm,
      borderTopRightRadius: constant.size.xm,
    },
    header: {
      width: "100%",
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: color.gray50,
    },
    headerTitle: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.black,
    },
    cancelBtn: {
      width: 48,
      paddingVertical: 8,
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.error,
      textAlign: "center",
    },
    container: {
      width: "100%",
      padding: constant.size.m,
    },
    backDrop: {
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.7)",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: -1,
    },
  });

  //handle keyboard display
  const keyboardPadding = useKeyboardHeight();

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props?.isVisible}
        onRequestClose={() => {
          props?.setIsVisible(false);
        }}
        onDismiss={() => {
          onCloseFunc();
        }}
      >
        <View style={styles.modalInset}>
          <View style={styles.header}>
            <View style={styles.cancelBtn}></View>

            {/**title */}
            <Text style={styles.headerTitle}>{props?.title}</Text>

            {/**close modal */}
            <TouchableOpacity
              onPress={() => {
                props?.setIsVisible(false);
              }}
            >
              <Text style={styles.cancelBtn}>Close</Text>
            </TouchableOpacity>
          </View>

          {/** */}
          <ScrollView
            contentContainerStyle={[
              styles.container,
              {
                paddingBottom: keyboardPadding + constant.size.xxb * 2,
              },
              props?.containerStyle,
            ]}
          >
            {children}
          </ScrollView>
        </View>

        {/**transparent bg and close button */}
        <Pressable
          onPress={() => {
            props?.setIsVisible(false);
          }}
          style={styles.backDrop}
        />
      </Modal>
    </>
  );
};

export default memo(PopupModalWrapper);
