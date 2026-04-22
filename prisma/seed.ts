import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const senha = await hash("senha123", 12);

  await prisma.user.upsert({
    where: { email: "admin@reurb.dev" },
    update: {},
    create: { nome: "Admin", email: "admin@reurb.dev", senha, role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "supervisor@reurb.dev" },
    update: {},
    create: { nome: "Supervisor", email: "supervisor@reurb.dev", senha, role: "SUPERVISOR" },
  });

  await prisma.user.upsert({
    where: { email: "agente@reurb.dev" },
    update: {},
    create: { nome: "Agente", email: "agente@reurb.dev", senha, role: "CADASTRADOR" },
  });

  console.log("Seed concluído: admin, supervisor e agente criados.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
