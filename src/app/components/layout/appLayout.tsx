import Sidebar from "./sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-slate-50 p-6 md:ml-0 pt-16 md:pt-6">
        {children}
      </main>
    </div>
  );
}