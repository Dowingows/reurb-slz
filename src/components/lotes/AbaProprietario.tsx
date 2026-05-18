"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { proprietarioSchema, type ProprietarioInput } from "@/schemas/proprietario.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Proprietario } from "@prisma/client";

interface Props {
  loteId: string;
  proprietario: Proprietario | null;
}

export function AbaProprietario({ loteId, proprietario }: Props) {
  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProprietarioInput>({
    resolver: zodResolver(proprietarioSchema),
    defaultValues: proprietario ? {
      nome: proprietario.nome,
      nomeSocial: proprietario.nomeSocial ?? "",
      cpf: proprietario.cpf,
      rg: proprietario.rg ?? "",
      nis: proprietario.nis ?? "",
      cnpj: proprietario.cnpj ?? "",
      email: proprietario.email ?? "",
      celular: proprietario.celular,
      celular2: proprietario.celular2 ?? "",
      filiacaoMaterna: proprietario.filiacaoMaterna ?? "",
      filiacaoPaterna: proprietario.filiacaoPaterna ?? "",
      estadoCivil: proprietario.estadoCivil,
      profissao: proprietario.profissao,
      rendaIndividualMensal: proprietario.rendaIndividualMensal,
      rendaFamiliarMensal: proprietario.rendaFamiliarMensal,
      recebeBolsaFamilia: proprietario.recebeBolsaFamilia,
      recebeBPC: proprietario.recebeBPC,
      isPCD: proprietario.isPCD,
      temPCDNaMoradia: proprietario.temPCDNaMoradia,
      observacoes: proprietario.observacoes ?? "",
    } : {
      recebeBolsaFamilia: false,
      recebeBPC: false,
      isPCD: false,
      temPCDNaMoradia: false,
    },
  });

  async function onSubmit(data: ProprietarioInput) {
    const res = await fetch(`/api/lotes/${loteId}/proprietario`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Erro ao salvar proprietário");
      return;
    }

    toast.success("Proprietário salvo!");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1">
          <Label>Nome *</Label>
          <Input {...register("nome")} />
          {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Nome social</Label>
          <Input {...register("nomeSocial")} />
        </div>

        <div className="space-y-1">
          <Label>CPF *</Label>
          <Input placeholder="000.000.000-00" {...register("cpf")} />
          {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>RG</Label>
          <Input maxLength={14} {...register("rg")} />
        </div>

        <div className="space-y-1">
          <Label>NIS</Label>
          <Input maxLength={11} {...register("nis")} />
        </div>

        <div className="space-y-1">
          <Label>CNPJ</Label>
          <Input {...register("cnpj")} />
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Celular *</Label>
          <Input {...register("celular")} />
          {errors.celular && <p className="text-sm text-destructive">{errors.celular.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Celular 2</Label>
          <Input {...register("celular2")} />
        </div>

        <div className="space-y-1">
          <Label>Filiação materna</Label>
          <Input {...register("filiacaoMaterna")} />
        </div>

        <div className="space-y-1">
          <Label>Filiação paterna</Label>
          <Input {...register("filiacaoPaterna")} />
        </div>

        <div className="space-y-1">
          <Label>Estado civil *</Label>
          <Controller control={control} name="estadoCivil" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                <SelectItem value="CASADO">Casado(a)</SelectItem>
                <SelectItem value="UNIAO_ESTAVEL">União estável</SelectItem>
                <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
              </SelectContent>
            </Select>
          )} />
          {errors.estadoCivil && <p className="text-sm text-destructive">{errors.estadoCivil.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Profissão *</Label>
          <Input {...register("profissao")} />
          {errors.profissao && <p className="text-sm text-destructive">{errors.profissao.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Renda individual mensal *</Label>
          <Input type="number" step="0.01" {...register("rendaIndividualMensal")} />
          {errors.rendaIndividualMensal && <p className="text-sm text-destructive">{errors.rendaIndividualMensal.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Renda familiar mensal *</Label>
          <Input type="number" step="0.01" {...register("rendaFamiliarMensal")} />
          {errors.rendaFamiliarMensal && <p className="text-sm text-destructive">{errors.rendaFamiliarMensal.message}</p>}
        </div>

        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="bolsaFamilia" {...register("recebeBolsaFamilia")} className="h-4 w-4" />
            <Label htmlFor="bolsaFamilia">Recebe Bolsa Família?</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="bpc" {...register("recebeBPC")} className="h-4 w-4" />
            <Label htmlFor="bpc">Recebe Benefício de Prestação Continuada (BPC)?</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPCD" {...register("isPCD")} className="h-4 w-4" />
            <Label htmlFor="isPCD">É uma Pessoa com Deficiência (PCD)?</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="temPCD" {...register("temPCDNaMoradia")} className="h-4 w-4" />
            <Label htmlFor="temPCD">Tem alguma PCD na moradia?</Label>
          </div>
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Observações</Label>
          <Textarea rows={3} {...register("observacoes")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : proprietario ? "Salvar alterações" : "Cadastrar proprietário"}
      </Button>
    </form>
  );
}
