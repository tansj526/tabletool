import { lazy, useMemo } from "react";
import { About } from "../pages/About/About";
import { AppLayout } from "../components/layout/AppLayout";

const Home = lazy(() =>
  import("../pages/Home/Home").then((module) => ({ default: module.Home }))
);
const Tool = lazy(() =>
  import("../pages/Tool/Tool").then((module) => ({ default: module.Tool }))
);

export function AppRouter() {
  const route = useMemo(() => window.location.pathname, []);

  if (route.startsWith("/about")) {
    return (
      <AppLayout>
        <About />
      </AppLayout>
    );
  }

  if (route.startsWith("/tool")) {
    return (
      <AppLayout>
        <Tool />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}
