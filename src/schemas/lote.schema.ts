import { z } from "zod";

export const loteSchema = z.object({
  nomeLote: z.string().min(1, "Nome do lote é obrigatório"),
  numeroSelagem: z.string().optional(),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  area: z.coerce.number({ required_error: "Área é obrigatória" }),
  areaDaEdificacao: z.coerce.number({ required_error: "Área da edificação é obrigatória" }),
  inscricaoImobiliaria: z.string().optional(),
  usoDoLote: z.enum(["RESIDENCIAL", "COMERCIAL", "MISTO", "INSTITUCIONAL", "INDUSTRIAL", "VAGO"]),
  tipoDeConstrucao: z.enum(["ALVENARIA", "MADEIRA", "MISTA", "METALICA", "OUTROS"]),
  tipoDeUso: z.enum(["PROPRIO", "ALUGADO", "CEDIDO", "OCUPADO", "OUTROS"]),
  direitoReal: z.enum(["CONCESSAO_USO", "CONCESSAO_REAL_USO", "LEGITIMACAO_FUNDIARIA", "USUCAPIAO", "OUTROS"]),
  observacao: z.string().optional(),
});

export type LoteInput = z.infer<typeof loteSchema>;
