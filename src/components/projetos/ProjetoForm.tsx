"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { projetoSchema, type ProjetoFormData } from "@/schemas/projeto.schema";
import { ComboboxIBGE, useEstados, useMunicipios } from "./ComboboxIBGE";
import { AnexoUpload, type AnexoPendente } from "./AnexoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExistingDoc {
  id: string;
  tipo: import("@prisma/client").TipoDocumentoProjeto;
  nomeOriginal: string | null;
  supabasePath: string;
}

interface Props {
  defaultValues?: ProjetoFormData & { id?: string; documentos?: ExistingDoc[] };
}

export function ProjetoForm({ defaultValues }: Props) {
  const router = useRouter();
  const isEditing = !!defaultValues?.id;
  const [anexos, setAnexos] = useState<AnexoPendente[]>([]);
  const [existingDocs, setExistingDocs] = useState<ExistingDoc[]>(defaultValues?.documentos ?? []);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProjetoFormData>({
    resolver: zodResolver(projetoSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? "",
      estado: defaultValues?.estado ?? "",
      municipio: defaultValues?.municipio ?? "",
    },
  });

  const estados = useEstados();
  const estadoSelecionado = watch("estado");
  const municipios = useMunicipios(estadoSelecionado, estados);

  async function onSubmit(data: ProjetoFormData) {
    setLoading(true);
    setErro(null);

    try {
      const url = isEditing ? `/api/projetos/${defaultValues!.id}` : "/api/projetos";
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao salvar projeto");
      const projeto = await res.json();

      for (const anexo of anexos) {
        const fd = new FormData();
        fd.append("file", anexo.file);
        fd.append("tipo", anexo.tipo);
        await fetch(`/api/projetos/${projeto.id}/documentos`, { method: "POST", body: fd });
      }

      router.push("/dashboard/projetos");
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  async function deletarDoc(docId: string) {
    await fetch(`/api/projetos/${defaultValues!.id}/documentos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentoId: docId }),
    });
    setExistingDocs((prev) => prev.filter((d) => d.id !== docId));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Projeto" : "Novo Projeto REURB"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome do projeto</Label>
            <Input id="nome" {...register("nome")} placeholder="Ex: REURB Conjunto Habitacional Sul" />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Estado</Label>
            <Controller
              control={control}
              name="estado"
              render={({ field }) => (
                <ComboboxIBGE
                  placeholder="Selecione o estado"
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("municipio", "");
                  }}
                  items={estados}
                />
              )}
            />
            {errors.estado && <p className="text-sm text-destructive">{errors.estado.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Cidade</Label>
            <Controller
              control={control}
              name="municipio"
              render={({ field }) => (
                <ComboboxIBGE
                  placeholder="Selecione a cidade"
                  value={field.value}
                  onChange={field.onChange}
                  items={municipios}
                  disabled={!estadoSelecionado}
                />
              )}
            />
            {errors.municipio && <p className="text-sm text-destructive">{errors.municipio.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <AnexoUpload
            anexos={anexos}
            onChange={setAnexos}
            existingDocs={existingDocs}
            onDeleteExisting={isEditing ? deletarDoc : undefined}
          />
        </CardContent>
      </Card>

      {erro && <p className="text-sm text-destructive">{erro}</p>}

      <div className="flex gap-3">
        <Button type="button" onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar projeto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
