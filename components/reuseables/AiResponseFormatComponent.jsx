import { memo } from "react";
import { StyleSheet, Text } from "react-native";
import { useColor, useConstant } from "../../hooks";

const AiResponseFormatComponent = ({ response = "" }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    boldOne: {
      fontWeight: constant.font.weight.semibold,
    },
    boldTwo: {
      fontWeight: constant.font.weight.bold,
      color: color.black,
    },
  });

  //--
  const parts = response.split(/(\*\*[^*]+\*\*)/g); // split by bold parts

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={styles.boldTwo}>
          {part.slice(2, -2)}
        </Text>
      );
    } else if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <Text key={index} style={styles.boldOne}>
          {part.slice(2, -2)}
        </Text>
      );
    } else {
      return <Text key={index}>{part}</Text>;
    }
  });
};

export default memo(AiResponseFormatComponent);
