import "./globals.css";

export const metadata = {
  title: "ÉtudiPlan",
  description: "Application de gestion de la vie étudiante",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}