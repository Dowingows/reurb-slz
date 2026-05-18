import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string; quadraId: string }>;
}

const USO_LABEL: Record<string, string> = {
  RESIDENCIAL: "Residencial", COMERCIAL: "Comercial", MISTO: "Misto",
  INSTITUCIONAL: "Institucional", INDUSTRIAL: "Industrial", VAGO: "Vago",
};

export default async function QuadraDetalhePage({ params }: Props) {
  const { id, quadraId } = await params;

  const quadra = await prisma.quadra.findUnique({
    where: { id: quadraId },
    include: {
      projeto: true,
      lotes: {
        include: { proprietario: { select: { nome: true } } },
        orderBy: { nomeLote: "asc" },
      },
    },
  });

  if (!quadra || quadra.projetoId !== id) notFound();

  const totalLotes = quadra.lotes.length;
  const lotesComProprietario = quadra.lotes.filter((l) => l.proprietario).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard/projetos" className="hover:underline">Projetos</Link>
            {" / "}
            <Link href={`/dashboard/projetos/${id}`} className="hover:underline">{quadra.projeto.nome}</Link>
            {" / "}
            {quadra.nome}
          </p>
          <h1 className="text-2xl font-bold mt-1">{quadra.nome}</h1>
          {totalLotes > 0 && (
            <p className="text-sm text-muted-foreground">
              Progresso: {lotesComProprietario}/{totalLotes} lotes com proprietário
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/projetos/${id}/quadras/${quadraId}/editar`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Pencil className="h-4 w-4 mr-1" /> Editar
          </Link>
          <Link
            href={`/dashboard/projetos/${id}/quadras/${quadraId}/lotes/novo`}
            className={cn(buttonVariants())}
          >
            <Plus className="h-4 w-4 mr-2" /> Novo lote
          </Link>
        </div>
      </div>

      {quadra.lotes.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum lote cadastrado ainda.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Área (m²)</TableHead>
              <TableHead>Uso</TableHead>
              <TableHead>Proprietário</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {quadra.lotes.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.nomeLote}</TableCell>
                <TableCell>{l.area.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{USO_LABEL[l.usoDoLote] ?? l.usoDoLote}</Badge>
                </TableCell>
                <TableCell>
                  {l.proprietario ? (
                    <span className="text-sm">{l.proprietario.nome}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dashboard/projetos/${id}/quadras/${quadraId}/lotes/${l.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Ver
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
