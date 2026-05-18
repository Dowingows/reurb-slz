import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Plus, MapPin, FileText, ChevronRight, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ProjetosPage() {
  const projetos = await prisma.projetoReurb.findMany({
    include: { _count: { select: { quadras: true, documentos: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Projetos</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {projetos.length} projeto{projetos.length !== 1 ? "s" : ""} cadastrado{projetos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/projetos/novo" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="h-4 w-4" /> Novo projeto
        </Link>
      </div>

      {projetos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="font-medium text-zinc-700">Nenhum projeto cadastrado</p>
          <p className="text-sm text-zinc-400 mt-1">Crie o primeiro projeto para começar</p>
          <Link href="/dashboard/projetos/novo" className={cn(buttonVariants(), "mt-4 gap-2")}>
            <Plus className="h-4 w-4" /> Novo projeto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projetos.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projetos/${p.id}`}
              className="group bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 hover:shadow-md transition-all duration-200 flex flex-col gap-4"
            >
              {/* Header do card */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
              </div>

              {/* Nome e localização */}
              <div className="space-y-1 flex-1">
                <h2 className="font-semibold text-zinc-900 leading-tight line-clamp-2">{p.nome}</h2>
                <p className="text-sm text-zinc-500">{p.municipio} — {p.estado}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-1 border-t border-zinc-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  <span className="text-sm font-medium text-zinc-700">{p._count.quadras}</span>
                  <span className="text-xs text-zinc-400">quadra{p._count.quadras !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-700">{p._count.documentos}</span>
                  <span className="text-xs text-zinc-400">doc{p._count.documentos !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
