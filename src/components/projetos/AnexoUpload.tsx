"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Trash2, Upload } from "lucide-react";
import type { TipoDocumentoProjeto } from "@prisma/client";

export const TIPOS_DOCUMENTO: { tipo: TipoDocumentoProjeto; label: string }[] = [
  { tipo: "MEMORIAL_DESCRITIVO", label: "Memorial descritivo" },
  { tipo: "FOTO_PROJETO", label: "Foto do projeto" },
  { tipo: "LEVANTAMENTO_TOPOGRAFICO", label: "Levantamento topográfico" },
  { tipo: "RELATORIO_AMBIENTAL", label: "Relatório ambiental" },
  { tipo: "RELATORIO_URBANISTICO", label: "Relatório urbanístico" },
  { tipo: "RELATORIO_JURIDICO", label: "Relatório jurídico" },
  { tipo: "RELATORIO_SOCIOECONOMICO", label: "Relatório socioeconômico" },
];

export interface AnexoPendente {
  tipo: TipoDocumentoProjeto;
  file: File;
}

interface ExistingDoc {
  id: string;
  tipo: TipoDocumentoProjeto;
  nomeOriginal: string | null;
  supabasePath: string;
}

interface Props {
  anexos: AnexoPendente[];
  onChange: (anexos: AnexoPendente[]) => void;
  existingDocs?: ExistingDoc[];
  onDeleteExisting?: (id: string) => void;
}

export function AnexoUpload({ anexos, onChange, existingDocs = [], onDeleteExisting }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoDocumentoProjeto>("MEMORIAL_DESCRITIVO");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange([...anexos, { tipo: tipoSelecionado, file }]);
    e.target.value = "";
  }

  function remover(idx: number) {
    onChange(anexos.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={tipoSelecionado}
          onChange={(e) => setTipoSelecionado(e.target.value as TipoDocumentoProjeto)}
        >
          {TIPOS_DOCUMENTO.map(({ tipo, label }) => (
            <option key={tipo} value={tipo}>{label}</option>
          ))}
        </select>
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" /> Anexar
        </Button>
        <input ref={inputRef} type="file" className="hidden" onChange={handleFile} />
      </div>

      {(existingDocs.length > 0 || anexos.length > 0) && (
        <ul className="space-y-2">
          {existingDocs.map((doc) => {
            const label = TIPOS_DOCUMENTO.find((t) => t.tipo === doc.tipo)?.label ?? doc.tipo;
            return (
              <li key={doc.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{label}</Badge>
                  <span className="text-muted-foreground truncate max-w-xs">{doc.nomeOriginal}</span>
                </span>
                {onDeleteExisting && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => onDeleteExisting(doc.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </li>
            );
          })}
          {anexos.map((a, idx) => {
            const label = TIPOS_DOCUMENTO.find((t) => t.tipo === a.tipo)?.label ?? a.tipo;
            return (
              <li key={idx} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm border-dashed">
                <span className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">{label}</Badge>
                  <span className="text-muted-foreground truncate max-w-xs">{a.file.name}</span>
                </span>
                <Button type="button" variant="ghost" size="icon" onClick={() => remover(idx)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
