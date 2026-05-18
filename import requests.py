import requests

OLLAMA_URL = "http://localhost:11434/api/generate"


def build_context(codigo, max_linhas=20):
    linhas = codigo.split("\n")
    return "\n".join(linhas[-max_linhas:])


def limpar_resposta(texto):
    return texto.strip().replace("```", "")


def autocomplete(codigo):
    contexto = build_context(codigo)

    prompt = f"""Complete this C code snippet.
Be concise and continue from where it stopped.

{contexto}"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "phi3",
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "num_predict": 30
            }
        }
    )

    data = response.json()
    resposta = data.get("response", "")
    return limpar_resposta(resposta)


def main():
    print("=== Mini Codex CLI (Phi-3) ===")
    print("Digite seu código C.")
    print("Comandos:")
    print("  :tab  → autocomplete")
    print("  :exit → sair")
    print("-----------------------------")

    codigo = ""

    while True:
        linha = input("> ")

        if linha == ":exit":
            break

        elif linha == ":tab":
            sugestao = autocomplete(codigo)

            print("\nSugestão:")
            print(sugestao)
            print()

            # opcional: aplicar direto
            aplicar = input("Aplicar sugestão? (s/n): ")
            if aplicar.lower() == "s":
                codigo += sugestao

        else:
            codigo += linha + "\n"

    print("\n=== Código final ===")
    print(codigo)


if __name__ == "__main__":
    main()