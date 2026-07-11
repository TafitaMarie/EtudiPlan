import "./globals.css";
import { ThemeProvider } from "./contexts/themeProvider";
import { ToastProvider } from "./contexts/toastProvider";

export const metadata = {
  title: "ÉtudiPlan",
  description: "Application de gestion de la vie étudiante",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              var theme = localStorage.getItem("theme");
              if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                document.documentElement.classList.add("dark");
              }
            } catch(e) {}
          `,
        }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
