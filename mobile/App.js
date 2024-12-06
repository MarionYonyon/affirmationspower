import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, SafeAreaView, KeyboardAvoidingView } from "react-native";
import { WebView } from "react-native-webview";

const WEBVIEW_URL_PROD = "https://marionyonyon.github.io/affirmationspower/";
const WEBVIEW_URL_LOCAL = "http://192.168.1.35:3000/affirmationspower/";

const isLocal = true;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <WebView
          style={styles.webview}
          source={{
            uri: isLocal ? WEBVIEW_URL_LOCAL : WEBVIEW_URL_PROD,
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  webview: {
    flex: 1,
  },
});
