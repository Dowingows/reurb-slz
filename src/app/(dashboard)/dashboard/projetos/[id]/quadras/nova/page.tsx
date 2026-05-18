"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const quadraSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});
type QuadraInput = z.infer<typeof quadraSchema>;

export default function NovaQuadraPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<QuadraInput>({
    resolver: zodResolver(quadraSchema),
  });

  async function onSubmit(data: QuadraInput) {
    const res = await fetch(`/api/projetos/${id}/quadras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Erro ao criar quadra");
      return;
    }

    toast.success("Quadra criada com sucesso!");
    router.push(`/dashboard/projetos/${id}`);
    router.refresh();
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Nova Quadra</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="nome">Nome *</Label>
          <Input id="nome" placeholder="Ex: QUADRA A" {...register("nome")} />
          {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Criar quadra"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
