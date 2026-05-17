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
  const quadra = await prisma.quadra.findUnique({
    where: { id },
    include: { _count: { select: { lotes: true } }, projeto: true },
  });

  if (!quadra) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  return NextResponse.json(quadra);
}

export async function PUT(req: NextRequest, { params }: Params) {
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

  const quadra = await prisma.quadra.update({ where: { id }, data: parsed.data });
  return NextResponse.json(quadra);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || !["SUPERVISOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.quadra.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
