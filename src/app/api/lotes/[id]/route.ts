import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loteSchema } from "@/schemas/lote.schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const lote = await prisma.lote.findUnique({
    where: { id },
    include: {
      quadra: { include: { projeto: true } },
      proprietario: true,
      documentos: true,
      benfeitorias: true,
      criadoPor: { select: { nome: true, email: true } },
    },
  });

  if (!lote) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(lote);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = loteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const lote = await prisma.lote.update({ where: { id }, data: parsed.data });
  return NextResponse.json(lote);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || !["SUPERVISOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.lote.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
