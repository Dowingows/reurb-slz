"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Eye } from "lucide-react";
import type { DocumentoLote } from "@prisma/client";
import { supabase } from "@/lib/supabase-public";

type CampoDoc = "rgFrente" | "rgVerso" | "cpfFoto" | "comprovanteResidencia" | "certidaoNascimentoDivorcio";

const DOCUMENTOS: { campo: CampoDoc; label: string }[] = [
  { campo: "rgFrente", label: "RG — Frente" },
  { campo: "rgVerso", label: "RG — Verso" },
  { campo: "cpfFoto", label: "CPF" },
  { campo: "comprovanteResidencia", label: "Comprovante de residência" },
  { campo: "certidaoNascimentoDivorcio", label: "Certidão de nascimento ou divórcio" },
];

interface Props {
  loteId: string;
  documentos: DocumentoLote | null;
}

export function AbaDocumentos({ loteId, documentos }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState<CampoDoc | null>(null);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  async function handleUpload(campo: CampoDoc, file: File) {
    setUploading(campo);
    const formData = new FormData();
    formData.append("campo", campo);
    formData.append("file", file);

    const res = await fetch(`/api/lotes/${loteId}/documentos`, {
      method: "POST",
      body: formData,
    });

    setUploading(null);

    if (!res.ok) {
      toast.error("Erro ao fazer upload");
      return;
    }

    toast.success("Documento enviado!");
    router.refresh();
  }

  async function handleDelete(campo: CampoDoc) {
    if (!confirm("Remover este documento?")) return;

    const res = await fetch(`/api/lotes/${loteId}/documentos?campo=${campo}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Erro ao remover");
      return;
    }

    toast.success("Documento removido");
    router.refresh();
  }

  function getPublicUrl(path: string) {
    const { data } = supabase.storage.from("projetos").getPublicUrl(path);
    return data.publicUrl;
  }

  return (
    <div className="space-y-6 max-w-xl">
      {DOCUMENTOS.map(({ campo, label }) => {
        const path = documentos?.[campo];
        return (
          <div key={campo} className="space-y-2">
            <Label className="font-medium">{label}</Label>

            {path ? (
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground flex-1 truncate">{path.split("/").pop()}</span>
                <a href={getPublicUrl(path)} target="_blank" rel="noreferrer">
                  <Button type="button" variant="ghost" size="icon-sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(campo)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => refs.current[campo]?.click()}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading === campo ? "Enviando..." : "Clique para selecionar"}
                </span>
              </div>
            )}

            <input
              ref={(el) => { refs.current[campo] = el; }}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(campo, file);
                e.target.value = "";
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
