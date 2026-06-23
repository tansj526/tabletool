"use client";

import type { ReactNode } from "react";
import "../../locales/i18n";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <>{children}</>;
}
