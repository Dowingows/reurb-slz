"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AbaInformacoes } from "./AbaInformacoes";
import { AbaProprietario } from "./AbaProprietario";
import { AbaDocumentos } from "./AbaDocumentos";
import { AbaBenfeitorias } from "./AbaBenfeitorias";
import type { Lote, Proprietario, DocumentoLote, Benfeitoria } from "@prisma/client";

type LoteComRelacoes = Lote & {
  proprietario: Proprietario | null;
  documentos: DocumentoLote | null;
  benfeitorias: Benfeitoria | null;
};

interface Props {
  lote: LoteComRelacoes;
  projetoId: string;
  quadraId: string;
}

export function LoteTabs({ lote, projetoId, quadraId }: Props) {
  return (
    <Tabs defaultValue="informacoes" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="informacoes">Informações</TabsTrigger>
        <TabsTrigger value="proprietario">Proprietário</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="benfeitorias">Benfeitorias</TabsTrigger>
      </TabsList>

      <TabsContent value="informacoes" className="mt-6">
        <AbaInformacoes lote={lote} projetoId={projetoId} quadraId={quadraId} />
      </TabsContent>

      <TabsContent value="proprietario" className="mt-6">
        <AbaProprietario loteId={lote.id} proprietario={lote.proprietario} />
      </TabsContent>

      <TabsContent value="documentos" className="mt-6">
        <AbaDocumentos loteId={lote.id} documentos={lote.documentos} />
      </TabsContent>

      <TabsContent value="benfeitorias" className="mt-6">
        <AbaBenfeitorias loteId={lote.id} benfeitorias={lote.benfeitorias} />
      </TabsContent>
    </Tabs>
  );
}
