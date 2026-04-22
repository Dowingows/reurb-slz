import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projetoSchema } from "@/schemas/projeto.schema";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const projetos = await prisma.projetoReurb.findMany({
    include: { documentos: true, _count: { select: { campanhas: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(projetos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !["SUPERVISOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = projetoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const projeto = await prisma.projetoReurb.create({ data: parsed.data });
  return NextResponse.json(projeto, { status: 201 });
}
