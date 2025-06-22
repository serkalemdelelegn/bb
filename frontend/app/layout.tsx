// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper"; // Relative path
import Provider from "@/utils/Providers";
import ToastProvider from "@/utils/ToastProvider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Commodity Distribution System",
  description: "Role-based admin dashboard for commodity distribution",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
        <ToastProvider>
          <Provider>
            <ClientWrapper>{children}</ClientWrapper>
          </Provider>
        </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
