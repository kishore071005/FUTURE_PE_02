import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="blob blob-violet w-[600px] h-[600px] -top-40 -left-40 pulse-glow" />
      <div className="blob blob-pink w-[500px] h-[500px] top-1/2 -right-40 pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="blob blob-cyan w-[400px] h-[400px] -bottom-20 left-1/3 pulse-glow" style={{ animationDelay: '4s' }} />

      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10 dot-grid">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
