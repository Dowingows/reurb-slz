import { z } from "zod";

export const proprietarioSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  nomeSocial: z.string().optional(),
  cpf: z.string().min(11, "CPF inválido").max(14),
  rg: z.string().max(14).optional(),
  nis: z.string().max(11).optional(),
  cnpj: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  celular: z.string().min(1, "Celular é obrigatório"),
  celular2: z.string().optional(),
  filiacaoMaterna: z.string().optional(),
  filiacaoPaterna: z.string().optional(),
  estadoCivil: z.enum(["SOLTEIRO", "CASADO", "UNIAO_ESTAVEL", "DIVORCIADO", "VIUVO"]),
  profissao: z.string().min(1, "Profissão é obrigatória"),
  rendaIndividualMensal: z.coerce.number({ required_error: "Renda individual é obrigatória" }),
  rendaFamiliarMensal: z.coerce.number({ required_error: "Renda familiar é obrigatória" }),
  recebeBolsaFamilia: z.boolean(),
  recebeBPC: z.boolean(),
  isPCD: z.boolean(),
  temPCDNaMoradia: z.boolean(),
  observacoes: z.string().optional(),
});

export type ProprietarioInput = z.infer<typeof proprietarioSchema>;
