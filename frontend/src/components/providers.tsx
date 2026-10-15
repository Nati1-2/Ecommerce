"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import VisitorTracker from "@/components/analytics/VisitorTracker";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const pathname = usePathname();
  const isDashboardRoute =
    !!pathname &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/vendor") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/account") ||
      pathname.startsWith("/profile"));

  useEffect(() => {
    if (isDashboardRoute && typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = "light";
    }
  }, [isDashboardRoute, pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme={isDashboardRoute ? "light" : undefined}
        enableSystem={false}
        disableTransitionOnChange
      >
        <VisitorTracker />
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
