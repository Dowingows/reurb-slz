import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ProjetosPage() {
  const projetos = await prisma.projetoReurb.findMany({
    include: { _count: { select: { quadras: true, documentos: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projetos REURB</h1>
        <Link href="/dashboard/projetos/novo" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4 mr-2" /> Novo projeto
        </Link>
      </div>

      {projetos.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum projeto cadastrado ainda.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Estado / Cidade</TableHead>
              <TableHead>Quadras</TableHead>
              <TableHead>Documentos</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projetos.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.nome}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{p.estado}</span>
                  {" — "}
                  {p.municipio}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{p._count.quadras}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{p._count.documentos}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dashboard/projetos/${p.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    Ver
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
