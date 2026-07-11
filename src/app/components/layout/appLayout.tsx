import Sidebar from "./sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 bg-muted min-h-dvh md:ml-64 animate-fade-in">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
