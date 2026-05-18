"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MapPin } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [showSenha, setShowSenha] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: fd.get("email"),
      senha: fd.get("senha"),
      redirect: false,
    });

    if (res?.error) {
      setErro("Email ou senha inválidos");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ── Painel esquerdo — branding (desktop) ── */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">REURB-SLZ</span>
          </div>
          <div className="space-y-1 pl-1">
            <p className="text-zinc-300 text-lg font-medium">Regularização Fundiária Urbana</p>
            <p className="text-zinc-500 text-sm">Sistema de gestão de projetos de regularização fundiária</p>
          </div>
        </div>

        <blockquote className="border-l-2 border-zinc-600 pl-6">
          <p className="text-zinc-300 text-sm leading-relaxed">
            Gerencie projetos, quadras e lotes. Cadastre proprietários,
            documentos e benfeitorias diretamente do campo.
          </p>
        </blockquote>

        <p className="text-zinc-500 text-sm">
          Prefeitura de São Luís &middot; Maranhão
        </p>
      </div>

      {/* ── Painel direito — formulário ── */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-white">

        {/* Banner mobile */}
        <div className="lg:hidden w-full bg-zinc-900 text-white rounded-2xl p-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">REURB-SLZ</span>
          </div>
          <p className="text-zinc-400 text-sm">Regularização Fundiária Urbana · São Luís, MA</p>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-zinc-900">Bem-vindo</h1>
            <p className="text-zinc-500 text-sm">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-zinc-700 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoFocus
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senha" className="text-zinc-700 font-medium">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  name="senha"
                  type={showSenha ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
