"use client";

import { useEffect } from "react";
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

export default function EditarQuadraPage() {
  const router = useRouter();
  const { id, quadraId } = useParams<{ id: string; quadraId: string }>();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<QuadraInput>({
    resolver: zodResolver(quadraSchema),
  });

  useEffect(() => {
    fetch(`/api/quadras/${quadraId}`)
      .then((r) => r.json())
      .then((data) => reset({ nome: data.nome }));
  }, [quadraId, reset]);

  async function onSubmit(data: QuadraInput) {
    const res = await fetch(`/api/quadras/${quadraId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Erro ao salvar quadra");
      return;
    }

    toast.success("Quadra atualizada!");
    router.push(`/dashboard/projetos/${id}`);
    router.refresh();
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Editar Quadra</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="nome">Nome *</Label>
          <Input id="nome" placeholder="Ex: QUADRA A" {...register("nome")} />
          {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
