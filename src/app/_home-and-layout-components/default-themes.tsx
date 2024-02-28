"use client";

// LIBS
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

// UTILS
import useMediaQuery from "~/components/hooks/use-media-query";
import useThemeStore from "~/components/stores/theme-store";
import {
  COLOR_THEMES,
  ldThemes,
  type ColorTheme,
  type LdTheme,
} from "~/server/db/schema";
import { api } from "~/trpc/react";

// COMPONENTS

// COMP
const DefaultThemes = () => {
  const { data: session, update: updateSession } = useSession();
  const localColorTheme = window.localStorage.getItem("theme");
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const colorTheme = useThemeStore((state) => state.colorTheme);
  const setColorTheme = useThemeStore((state) => state.setColorTheme);

  const { theme: ldTheme, setTheme: setLdTheme } = useTheme();

  const editUser = api.user.edit.useMutation({
    onSuccess: async () => {
      await updateSession();
    },
  });

  // LdTheme
  if (session?.user?.ldTheme && session.user.ldTheme !== ldTheme) {
    setLdTheme(session.user.ldTheme);
  }
  if (session?.user && !session.user.ldTheme) {
    if (ldTheme && ldThemes.includes(ldTheme as LdTheme)) {
      editUser.mutate({ ldTheme });
    } else {
      if (systemPrefersDark) {
        setLdTheme("dark");
      } else {
        setLdTheme("light");
      }
    }
  }

  // ColorTheme
  if (session?.user?.colorTheme && session.user.colorTheme !== colorTheme) {
    setColorTheme(session.user.colorTheme);
  }
  if (session?.user && !session.user.colorTheme) {
    if (
      localColorTheme &&
      COLOR_THEMES.includes(localColorTheme as ColorTheme)
    ) {
      setColorTheme(localColorTheme as ColorTheme);
      editUser.mutate({ colorTheme: localColorTheme as ColorTheme });
    } else {
      setColorTheme(colorTheme);
      editUser.mutate({ colorTheme });
    }
  }
  return null;
};

export default DefaultThemes;
