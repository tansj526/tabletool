import { lazy, useMemo } from "react";
import { AppLayout } from "../components/layout/AppLayout";

const Home = lazy(() =>
  import("../pages/Home/Home").then((module) => ({ default: module.Home }))
);
const Tool = lazy(() =>
  import("../pages/Tool").then((module) => ({ default: module.Index }))
);
const Privacy = lazy(() =>
  import("../pages/Privacy").then((module) => ({ default: module.Index }))
);

export function AppRouter() {
  const route = useMemo(() => window.location.pathname, []);

  if (route.startsWith("/privacy")) {
    return (
      <AppLayout>
        <Privacy />
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
