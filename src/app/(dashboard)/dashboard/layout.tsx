import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Map } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const initials = (session.user.name ?? "U")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link href="/dashboard/projetos" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 group-hover:bg-zinc-700 transition-colors">
                <Map className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-zinc-900 hidden sm:inline">FundaUrb</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/dashboard/projetos"
                className="text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 px-3 py-1.5 rounded-md transition-colors"
              >
                Projetos
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-zinc-800 leading-none">{session.user.name}</span>
              <span className="text-xs text-zinc-400 mt-0.5">{session.user.email}</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <Button type="submit" variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 px-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-1.5">Sair</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
