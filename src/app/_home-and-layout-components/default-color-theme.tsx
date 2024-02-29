"use client";

// LIBS
import { useSession } from "next-auth/react";
import { useEffect } from "react";

// UTILS
import useThemeStore from "~/components/stores/theme-store";
import { COLOR_THEMES, type ColorTheme } from "~/server/db/schema";
import { api } from "~/trpc/react";

// COMPONENTS

// COMP
const DefaultThemes = () => {
  const { data: session, update: updateSession } = useSession();

  const setColorTheme = useThemeStore((state) => state.setColorTheme);

  const editUser = api.user.edit.useMutation({
    onSuccess: async () => {
      await updateSession();
    },
  });

  useEffect(() => {
    const localColorTheme = window.localStorage.getItem("theme") as ColorTheme;

    if (session?.user) {
      // If user is authed & user.colorTheme exists & local colorTheme mismatch then set local to user.colorTheme
      if (
        session.user?.colorTheme &&
        session.user.colorTheme !== localColorTheme
      ) {
        setColorTheme(session.user.colorTheme);
      }
      // no user.colorTheme but local colorTheme exists then edit dbUser
      else if (!session.user?.colorTheme && localColorTheme) {
        editUser.mutate({ colorTheme: localColorTheme });
      }
    } else if (localColorTheme && COLOR_THEMES.includes(localColorTheme)) {
      setColorTheme(localColorTheme);
    }
  }, [setColorTheme, editUser, session?.user]);

  return null;
};

export default DefaultThemes;
