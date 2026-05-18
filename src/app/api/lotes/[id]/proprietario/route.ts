import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { proprietarioSchema } from "@/schemas/proprietario.schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const proprietario = await prisma.proprietario.findUnique({ where: { loteId: id } });

  if (!proprietario) return NextResponse.json(null);
  return NextResponse.json(proprietario);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = proprietarioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const proprietario = await prisma.proprietario.upsert({
    where: { loteId: id },
    create: { loteId: id, ...parsed.data },
    update: parsed.data,
  });

  return NextResponse.json(proprietario);
}
