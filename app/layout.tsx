import type { Metadata } from "next";
import { Providers } from "./providers/app-providers";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to AFeed RSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
