import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Problems from "./components/Problems";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Game from "./game/Game";
import Learn from "./learn/Learn";
import LearnGame from "./learn/LearnGame";
import Textbook from "./learn/Textbook";
import Profile from "./profile/Profile";
import AuthPage from "./auth/AuthPage";
import { useAuth } from "./auth/session";
import RegisterBanner from "./auth/RegisterBanner";
import ZoomControls from "./components/ZoomControls";

type Route = "home" | "game" | "learn" | "learnGame" | "textbook" | "profile" | "auth";

function useHashRoute() {
  const read = (): Route => {
    const h = window.location.hash;
    if (h.startsWith("#/game")) return "game";
    if (h.startsWith("#/learn/")) return "learnGame";
    if (h.startsWith("#/textbook")) return "textbook";
    if (h.startsWith("#/learn")) return "learn";
    if (h.startsWith("#/profile")) return "profile";
    if (h.startsWith("#/auth")) return "auth";
    return "home";
  };
  const [route, setRoute] = useState<Route>(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

// Профиль открывается только после входа. Гостю показываем регистрацию/вход с объяснением.
function ProfileGate() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) {
    return (
      <AuthPage reason="Чтобы открыть профиль и сохранять прогресс, зарегистрируйся или войди в аккаунт" />
    );
  }
  return <Profile />;
}

export default function App() {
  const route = useHashRoute();
  if (route === "game") return <Game />;
  if (route === "learn") return <Learn />;
  if (route === "learnGame") {
    const id = window.location.hash.replace(/^#\/learn\//, "").split(/[?#/]/)[0];
    return <LearnGame key={id} gameId={id} />;
  }
  if (route === "textbook") return <Textbook />;
  if (route === "auth") return <AuthPage />;
  if (route === "profile") return <ProfileGate />;
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="px-4 sm:px-6">
          <RegisterBanner />
        </div>
        <Problems />
        <HowItWorks />
        <Pricing />
        <Faq />
      </main>
      <Footer />
      <ZoomControls />
    </>
  );
}
