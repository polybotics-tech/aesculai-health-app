import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";

export default function VisitArticle() {
  const { article } = useLocalSearchParams();
  console.log("article: ", article);

  //--article link will be launched here within the app, so the user doesn't leave the app
  return (
    <WebView
      source={{ uri: article }}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}

const styles = StyleSheet.create({});
