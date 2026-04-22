import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjetoForm } from "@/components/projetos/ProjetoForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProjetoPage({ params }: Props) {
  const { id } = await params;

  const projeto = await prisma.projetoReurb.findUnique({
    where: { id },
    include: { documentos: true },
  });

  if (!projeto) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar Projeto</h1>
      <ProjetoForm
        defaultValues={{
          id: projeto.id,
          nome: projeto.nome,
          estado: projeto.estado,
          municipio: projeto.municipio,
          documentos: projeto.documentos,
        }}
      />
    </div>
  );
}
