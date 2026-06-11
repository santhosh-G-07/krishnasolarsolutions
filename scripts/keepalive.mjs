const backendUrl = (process.env.BACKEND_URL || process.env.RAILWAY_BACKEND_URL || "").replace(/\/+$/, "");

if (!backendUrl) {
  console.error("Set BACKEND_URL or RAILWAY_BACKEND_URL to your Railway backend URL.");
  process.exit(1);
}

const url = `${backendUrl}/api/keepalive`;
let lastError = "";

for (let attempt = 1; attempt <= 4; attempt += 1) {
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const body = await response.json().catch(() => ({}));
    if (response.ok && body.ok) {
      console.log(`Keepalive successful on attempt ${attempt}.`);
      process.exit(0);
    }
    lastError = body.message || `HTTP ${response.status}`;
  } catch (error) {
    lastError = error.message;
  }

  console.log(`Keepalive attempt ${attempt} failed: ${lastError}`);
  if (attempt < 4) {
    await new Promise((resolve) => setTimeout(resolve, attempt * 15000));
  }
}

console.error(`Keepalive failed after retries: ${lastError}`);
process.exit(1);
