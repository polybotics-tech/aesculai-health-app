import { Octicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ArticleCard } from "../../components/cards";
import { NotFoundComponent } from "../../components/reuseables";
import { FormComponent } from "../../components/ui";
import { ScrollViewWrapper } from "../../components/wrappers";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__article from "../../hooks/helpers/article.api";

export default function LearnPage() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    searchBar: {
      width: "100%",
      padding: constant.size.m,
      backgroundColor: color.white,
    },
    showres: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
  });

  const [form, setForm] = useState({
    q: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [articles, setArticles] = useState();

  const _searchForArticles = useDebounce(async () => {
    const res = await Helper__article.searchMedicalArticles(
      setIsLoading,
      form?.q
    );

    if (res?.error) {
      setArticles();
    } else {
      setArticles(res?.articles);
    }
  });

  useEffect(() => {
    _searchForArticles();
  }, []);

  return (
    <>
      {/**search */}
      <View style={styles.searchBar}>
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
          placeholder={"Search article by related terms"}
          name={"q"}
          form={form}
          setForm={setForm}
          submitFunc={() => {
            _searchForArticles();
          }}
        />
      </View>

      {/**articles */}
      <ScrollViewWrapper>
        {articles && form?.q && (
          <Text style={styles.showres}>Showing results for "{form?.q}"</Text>
        )}

        {isLoading || !articles ? (
          <NotFoundComponent
            isLoading={isLoading}
            text={`Unable to find articles. ${
              Boolean(form?.q) ? `[term: ${form?.q}]` : "Please try again later"
            }`}
          />
        ) : (
          articles?.map((item, index) => (
            <ArticleCard key={index} data={item} />
          ))
        )}
      </ScrollViewWrapper>
    </>
  );
}
