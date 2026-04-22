import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import type { TipoDocumentoProjeto } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || !["SUPERVISOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const projeto = await prisma.projetoReurb.findUnique({ where: { id } });
  if (!projeto) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const tipo = formData.get("tipo") as TipoDocumentoProjeto;

  if (!file || !tipo) {
    return NextResponse.json({ error: "Arquivo e tipo são obrigatórios" }, { status: 422 });
  }

  const ext = file.name.split(".").pop();
  const path = `projetos/${id}/${tipo}_${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("projetos")
    .upload(path, file, { upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const documento = await prisma.documentoProjetoReurb.create({
    data: {
      projetoId: id,
      tipo,
      supabasePath: path,
      nomeOriginal: file.name,
      tamanhoBytes: file.size,
    },
  });

  return NextResponse.json(documento, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || !["SUPERVISOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { documentoId } = await req.json();

  const doc = await prisma.documentoProjetoReurb.findFirst({
    where: { id: documentoId, projetoId: id },
  });
  if (!doc) return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });

  await supabase.storage.from("projetos").remove([doc.supabasePath]);
  await prisma.documentoProjetoReurb.delete({ where: { id: documentoId } });

  return NextResponse.json({ ok: true });
}
