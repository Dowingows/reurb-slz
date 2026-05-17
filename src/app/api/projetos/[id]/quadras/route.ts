import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const quadraSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  foto: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const quadras = await prisma.quadra.findMany({
    where: { projetoId: id },
    include: { _count: { select: { lotes: true } } },
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(quadras);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || !["SUPERVISOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = quadraSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const projeto = await prisma.projetoReurb.findUnique({ where: { id } });
  if (!projeto) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });

  const quadra = await prisma.quadra.create({
    data: { ...parsed.data, projetoId: id },
  });

  return NextResponse.json(quadra, { status: 201 });
}
