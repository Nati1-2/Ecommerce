"use client";

import { useEffect, useLayoutEffect } from "react";
import { useTheme } from "next-themes";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * ForceLightMode component
 * Strictly locks the page to light mode:
 * 1. Executes inline script immediately during HTML parsing before paint
 * 2. Removes .dark and adds .light in layout effect
 * 3. Enforces light theme in next-themes state
 */
export default function ForceLightMode() {
  const { setTheme, theme } = useTheme();

  useIsomorphicLayoutEffect(() => {
    try {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.style.colorScheme = "light";
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.style.colorScheme = "light";
      }
      if (theme !== "light") {
        setTheme("light");
      }
    } catch {
      // ignore
    }
  }, [setTheme, theme]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}catch(e){}`,
      }}
    />
  );
}
