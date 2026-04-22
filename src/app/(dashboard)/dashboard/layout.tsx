import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <span className="font-bold text-lg">REURB</span>
          <Link href="/dashboard/projetos" className="text-sm hover:underline">Projetos</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{session.user.name}</span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <Button type="submit" variant="ghost" size="sm">Sair</Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
