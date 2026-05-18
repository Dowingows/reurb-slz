"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loteSchema, type LoteInput } from "@/schemas/lote.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";

export default function NovoLotePage() {
  const router = useRouter();
  const { id, quadraId } = useParams<{ id: string; quadraId: string }>();

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<LoteInput>({
    resolver: zodResolver(loteSchema),
    defaultValues: { area: 0, areaDaEdificacao: 0 },
  });

  async function onSubmit(data: LoteInput) {
    const res = await fetch(`/api/quadras/${quadraId}/lotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(`Erro ao criar lote: ${body?.error ? JSON.stringify(body.error) : res.statusText}`);
      return;
    }

    const lote = await res.json();
    toast.success("Lote criado com sucesso!");
    router.push(`/dashboard/projetos/${id}/quadras/${quadraId}/lotes/${lote.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Novo Lote</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label htmlFor="nomeLote">Nome do lote *</Label>
            <Input id="nomeLote" placeholder="Ex: 001" {...register("nomeLote")} />
            {errors.nomeLote && <p className="text-sm text-destructive">{errors.nomeLote.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="numeroSelagem">Número de selagem</Label>
            <Input id="numeroSelagem" {...register("numeroSelagem")} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="inscricaoImobiliaria">Inscrição imobiliária</Label>
            <Input id="inscricaoImobiliaria" {...register("inscricaoImobiliaria")} />
          </div>

          <div className="col-span-2 space-y-1">
            <Label htmlFor="rua">Rua *</Label>
            <Input id="rua" placeholder="Rua" {...register("rua")} />
            {errors.rua && <p className="text-sm text-destructive">{errors.rua.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="numero">Número *</Label>
            <Input id="numero" {...register("numero")} />
            {errors.numero && <p className="text-sm text-destructive">{errors.numero.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="complemento">Complemento</Label>
            <Input id="complemento" {...register("complemento")} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="area">Área (m²) *</Label>
            <Input id="area" type="number" step="0.01" {...register("area")} />
            {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="areaDaEdificacao">Área da edificação (m²) *</Label>
            <Input id="areaDaEdificacao" type="number" step="0.01" {...register("areaDaEdificacao")} />
            {errors.areaDaEdificacao && <p className="text-sm text-destructive">{errors.areaDaEdificacao.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Uso do lote *</Label>
            <Controller control={control} name="usoDoLote" render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESIDENCIAL">Residencial</SelectItem>
                  <SelectItem value="COMERCIAL">Comercial</SelectItem>
                  <SelectItem value="MISTO">Misto</SelectItem>
                  <SelectItem value="INSTITUCIONAL">Institucional</SelectItem>
                  <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                  <SelectItem value="VAGO">Vago</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.usoDoLote && <p className="text-sm text-destructive">{errors.usoDoLote.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Tipo de construção *</Label>
            <Controller control={control} name="tipoDeConstrucao" render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALVENARIA">Alvenaria</SelectItem>
                  <SelectItem value="MADEIRA">Madeira</SelectItem>
                  <SelectItem value="MISTA">Mista</SelectItem>
                  <SelectItem value="METALICA">Metálica</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.tipoDeConstrucao && <p className="text-sm text-destructive">{errors.tipoDeConstrucao.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Tipo de uso *</Label>
            <Controller control={control} name="tipoDeUso" render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROPRIO">Próprio</SelectItem>
                  <SelectItem value="ALUGADO">Alugado</SelectItem>
                  <SelectItem value="CEDIDO">Cedido</SelectItem>
                  <SelectItem value="OCUPADO">Ocupado</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.tipoDeUso && <p className="text-sm text-destructive">{errors.tipoDeUso.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Direito real *</Label>
            <Controller control={control} name="direitoReal" render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONCESSAO_USO">Concessão de uso</SelectItem>
                  <SelectItem value="CONCESSAO_REAL_USO">Concessão real de uso</SelectItem>
                  <SelectItem value="LEGITIMACAO_FUNDIARIA">Legitimação fundiária</SelectItem>
                  <SelectItem value="USUCAPIAO">Usucapião</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.direitoReal && <p className="text-sm text-destructive">{errors.direitoReal.message}</p>}
          </div>

          <div className="col-span-2 space-y-1">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea id="observacao" rows={3} {...register("observacao")} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Criar lote"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
