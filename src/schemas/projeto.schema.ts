import { z } from "zod";

export const projetoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  estado: z.string().min(2, "Selecione um estado"),
  municipio: z.string().min(2, "Selecione uma cidade"),
});

export type ProjetoFormData = z.infer<typeof projetoSchema>;
