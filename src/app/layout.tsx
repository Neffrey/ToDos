import "~/styles/globals.css";

// LIBRARIES
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { type ReactNode } from "react";
import { extractRouterConfig } from "uploadthing/server";

// UTILS
import { ourFileRouter } from "~/app/api/uploadthing/core";
import { TRPCReactProvider } from "~/trpc/react";

// COMPONENTS
import Footer from "~/app/_home-and-layout-components/footer";
import Header from "~/app/_home-and-layout-components/header";
import HtmlWrapper from "~/app/_home-and-layout-components/html-wrapper";
import UseOnRender from "~/components/hooks/use-on-render";
import LightDarkProvider from "~/components/providers/light-dark-provider";
import SessionProvider from "~/components/providers/session-provider";
import LoadingSpinner from "~/components/ui/loading-spinner";
import { Toaster } from "~/components/ui/toaster";
import DefaultColorTheme from "./_home-and-layout-components/default-color-theme";

export const metadata = {
  title: "Neffreys Todos",
  description: "Just a quick lil todo app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <HtmlWrapper>
        <body className="custom-scrollbar">
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <TRPCReactProvider>
            <LightDarkProvider>
              <DefaultColorTheme />
              <UseOnRender
                fallback={
                  <div className="absolute flex h-full w-full flex-col items-center justify-center gap-10 bg-cyan-800 text-slate-50">
                    <LoadingSpinner className="h-20 w-20" />
                    <h3 className="text-xl">Loading...</h3>
                  </div>
                }
              >
                <Header />
                <main className="flex min-h-screen w-full flex-col">
                  {children}
                </main>
                <Toaster />
                <Footer />
              </UseOnRender>
            </LightDarkProvider>
          </TRPCReactProvider>
        </body>
      </HtmlWrapper>
    </SessionProvider>
  );
};

export default RootLayout;
