import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

const CAMPOS_DOC = ["rgFrente", "rgVerso", "cpfFoto", "comprovanteResidencia", "certidaoNascimentoDivorcio"] as const;
type CampoDoc = typeof CAMPOS_DOC[number];

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const documentos = await prisma.documentoLote.findUnique({ where: { loteId: id } });

  if (!documentos) return NextResponse.json(null);
  return NextResponse.json(documentos);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  const formData = await req.formData();
  const campo = formData.get("campo") as CampoDoc;
  const file = formData.get("file") as File;

  if (!campo || !CAMPOS_DOC.includes(campo)) {
    return NextResponse.json({ error: "Campo inválido" }, { status: 422 });
  }
  if (!file) {
    return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 422 });
  }

  const ext = file.name.split(".").pop();
  const path = `lotes/${id}/${campo}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from("projetos")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const documentos = await prisma.documentoLote.upsert({
    where: { loteId: id },
    create: { loteId: id, [campo]: path },
    update: { [campo]: path },
  });

  return NextResponse.json(documentos);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const campo = searchParams.get("campo") as CampoDoc;

  if (!campo || !CAMPOS_DOC.includes(campo)) {
    return NextResponse.json({ error: "Campo inválido" }, { status: 422 });
  }

  const docAtual = await prisma.documentoLote.findUnique({ where: { loteId: id } });
  if (docAtual?.[campo]) {
    await supabase.storage.from("projetos").remove([docAtual[campo] as string]);
  }

  const documentos = await prisma.documentoLote.upsert({
    where: { loteId: id },
    create: { loteId: id },
    update: { [campo]: null },
  });

  return NextResponse.json(documentos);
}
