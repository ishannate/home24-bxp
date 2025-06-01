import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css";
import { useAuthStore } from "./store/useAuthStore.ts";
import "./index.css"

const InitAuth = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const hydrated = useAuthStore((state) => state.hydrated)

  useEffect(() => {
    initialize();
  }, [initialize]);

   if (!hydrated) return null

  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InitAuth />
  </StrictMode>
);
