import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LoteTabs } from "@/components/lotes/LoteTabs";

interface Props {
  params: Promise<{ id: string; quadraId: string; loteId: string }>;
}

export default async function LoteDetalhePage({ params }: Props) {
  const { id, quadraId, loteId } = await params;

  const lote = await prisma.lote.findUnique({
    where: { id: loteId },
    include: {
      quadra: { include: { projeto: true } },
      proprietario: true,
      documentos: true,
      benfeitorias: true,
      criadoPor: { select: { nome: true } },
    },
  });

  if (!lote || lote.quadraId !== quadraId) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          <Link href="/dashboard/projetos" className="hover:underline">Projetos</Link>
          {" / "}
          <Link href={`/dashboard/projetos/${id}`} className="hover:underline">{lote.quadra.projeto.nome}</Link>
          {" / "}
          <Link href={`/dashboard/projetos/${id}/quadras/${quadraId}`} className="hover:underline">{lote.quadra.nome}</Link>
          {" / "}
          {lote.nomeLote}
        </p>
        <h1 className="text-2xl font-bold mt-1">Lote {lote.nomeLote}</h1>
        <p className="text-sm text-muted-foreground">
          Criado por {lote.criadoPor.nome}
        </p>
      </div>

      <LoteTabs lote={lote} projetoId={id} quadraId={quadraId} />
    </div>
  );
}
