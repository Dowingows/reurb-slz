"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { benfeitoriaSchema, type BenfeitoriaInput } from "@/schemas/benfeitoria.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { Benfeitoria } from "@prisma/client";

interface Props {
  loteId: string;
  benfeitorias: Benfeitoria | null;
}

const CONDICOES_OPTIONS = [
  { value: "BOA", label: "Boa" },
  { value: "REGULAR", label: "Regular" },
  { value: "RUIM", label: "Ruim" },
  { value: "AUSENTE", label: "Ausente" },
];

export function AbaBenfeitorias({ loteId, benfeitorias }: Props) {
  const router = useRouter();

  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<BenfeitoriaInput>({
    resolver: zodResolver(benfeitoriaSchema),
    defaultValues: benfeitorias ? {
      estabilidadeEstrutura: benfeitorias.estabilidadeEstrutura ?? undefined,
      necessidadeReconstrucao: benfeitorias.necessidadeReconstrucao ?? undefined,
      numeroComodos: benfeitorias.numeroComodos ?? undefined,
      numeroMoradoresPorComodo: benfeitorias.numeroMoradoresPorComodo ?? undefined,
      numeroBanheiros: benfeitorias.numeroBanheiros ?? undefined,
      condicoesBanheiros: benfeitorias.condicoesBanheiros ?? undefined,
      materialParedesExternas: benfeitorias.materialParedesExternas ?? undefined,
      condicoesParedesExternas: benfeitorias.condicoesParedesExternas ?? undefined,
      cobertura: benfeitorias.cobertura ?? undefined,
      instalacoesEletricas: benfeitorias.instalacoesEletricas,
      condicoesInstalacoesEletricas: benfeitorias.condicoesInstalacoesEletricas ?? undefined,
      instalacoesHidrossanitarias: benfeitorias.instalacoesHidrossanitarias,
      condicoesInstalacoesHidrossanitarias: benfeitorias.condicoesInstalacoesHidrossanitarias ?? undefined,
      esgotamentoSanitario: benfeitorias.esgotamentoSanitario,
      condicoesEsgotamentoSanitario: benfeitorias.condicoesEsgotamentoSanitario ?? undefined,
    } : {
      instalacoesEletricas: [],
      instalacoesHidrossanitarias: [],
      esgotamentoSanitario: [],
    },
  });

  async function onSubmit(data: BenfeitoriaInput) {
    const res = await fetch(`/api/lotes/${loteId}/benfeitorias`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Erro ao salvar benfeitorias");
      return;
    }

    toast.success("Benfeitorias salvas!");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">

        <div className="space-y-1">
          <Label>Estabilidade da estrutura</Label>
          <Controller control={control} name="estabilidadeEstrutura" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BOA">Boa</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="RUIM">Ruim</SelectItem>
                <SelectItem value="PESSIMA">Péssima</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        <div className="space-y-1">
          <Label>Necessidade de reconstrução</Label>
          <Controller control={control} name="necessidadeReconstrucao" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NAO">Não</SelectItem>
                <SelectItem value="PARCIAL">Parcial</SelectItem>
                <SelectItem value="TOTAL">Total</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        <div className="space-y-1">
          <Label>Nº de cômodos</Label>
          <Input type="number" {...register("numeroComodos")} />
        </div>

        <div className="space-y-1">
          <Label>Nº de moradores por cômodo</Label>
          <Input type="number" {...register("numeroMoradoresPorComodo")} />
        </div>

        <div className="space-y-1">
          <Label>Nº de banheiros</Label>
          <Input type="number" {...register("numeroBanheiros")} />
        </div>

        <div className="space-y-1">
          <Label>Condições dos banheiros</Label>
          <Controller control={control} name="condicoesBanheiros" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BOM">Bom</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="RUIM">Ruim</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        <div className="space-y-1">
          <Label>Material das paredes externas</Label>
          <Controller control={control} name="materialParedesExternas" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALVENARIA">Alvenaria</SelectItem>
                <SelectItem value="MADEIRA">Madeira</SelectItem>
                <SelectItem value="MISTO">Misto</SelectItem>
                <SelectItem value="TAIPA">Taipa</SelectItem>
                <SelectItem value="METALICO">Metálico</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        <div className="space-y-1">
          <Label>Condições das paredes externas</Label>
          <Controller control={control} name="condicoesParedesExternas" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BOA">Boa</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="RUIM">Ruim</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Cobertura</Label>
          <Controller control={control} name="cobertura" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="LAJE">Laje</SelectItem>
                <SelectItem value="TELHA_CERAMICA">Telha cerâmica</SelectItem>
                <SelectItem value="TELHA_FIBROCIMENTO">Telha fibrocimento</SelectItem>
                <SelectItem value="TELHA_METALICA">Telha metálica</SelectItem>
                <SelectItem value="PALHA">Palha</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        {/* Instalações elétricas */}
        <div className="col-span-2 space-y-2">
          <Label>Instalações elétricas</Label>
          <Controller control={control} name="instalacoesEletricas" render={({ field }) => {
            const arr = (field.value as string[]) ?? [];
            return (
              <div className="space-y-2">
                {arr.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={item} onChange={(e) => {
                      const next = [...arr];
                      next[i] = e.target.value;
                      field.onChange(next);
                    }} />
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => field.onChange(arr.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => field.onChange([...arr, ""])}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
            );
          }} />
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Condições das instalações elétricas</Label>
          <Controller control={control} name="condicoesInstalacoesEletricas" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {CONDICOES_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </div>

        {/* Instalações hidrossanitárias */}
        <div className="col-span-2 space-y-2">
          <Label>Instalações hidrossanitárias</Label>
          <Controller control={control} name="instalacoesHidrossanitarias" render={({ field }) => {
            const arr = (field.value as string[]) ?? [];
            return (
              <div className="space-y-2">
                {arr.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={item} onChange={(e) => {
                      const next = [...arr];
                      next[i] = e.target.value;
                      field.onChange(next);
                    }} />
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => field.onChange(arr.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => field.onChange([...arr, ""])}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
            );
          }} />
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Condições das instalações hidrossanitárias</Label>
          <Controller control={control} name="condicoesInstalacoesHidrossanitarias" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {CONDICOES_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </div>

        {/* Esgotamento sanitário */}
        <div className="col-span-2 space-y-2">
          <Label>Esgotamento sanitário</Label>
          <Controller control={control} name="esgotamentoSanitario" render={({ field }) => {
            const arr = (field.value as string[]) ?? [];
            return (
              <div className="space-y-2">
                {arr.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={item} onChange={(e) => {
                      const next = [...arr];
                      next[i] = e.target.value;
                      field.onChange(next);
                    }} />
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => field.onChange(arr.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => field.onChange([...arr, ""])}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
            );
          }} />
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Condições do esgotamento sanitário</Label>
          <Controller control={control} name="condicoesEsgotamentoSanitario" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {CONDICOES_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </div>

      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : benfeitorias ? "Salvar alterações" : "Salvar benfeitorias"}
      </Button>
    </form>
  );
}
