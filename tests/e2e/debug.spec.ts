import { test } from "@playwright/test";

test("debug - captura erros de console", async ({ page }) => {
  const consoleLogs: string[] = [];
  page.on("console", (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => consoleLogs.push(`[pageerror] ${err.message}`));

  await page.goto("/login");
  await page.fill('input[name="email"]', "supervisor@reurb.dev");
  await page.fill('input[name="senha"]', "senha123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard/**");

  await page.goto("/dashboard/projetos/novo");
  await page.waitForLoadState("networkidle");

  await page.fill('input#nome', "REURB São Luís Teste");
  await page.getByText("Selecione o estado").click();
  await page.getByPlaceholder("Buscar selecione o estado...").fill("Maranhão");
  await page.getByRole("option", { name: "MA — Maranhão" }).click();
  await page.waitForTimeout(1500);
  await page.getByText("Selecione a cidade").click();
  await page.getByPlaceholder("Buscar selecione a cidade...").fill("São Luís");
  await page.getByRole("option", { name: "São Luís", exact: true }).click();
  await page.waitForTimeout(500);

  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  const fs = await import("fs");
  fs.writeFileSync("tests/e2e/console-logs.txt", consoleLogs.join("\n"));
  fs.writeFileSync("tests/e2e/final-url.txt", page.url());
});
