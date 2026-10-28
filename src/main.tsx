import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initAuth, onUserChange } from "./auth/session";
import { loadProfileFromCloud } from "./profile/profileStore";
import { applyTheme, getTheme } from "./lib/theme";
import { applyLang, getLang } from "./lib/i18n";
import { initZoom } from "./lib/zoom";

applyTheme(getTheme());
applyLang(getLang());
initZoom();

initAuth();
// Профиль подгружается при каждом изменении пользователя: гость получает пустой профиль, аккаунт — свой.
onUserChange((user) => {
  void loadProfileFromCloud({ name: user?.user_metadata?.display_name, email: user?.email ?? undefined });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
