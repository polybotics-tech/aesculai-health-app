import { StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import * as Linking from "expo-linking";
import { useColor, useConstant } from "../../hooks";

const PolicyTextFormatComponent = ({ formattedLines }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    text: {
      marginBottom: constant.size.xm,
      flexWrap: "wrap",
    },
    textMode: (style = "regular") => ({
      fontWeight: constant.font.weight[`${style}`],
      fontSize: Boolean(style === "bold")
        ? constant.font.size.b
        : Boolean(style === "semibold")
        ? constant.font.size.m
        : constant.font.size.s,
      color: Boolean(style === "bold" || style === "semibold")
        ? color.black
        : color.gray200,
    }),
    link: {
      color: color.primary,
    },
  });

  return Boolean(!formattedLines) ? (
    <></>
  ) : (
    formattedLines.map((line, index) => (
      <Text key={index} style={[styles.text, styles.textMode(line?.style)]}>
        {line.parts.map((part, idx) => {
          if (part.type === "link") {
            const isEmail = part.text.includes("@");
            const url = isEmail
              ? `mailto:${part.text}`
              : part.text.startsWith("http")
              ? part.text
              : `https://${part.text}`;

            return (
              <Text
                key={idx}
                style={[styles.link]}
                onPress={() => Linking.openURL(url)}
              >
                {part.text}
              </Text>
            );
          } else {
            return <Text key={idx}>{part.text}</Text>;
          }
        })}
      </Text>
    ))
  );
};

export default memo(PolicyTextFormatComponent);
