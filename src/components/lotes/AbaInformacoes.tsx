"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loteSchema, type LoteInput } from "@/schemas/lote.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Lote } from "@prisma/client";

interface Props {
  lote: Lote;
  projetoId: string;
  quadraId: string;
}

export function AbaInformacoes({ lote, projetoId, quadraId }: Props) {
  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<LoteInput>({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      nomeLote: lote.nomeLote,
      numeroSelagem: lote.numeroSelagem ?? "",
      rua: lote.rua,
      numero: lote.numero,
      complemento: lote.complemento ?? "",
      area: lote.area,
      areaDaEdificacao: lote.areaDaEdificacao,
      inscricaoImobiliaria: lote.inscricaoImobiliaria ?? "",
      usoDoLote: lote.usoDoLote,
      tipoDeConstrucao: lote.tipoDeConstrucao,
      tipoDeUso: lote.tipoDeUso,
      direitoReal: lote.direitoReal,
      observacao: lote.observacao ?? "",
    },
  });

  async function onSubmit(data: LoteInput) {
    const res = await fetch(`/api/lotes/${lote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Erro ao salvar");
      return;
    }

    toast.success("Informações salvas!");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este lote?")) return;

    const res = await fetch(`/api/lotes/${lote.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Erro ao excluir");
      return;
    }

    toast.success("Lote excluído");
    router.push(`/dashboard/projetos/${projetoId}/quadras/${quadraId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1">
          <Label>Nome do lote *</Label>
          <Input placeholder="Ex: 001" {...register("nomeLote")} />
          {errors.nomeLote && <p className="text-sm text-destructive">{errors.nomeLote.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Número de selagem</Label>
          <Input {...register("numeroSelagem")} />
        </div>

        <div className="space-y-1">
          <Label>Inscrição imobiliária</Label>
          <Input {...register("inscricaoImobiliaria")} />
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Rua *</Label>
          <Input {...register("rua")} />
          {errors.rua && <p className="text-sm text-destructive">{errors.rua.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Número *</Label>
          <Input {...register("numero")} />
          {errors.numero && <p className="text-sm text-destructive">{errors.numero.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Complemento</Label>
          <Input {...register("complemento")} />
        </div>

        <div className="space-y-1">
          <Label>Área (m²) *</Label>
          <Input type="number" step="0.01" {...register("area")} />
          {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Área da edificação (m²) *</Label>
          <Input type="number" step="0.01" {...register("areaDaEdificacao")} />
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
          <Label>Observação</Label>
          <Textarea rows={3} {...register("observacao")} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete}>
          Excluir lote
        </Button>
      </div>
    </form>
  );
}
