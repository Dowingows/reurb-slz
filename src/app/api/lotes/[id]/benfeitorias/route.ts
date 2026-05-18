import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { benfeitoriaSchema } from "@/schemas/benfeitoria.schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const benfeitoria = await prisma.benfeitoria.findUnique({ where: { loteId: id } });

  if (!benfeitoria) return NextResponse.json(null);
  return NextResponse.json(benfeitoria);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = benfeitoriaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const benfeitoria = await prisma.benfeitoria.upsert({
    where: { loteId: id },
    create: { loteId: id, ...parsed.data },
    update: parsed.data,
  });

  return NextResponse.json(benfeitoria);
}
