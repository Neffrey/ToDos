"use client";

// LIBS
import { useSession } from "next-auth/react";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

// UTILS
import { type LdTheme, ldThemes } from "~/server/db/schema";
import { api } from "~/trpc/react";

// CONSTS
const DEFAULT_LD_THEME = ldThemes[1];

const LightDarkProvider = ({ children }: ThemeProviderProps) => {
  const { data: session, update: updateSession } = useSession();
  const editUser = api.user.edit.useMutation({
    onSuccess: async () => {
      await updateSession();
    },
  });

  // set default LD theme
  React.useEffect(() => {
    const localLdTheme = window.localStorage.getItem("ld-theme");
    if (localLdTheme === null || !ldThemes.includes(localLdTheme as LdTheme)) {
      window.localStorage.setItem("ld-theme", DEFAULT_LD_THEME);

      if (
        session?.user &&
        !session.user?.ldTheme &&
        ldThemes.includes(localLdTheme as LdTheme)
      ) {
        editUser.mutate({ ldTheme: localLdTheme as LdTheme });
      }
    }
  }, [editUser, session?.user]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_LD_THEME}
      storageKey="ld-theme"
    >
      {children}
    </NextThemesProvider>
  );
};

export default LightDarkProvider;
