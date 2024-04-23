import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { eq } from "drizzle-orm";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";
import { createTable } from "~/server/db/schema";
import { users } from "~/server/db/schema";
import type { ColorTheme, LdTheme, UserRole } from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: UserRole | null;
      colorTheme?: ColorTheme | null;
      ldTheme?: LdTheme | null;
      showCompletedTasksDefault?: boolean | null;
    } & DefaultSession["user"];
  }

  export interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole | null;
    colorTheme?: ColorTheme | null;
    ldTheme?: LdTheme | null;
    showCompletedTasksDefault?: boolean | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      let dbUser;

      if (!user.colorTheme || !user.role || !user.showCompletedTasksDefault) {
        dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,

          role: session.user?.role
            ? session.user.role
            : dbUser?.role
              ? dbUser.role
              : null,

          colorTheme: session?.user?.colorTheme
            ? session.user.colorTheme
            : dbUser?.colorTheme
              ? dbUser.colorTheme
              : null,

          ldTheme: session?.user?.colorTheme
            ? session.user.colorTheme
            : dbUser?.colorTheme
              ? dbUser.colorTheme
              : null,

          showCompletedTasksDefault: session?.user?.showCompletedTasksDefault
            ? session.user.showCompletedTasksDefault
            : dbUser?.showCompletedTasksDefault
              ? dbUser.showCompletedTasksDefault
              : null,
        },
      };
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID ? env.GOOGLE_ID : "",
      clientSecret: env.GOOGLE_SECRET ? env.GOOGLE_SECRET : "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
