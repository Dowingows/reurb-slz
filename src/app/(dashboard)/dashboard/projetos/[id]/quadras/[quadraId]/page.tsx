import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Pencil, Home, ChevronRight, User, FileText, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string; quadraId: string }>;
}

const USO_LABEL: Record<string, string> = {
  RESIDENCIAL: "Residencial", COMERCIAL: "Comercial", MISTO: "Misto",
  INSTITUCIONAL: "Institucional", INDUSTRIAL: "Industrial", VAGO: "Vago",
};

const USO_COLOR: Record<string, string> = {
  RESIDENCIAL: "bg-blue-50 text-blue-700",
  COMERCIAL: "bg-amber-50 text-amber-700",
  MISTO: "bg-purple-50 text-purple-700",
  INSTITUCIONAL: "bg-emerald-50 text-emerald-700",
  INDUSTRIAL: "bg-orange-50 text-orange-700",
  VAGO: "bg-zinc-100 text-zinc-500",
};

export default async function QuadraDetalhePage({ params }: Props) {
  const { id, quadraId } = await params;

  const quadra = await prisma.quadra.findUnique({
    where: { id: quadraId },
    include: {
      projeto: true,
      lotes: {
        include: {
          proprietario: { select: { nome: true } },
          documentos: { select: { id: true } },
          benfeitorias: { select: { id: true } },
        },
        orderBy: { nomeLote: "asc" },
      },
    },
  });

  if (!quadra || quadra.projetoId !== id) notFound();

  const totalLotes = quadra.lotes.length;
  const comProp = quadra.lotes.filter((l) => l.proprietario).length;
  const pct = totalLotes > 0 ? Math.round((comProp / totalLotes) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + cabeçalho */}
      <div>
        <p className="text-sm text-zinc-400 mb-1">
          <Link href="/dashboard/projetos" className="hover:text-zinc-700 transition-colors">Projetos</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/dashboard/projetos/${id}`} className="hover:text-zinc-700 transition-colors">{quadra.projeto.nome}</Link>
          <span className="mx-1.5">/</span>
          <span className="text-zinc-600">{quadra.nome}</span>
        </p>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-900">{quadra.nome}</h1>
          <div className="flex gap-2 flex-shrink-0">
            <Link href={`/dashboard/projetos/${id}/quadras/${quadraId}/editar`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
              <Pencil className="h-3.5 w-3.5" /> Editar
            </Link>
            <Link href={`/dashboard/projetos/${id}/quadras/${quadraId}/lotes/novo`} className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
              <Plus className="h-3.5 w-3.5" /> Novo lote
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de progresso geral */}
      {totalLotes > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700">Cadastros com proprietário</span>
            <span className="text-zinc-500">{comProp} de {totalLotes} lotes · {pct}%</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Lista de lotes */}
      {quadra.lotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-zinc-200 border-dashed">
          <Home className="w-8 h-8 text-zinc-300 mb-3" />
          <p className="font-medium text-zinc-600">Nenhum lote cadastrado</p>
          <Link href={`/dashboard/projetos/${id}/quadras/${quadraId}/lotes/novo`} className={cn(buttonVariants({ size: "sm" }), "mt-3 gap-1.5")}>
            <Plus className="h-3.5 w-3.5" /> Novo lote
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quadra.lotes.map((l) => {
            const checks = [!!l.proprietario, !!l.documentos, !!l.benfeitorias];
            const done = checks.filter(Boolean).length;

            return (
              <Link
                key={l.id}
                href={`/dashboard/projetos/${id}/quadras/${quadraId}/lotes/${l.id}`}
                className="group bg-white rounded-xl border border-zinc-200 p-4 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col gap-3"
              >
                {/* Topo: número + uso */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <Home className="w-4 h-4 text-zinc-500" />
                    </div>
                    <span className="font-semibold text-zinc-900">Lote {l.nomeLote}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Endereço */}
                <p className="text-sm text-zinc-500 truncate">{l.rua}, {l.numero}</p>

                {/* Tag uso + área */}
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", USO_COLOR[l.usoDoLote] ?? "bg-zinc-100 text-zinc-500")}>
                    {USO_LABEL[l.usoDoLote] ?? l.usoDoLote}
                  </span>
                  <span className="text-xs text-zinc-400">{l.area.toFixed(0)} m²</span>
                </div>

                {/* Indicadores de completude */}
                <div className="flex items-center gap-3 pt-1 border-t border-zinc-100">
                  {[
                    { icon: User, label: "Prop.", done: !!l.proprietario },
                    { icon: FileText, label: "Docs", done: !!l.documentos },
                    { icon: Wrench, label: "Benf.", done: !!l.benfeitorias },
                  ].map(({ icon: Icon, label, done: d }) => (
                    <div key={label} className={cn("flex items-center gap-1 text-xs", d ? "text-emerald-600" : "text-zinc-300")}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </div>
                  ))}
                  <span className="ml-auto text-xs text-zinc-400">{done}/3</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
