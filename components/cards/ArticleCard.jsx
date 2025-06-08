import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColor, useConstant, useDebounce } from "../../hooks";
import { PrimaryButton } from "../reuseables";

const ArticleCard = ({ data }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    card: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.m,
      borderRadius: constant.size.s,
      backgroundColor: color.white,
    },
    text: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
    textBold: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.black,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.primary,
    },
    split: {
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: constant.size.m,
    },
    sect: {
      width: constant.dimension.width.divide(
        constant.size.m,
        constant.size.m * 4,
        2
      ),
      gap: constant.size.xs,
    },
  });

  const { summary, journal, source, pubDate, authors, link } = data;

  const _openArticle = useDebounce(async () => {
    router.push(`/(main)/article/?article=${link}`);
  });

  return (
    <View style={styles.card}>
      {/**split - source and date */}
      <View style={styles.split}>
        <View style={styles.sect}>
          <Text style={styles.textBold}>Source</Text>
          <Text style={styles.text} numberOfLines={1}>
            {source}
          </Text>
        </View>

        <View style={styles.sect}>
          <Text style={[styles.textBold, { textAlign: "right" }]}>
            Published
          </Text>
          <Text style={[styles.text, { textAlign: "right" }]}>{pubDate}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {summary}
      </Text>

      <>
        <View>
          <Text style={styles.textBold}>Author(s)</Text>
          <Text style={styles.text} numberOfLines={1}>
            {authors}
          </Text>
        </View>

        {/**remove comments if you wish to show this section again */}
        {/*
        <View>
          <Text style={styles.textBold}>Descriptive Summary</Text>
          <Text style={styles.text} numberOfLines={2}>
            {summary}
          </Text>
        </View>
        */}
      </>

      {/**button */}
      <PrimaryButton
        title={"Visit article"}
        icon={
          <Feather
            name="arrow-up-right"
            size={constant.size.m}
            color={color.white}
          />
        }
        onPress={_openArticle}
        disabled={Boolean(!link)}
      />
    </View>
  );
};

export default memo(ArticleCard);
