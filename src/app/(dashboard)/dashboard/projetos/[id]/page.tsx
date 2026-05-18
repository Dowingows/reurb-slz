import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Pencil, LayoutGrid, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjetoDetalhePage({ params }: Props) {
  const { id } = await params;

  const projeto = await prisma.projetoReurb.findUnique({
    where: { id },
    include: {
      quadras: {
        include: {
          _count: { select: { lotes: true } },
          lotes: { select: { proprietario: { select: { id: true } } } },
        },
        orderBy: { nome: "asc" },
      },
    },
  });

  if (!projeto) notFound();

  const totalLotes = projeto.quadras.reduce((s, q) => s + q._count.lotes, 0);

  return (
    <div className="space-y-6">
      {/* Breadcrumb + cabeçalho */}
      <div>
        <p className="text-sm text-zinc-400 mb-1">
          <Link href="/dashboard/projetos" className="hover:text-zinc-700 transition-colors">Projetos</Link>
          <span className="mx-1.5">/</span>
          <span className="text-zinc-600">{projeto.nome}</span>
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{projeto.nome}</h1>
            <p className="text-sm text-zinc-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />{projeto.municipio} — {projeto.estado}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link href={`/dashboard/projetos/${id}/editar`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
              <Pencil className="h-3.5 w-3.5" /> Editar
            </Link>
            <Link href={`/dashboard/projetos/${id}/quadras/nova`} className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
              <Plus className="h-3.5 w-3.5" /> Nova quadra
            </Link>
          </div>
        </div>
      </div>

      {/* Stats resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Quadras", value: projeto.quadras.length },
          { label: "Lotes totais", value: totalLotes },
          {
            label: "Com proprietário",
            value: projeto.quadras.reduce((s, q) => s + q.lotes.filter(l => l.proprietario).length, 0),
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-zinc-200 p-4">
            <p className="text-2xl font-bold text-zinc-900">{value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Lista de quadras */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quadras</h2>

        {projeto.quadras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-zinc-200 border-dashed">
            <LayoutGrid className="w-8 h-8 text-zinc-300 mb-3" />
            <p className="font-medium text-zinc-600">Nenhuma quadra cadastrada</p>
            <Link href={`/dashboard/projetos/${id}/quadras/nova`} className={cn(buttonVariants({ size: "sm" }), "mt-3 gap-1.5")}>
              <Plus className="h-3.5 w-3.5" /> Nova quadra
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {projeto.quadras.map((q) => {
              const comProp = q.lotes.filter(l => l.proprietario).length;
              const total = q._count.lotes;
              const pct = total > 0 ? Math.round((comProp / total) * 100) : 0;

              return (
                <Link
                  key={q.id}
                  href={`/dashboard/projetos/${id}/quadras/${q.id}`}
                  className="group bg-white rounded-xl border border-zinc-200 p-4 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">{q.nome}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="text-sm text-zinc-500">
                    {total} lote{total !== 1 ? "s" : ""}
                  </div>

                  {total > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Proprietários</span>
                        <span>{comProp}/{total}</span>
                      </div>
                      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-900 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
