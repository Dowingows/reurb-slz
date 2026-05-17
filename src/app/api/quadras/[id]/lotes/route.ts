import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loteSchema } from "@/schemas/lote.schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const lotes = await prisma.lote.findMany({
    where: { quadraId: id },
    include: {
      proprietario: { select: { nome: true, cpf: true } },
    },
    orderBy: { nomeLote: "asc" },
  });

  return NextResponse.json(lotes);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = loteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const quadra = await prisma.quadra.findUnique({ where: { id } });
  if (!quadra) return NextResponse.json({ error: "Quadra não encontrada" }, { status: 404 });

  const lote = await prisma.lote.create({
    data: {
      ...parsed.data,
      quadraId: id,
      criadoPorId: session.user.id,
    },
  });

  return NextResponse.json(lote, { status: 201 });
}
