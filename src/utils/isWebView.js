export const iswebview = () => {
  const ua = navigator.userAgent || "";

  // ✅ Detect React Native WebView correctly
  // React Native WebView usually contains "wv" (Android) or "ReactNative"
  const isRNWebView =
    ua.includes("ReactNative") ||
    ua.includes("wv") ||
    ua.includes("WebView");

  return isRNWebView;
};
