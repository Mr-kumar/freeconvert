import { Navbar } from "@/components/Navbar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(var(--muted))]/30">
      <Navbar showLogoIcon={false} />
      <main>{children}</main>
    </div>
  );
}
