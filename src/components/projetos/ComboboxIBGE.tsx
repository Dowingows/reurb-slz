"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";


type Item = { id: number; nome: string; sigla?: string };

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  items: Item[];
  disabled?: boolean;
}

export function ComboboxIBGE({ placeholder, value, onChange, items, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const selected = items.find((i) => i.nome === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        role="combobox"
        disabled={disabled}
        className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between font-normal")}
      >
        {selected ? selected.nome : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Buscar ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.nome}
                  onSelect={(val) => {
                    onChange(val);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === item.nome ? "opacity-100" : "opacity-0")}
                  />
                  {item.sigla ? `${item.sigla} — ${item.nome}` : item.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function useEstados() {
  const [estados, setEstados] = useState<Item[]>([]);

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((r) => r.json())
      .then(setEstados);
  }, []);

  return estados;
}

export function useMunicipios(estadoNome: string, estados: Item[]) {
  const [municipios, setMunicipios] = useState<Item[]>([]);

  useEffect(() => {
    const estado = estados.find((e) => e.nome === estadoNome);
    if (!estado) { setMunicipios([]); return; }

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios?orderBy=nome`)
      .then((r) => r.json())
      .then(setMunicipios);
  }, [estadoNome, estados]);

  return municipios;
}
