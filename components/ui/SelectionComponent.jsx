import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColor, useConstant } from "../../hooks";

const SelectionComponent = ({
  title,
  description,
  value = "",
  name,
  form = {},
  setForm = () => {},
}) => {
  const color = useColor();
  const constant = useConstant();
  const isSelected = Boolean(value === form[name]);

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      padding: constant.size.m,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: constant.size.s,
      borderRadius: constant.size.s,
      borderWidth: 0.8,
      borderColor: isSelected ? color.primary : color.gray100,
    },
    holder: {
      maxWidth: "80%",
      gap: constant.size.xxs,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.black,
    },
    description: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
    indicator: {
      width: 18,
      height: 18,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: constant.size.r,
      borderWidth: 0.8,
      borderColor: isSelected ? color.primary : color.gray100,
    },
    indicatorInner: {
      width: 10,
      height: 10,
      borderRadius: constant.size.r,
      backgroundColor: isSelected ? color.primary : color.gray100,
    },
  });

  //--
  const _selectOption = () => {
    if (value && name) {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.component}
      onPress={_selectOption}
    >
      {/**holder */}
      <View style={styles.holder}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {/**check mark */}
      <View style={styles.indicator}>
        <View style={styles.indicatorInner}></View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(SelectionComponent);
