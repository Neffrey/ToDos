"use client";

// LIBRARIES
import { useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { themeChange } from "theme-change";

// COMPONENTS
import useThemeStore from "~/components/stores/theme-store";

type Props = {
  children: ReactNode;
};

const HtmlWrapper = ({ children }: Props) => {
  // Color Mode
  const colorTheme = useThemeStore((state) => state.colorTheme);
  const { theme: LdTheme } = useTheme();

  // No SSR for themeChange
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme={colorTheme}
      className={LdTheme}
    >
      {children}
    </html>
  );
};
export default HtmlWrapper;
