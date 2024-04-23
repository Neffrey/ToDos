import "~/styles/globals.css";

import SessionProvider from "~/components/providers/session-provider";

export const metadata = {
  title: "Neffreys Todos",
  description: "Just a quick lil todo app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}
