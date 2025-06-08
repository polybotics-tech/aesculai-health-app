import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ArticleCard } from "../../components/cards";
import { NotFoundComponent, PrimaryButton } from "../../components/reuseables";
import { FormComponent } from "../../components/ui";
import { ScrollViewWrapper } from "../../components/wrappers";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__article from "../../hooks/helpers/article.api";

export default function HomePage() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    assessmentBlock: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.xxb * 2,
      borderRadius: constant.size.m,
      backgroundColor: color.primaryFaded,
    },
    assessmentBlockTop: {
      width: "100%",
      gap: constant.size.xs,
    },
    assessmentTitle: {
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.primary,
    },
    assessmentDesc: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
    assessmentBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: constant.size.s,
      backgroundColor: color.white,
    },
    section: {
      width: "100%",
      paddingVertical: constant.size.m,
      gap: constant.size.m,
    },
    sectionTitle: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.bold,
      color: color.black,
    },
  });

  //--
  const [form, setForm] = useState({
    q: "",
  });
  const _submitSearch = useDebounce(async () => {
    // Handle the search submission here
    // by redirecting to the drugs page with the search query

    if (!form.q) return; // Prevent submission if the query is empty
    router.navigate(`/(tabs)/drugs?q=${encodeURIComponent(form.q)}`);
    setForm((prev) => ({ q: "" }));
  });

  //--
  const _startAssessment = useDebounce(() => {
    router.navigate("/(main)/assessment/");
  });
  //--
  return (
    <ScrollViewWrapper>
      {/**on submit, redirect to drugs page */}
      <FormComponent
        formType={"input"}
        inputMode={"text"}
        inputIcon={
          <Octicons
            name="search"
            size={constant.size.m}
            color={color.gray100}
          />
        }
        bgColor={color.white}
        placeholder={"Search for drugs"}
        name={"q"}
        form={form}
        setForm={setForm}
        submitType={"search"}
        submitFunc={_submitSearch}
      />

      {/**start assessment button */}
      <View style={styles.assessmentBlock}>
        <View style={styles.assessmentBlockTop}>
          <Text style={styles.assessmentTitle}>Take Patient Assessment</Text>

          <Text style={styles.assessmentDesc}>
            Begin a structured health assessment designed to collect key medical
            information for accurate analysis, and to receive personalized
            insights and recommendations.
          </Text>
        </View>

        <PrimaryButton
          title={"Start now"}
          icon={
            <Octicons
              name="checklist"
              size={constant.size.m}
              color={color.white}
            />
          }
          onPress={_startAssessment}
        />
      </View>

      {/**learn articles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>You may like these articles</Text>

        <RecommendArticles />
      </View>
    </ScrollViewWrapper>
  );
}

const RecommendArticles = ({}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    link: {
      fontWeight: constant.font.weight.semibold,
      color: color.primary,
      textAlign: "center",
    },
  });

  const [recommended, setRecommended] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const _fetchRecommendedArticles = async () => {
    const res = await Helper__article.searchMedicalArticles(setIsLoading, "");

    if (res?.error) {
      setErrMsg(res?.error);
      setRecommended();
    } else {
      setRecommended(res?.articles);
      setErrMsg("");
    }
  };

  useEffect(() => {
    _fetchRecommendedArticles();
  }, []);

  return (
    <>
      {recommended && recommended?.length > 0 ? (
        recommended?.map((item, index) => (
          <ArticleCard key={index} data={item} />
        ))
      ) : (
        <NotFoundComponent
          isLoading={isLoading}
          text={
            <Text>
              {errMsg || "No articles found"}
              {`\n`}
              <Text style={styles.link} onPress={_fetchRecommendedArticles}>
                Try again
              </Text>
            </Text>
          }
        />
      )}
    </>
  );
};
