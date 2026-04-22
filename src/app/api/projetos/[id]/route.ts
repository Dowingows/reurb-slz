import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projetoSchema } from "@/schemas/projeto.schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const projeto = await prisma.projetoReurb.findUnique({
    where: { id },
    include: { documentos: true, _count: { select: { campanhas: true } } },
  });

  if (!projeto) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(projeto);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || !["SUPERVISOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = projetoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const projeto = await prisma.projetoReurb.update({ where: { id }, data: parsed.data });
  return NextResponse.json(projeto);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.projetoReurb.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
