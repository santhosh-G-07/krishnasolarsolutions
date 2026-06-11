import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.SMOKE_URL || "http://127.0.0.1:5173";
const apiUrl = process.env.SMOKE_API_URL || baseUrl;
const env = Object.fromEntries(
  (await readFile(".env", "utf8"))
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([^#=\s]+)\s*=\s*"?([^"]*)"?\s*$/))
    .filter(Boolean)
    .map((match) => [match[1], match[2]]),
);
const routes = [
  "/",
  "/services",
  "/services/on-grid-solar",
  "/products",
  "/products/solar-panels",
  "/auth",
  "/staff-login",
  "/apply",
  "/missing-page",
];
const viewports = [
  ["phone", { width: 390, height: 844 }],
  ["laptop", { width: 1440, height: 960 }],
];
const failures = [];
const browser = await chromium.launch();

function monitor(page, label) {
  page.on("pageerror", (error) => failures.push(`${label}: page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`${label}: console error: ${message.text()}`);
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (response.status() >= 400 && url.origin === new URL(baseUrl).origin) {
      failures.push(`${label}: HTTP ${response.status()} ${url.pathname}`);
    }
  });
}

async function assertLayout(page, label) {
  await page.waitForTimeout(250);
  const result = await page.evaluate(() => ({
    text: document.body.innerText.trim().length,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    fatal: Boolean(document.querySelector(".fatal-fallback")),
  }));
  if (result.text < 30) failures.push(`${label}: page rendered too little content`);
  if (result.overflow > 3) failures.push(`${label}: body horizontal overflow ${result.overflow}px`);
  if (result.fatal) failures.push(`${label}: fatal fallback rendered`);
}

async function injectSession(page, user, route) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate((session) => {
    localStorage.setItem("kssSession", JSON.stringify(session));
    sessionStorage.setItem("kssSession", JSON.stringify(session));
  }, user);
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
}

for (const [name, viewport] of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  monitor(page, name);
  for (const route of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await assertLayout(page, `${name} ${route}`);
  }
  await context.close();
}

const adminContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const adminPage = await adminContext.newPage();
monitor(adminPage, "admin phone");
await adminPage.goto(`${baseUrl}/staff-login?role=admin`, { waitUntil: "networkidle" });
await adminPage.locator('input[name="username"]').fill(env.ADMIN_EMAIL || "admin");
await adminPage.locator('input[name="password"]').fill(env.ADMIN_PASSWORD || "");
await Promise.all([
  adminPage.waitForURL("**/admin"),
  adminPage.getByRole("button", { name: "Login as admin" }).click(),
]);
await assertLayout(adminPage, "admin phone dashboard");
if (!(await adminPage.locator(".mobile-bottom-nav").isVisible())) failures.push("admin phone: bottom navigation is not visible");
await adminPage.locator(".staff-topbar .button.primary").click();
if (!(await adminPage.locator(".modal").isVisible())) failures.push("admin phone: add application modal did not open");
await adminPage.locator(".modal > header button").click();
await adminPage.locator(".mobile-bottom-nav button").filter({ hasText: "Content" }).click();
if (!(await adminPage.getByRole("button", { name: "+ Add service" }).isVisible())) failures.push("admin phone: add service control missing");
if (!(await adminPage.getByRole("button", { name: "+ Add product" }).isVisible())) failures.push("admin phone: add product control missing");
await adminPage.getByRole("button", { name: "+ Add service" }).click();
if (!(await adminPage.locator('.modal input[name="title"]').isVisible())) failures.push("admin phone: add service form did not open");
await adminPage.locator(".modal > header button").click();
const bootstrapResponse = await adminPage.request.get(`${apiUrl}/api/bootstrap`);
const bootstrap = await bootstrapResponse.json();
await adminContext.close();

const laptopContext = await browser.newContext({ viewport: { width: 1440, height: 960 } });
const staffPage = await laptopContext.newPage();
monitor(staffPage, "staff laptop");
const employee = bootstrap.users.find((user) => user.role === "employee" && user.active);
if (employee) {
  await injectSession(staffPage, employee, "/employee");
  await assertLayout(staffPage, "employee laptop dashboard");
  if (!(await staffPage.locator(".staff-sidebar").isVisible())) failures.push("employee laptop: sidebar is not visible");
} else {
  failures.push("employee laptop: no active employee exists for dashboard smoke test");
}
const customer = bootstrap.customers[0];
if (customer) {
  await injectSession(staffPage, customer, "/dashboard");
  await assertLayout(staffPage, "customer laptop dashboard");
} else {
  failures.push("customer laptop: no customer exists for dashboard smoke test");
}
await laptopContext.close();
await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Smoke checks passed for ${routes.length} routes, phone/laptop layouts, and role dashboards.`);
