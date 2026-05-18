import { z } from "zod";

export const benfeitoriaSchema = z.object({
  estabilidadeEstrutura: z.enum(["BOA", "REGULAR", "RUIM", "PESSIMA"]).optional(),
  necessidadeReconstrucao: z.enum(["NAO", "PARCIAL", "TOTAL"]).optional(),
  numeroComodos: z.coerce.number().int().optional(),
  numeroMoradoresPorComodo: z.coerce.number().int().optional(),
  numeroBanheiros: z.coerce.number().int().optional(),
  condicoesBanheiros: z.enum(["BOM", "REGULAR", "RUIM"]).optional(),
  materialParedesExternas: z.enum(["ALVENARIA", "MADEIRA", "MISTO", "TAIPA", "METALICO", "OUTROS"]).optional(),
  condicoesParedesExternas: z.enum(["BOA", "REGULAR", "RUIM"]).optional(),
  cobertura: z.enum(["LAJE", "TELHA_CERAMICA", "TELHA_FIBROCIMENTO", "TELHA_METALICA", "PALHA", "OUTROS"]).optional(),
  instalacoesEletricas: z.array(z.string()),
  condicoesInstalacoesEletricas: z.enum(["BOA", "REGULAR", "RUIM", "AUSENTE"]).optional(),
  instalacoesHidrossanitarias: z.array(z.string()),
  condicoesInstalacoesHidrossanitarias: z.enum(["BOA", "REGULAR", "RUIM", "AUSENTE"]).optional(),
  esgotamentoSanitario: z.array(z.string()),
  condicoesEsgotamentoSanitario: z.enum(["BOA", "REGULAR", "RUIM", "AUSENTE"]).optional(),
});

export type BenfeitoriaInput = z.infer<typeof benfeitoriaSchema>;
