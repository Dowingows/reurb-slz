import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "supervisor@reurb.dev");
  await page.fill('input[name="senha"]', "senha123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard/**");
});

test("cria projeto com nome, estado Maranhão e cidade São Luís", async ({ page }) => {
  await page.goto("/dashboard/projetos/novo");
  await page.waitForLoadState("networkidle");

  // Preenche nome
  await page.fill('input#nome', "REURB São Luís Teste");

  // Abre dropdown de estado e seleciona Maranhão
  await page.getByText("Selecione o estado").click();
  await page.getByPlaceholder("Buscar selecione o estado...").fill("Maranhão");
  await page.getByRole("option", { name: "MA — Maranhão" }).click();

  // Aguarda municípios carregarem e seleciona São Luís
  await page.waitForTimeout(1500);
  await page.getByText("Selecione a cidade").click();
  await page.getByPlaceholder("Buscar selecione a cidade...").fill("São Luís");
  await page.getByRole("option", { name: "São Luís", exact: true }).click();

  // Submete
  await page.getByRole("button", { name: "Criar projeto" }).click();

  // Deve redirecionar para listagem com o projeto criado
  await page.waitForURL("**/dashboard/projetos");
  await expect(page.getByText("REURB São Luís Teste")).toBeVisible();
});
