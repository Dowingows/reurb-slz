import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Eye } from "lucide-react";
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
        include: { _count: { select: { lotes: true } } },
        orderBy: { nome: "asc" },
      },
    },
  });

  if (!projeto) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard/projetos" className="hover:underline">Projetos</Link>
            {" / "}
            {projeto.nome}
          </p>
          <h1 className="text-2xl font-bold mt-1">{projeto.nome}</h1>
          <p className="text-muted-foreground text-sm">{projeto.estado} — {projeto.municipio}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/projetos/${id}/editar`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Pencil className="h-4 w-4 mr-1" /> Editar
          </Link>
          <Link
            href={`/dashboard/projetos/${id}/quadras/nova`}
            className={cn(buttonVariants())}
          >
            <Plus className="h-4 w-4 mr-2" /> Nova quadra
          </Link>
        </div>
      </div>

      {projeto.quadras.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhuma quadra cadastrada ainda.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Lotes</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projeto.quadras.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.nome}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{q._count.lotes}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dashboard/projetos/${id}/quadras/${q.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Ver lotes
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
