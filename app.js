const ADMIN_EMAIL = "krishnamoharana011@gmail.com";
const KSS_PHONE = "8117845317";

const heroQuotes = [
  { kicker: "For Homes", quote: "Clean energy for a brighter home.", subtext: "Protect your family from rising electricity costs." },
  { kicker: "Savings Focus", quote: "One-time investment. Lifetime of savings.", subtext: "Stop renting electricity. Start owning your power." },
  { kicker: "Installation", quote: "A smarter rooftop starts with solar.", subtext: "KSS tracks your journey from enquiry to completion." },
  { kicker: "For Agriculture", quote: "Grow crops. Generate clean power.", subtext: "Power pumps, lights, and your future with sunlight." }
];

const defaultServices = [
  {
    id: "on-grid-solar",
    type: "service",
    sortOrder: 1,
    active: true,
    title: "On-grid Solar",
    badge: "Best for low bills",
    tagline: "Connect your home or business to the grid and cut electricity bills by up to 90%. Earn credits by selling surplus power back.",
    description: "Connect your home or business to the grid and cut electricity bills by up to 90%. Earn credits by selling surplus power back.",
    details: ["Solar panel installation", "Grid-tie inverter setup", "AC/DC wiring and cabling", "Net meter application", "Earthing and safety checks", "1-year free service"],
    benefits: ["Cut electricity bills by up to 90% from the first month", "Sell surplus power back to the grid and earn bill credits", "Eligible for PM Surya Ghar subsidy up to Rs 78,000 for 3kW systems", "System can pay for itself in 3-4 years, then deliver long-term free power"],
    process: [
      { name: "Free site survey", detail: "Our expert visits, checks roof area, shadow, and current electricity bill." },
      { name: "Custom proposal", detail: "You get a quote with panel count, inverter size, savings, and payback period." },
      { name: "Installation", detail: "Certified team installs panels and inverter with clean wiring and roof-safe mounting." },
      { name: "Net meter and subsidy filing", detail: "KSS supports DISCOM paperwork and government subsidy application." },
      { name: "Handover and monitoring", detail: "Live monitoring setup, warranty guidance, and 1-year free service." }
    ],
    documents: ["Latest electricity bill", "Aadhaar card or ID proof", "Ownership or rental proof", "Roof photos, we can help"],
    pricing: "Rs 65,000 onwards",
    priceNote: "Final price depends on system size in kW. Government subsidy can reduce this significantly.",
    ctaPrimary: "Book free site visit",
    ctaSecondary: "WhatsApp us"
  },
  {
    id: "hybrid-solar",
    type: "service",
    sortOrder: 2,
    active: true,
    title: "Hybrid Solar",
    badge: "Solar with backup",
    tagline: "Get grid power plus battery backup in one smart solar system. Stay powered during outages and reduce bills.",
    description: "Get grid power plus battery backup in one smart solar system. Stay powered during outages and reduce bills.",
    details: ["Solar panel installation", "Hybrid inverter setup", "Battery bank installation", "Net metering support", "Earthing and safety checks", "1-year free service"],
    benefits: ["Battery backup starts automatically during power cuts", "Save up to 80% on electricity bills from day one", "Eligible for PM Surya Ghar subsidy up to Rs 78,000", "Good for homes and shops in frequent power-cut areas"],
    process: [
      { name: "Free site survey", detail: "We check roof, shadow, load requirement, and current electricity usage." },
      { name: "Backup planning", detail: "Battery size and inverter capacity are selected based on your essential loads." },
      { name: "Custom proposal", detail: "Quote includes panels, inverter, battery capacity, savings, and payback estimate." },
      { name: "Installation and testing", detail: "Panels, inverter, and batteries are installed and tested for power-cut mode." },
      { name: "Handover and monitoring", detail: "You receive operating guidance, monitoring setup, and service support." }
    ],
    documents: ["Latest electricity bill", "Aadhaar card or ID proof", "Ownership or rental proof", "Roof photos, we can help"],
    pricing: "Rs 1,20,000 onwards",
    priceNote: "Final price depends on system size and battery capacity. Subsidy can reduce the solar portion.",
    ctaPrimary: "Book free site visit",
    ctaSecondary: "WhatsApp us"
  },
  {
    id: "off-grid-solar",
    type: "service",
    sortOrder: 3,
    active: true,
    title: "Off-grid Solar",
    badge: "No grid needed",
    tagline: "Fully independent solar power with battery storage for remote homes, farmhouses, and no-grid locations.",
    description: "Fully independent solar power with battery storage. Ideal for remote homes, farmhouses, or areas without grid connection.",
    details: ["Solar panel installation", "Off-grid inverter setup", "Battery bank setup", "MPPT charge controller", "Complete AC/DC wiring", "1-year free service"],
    benefits: ["Zero dependence on the electricity grid", "Works for remote villages, farms, and hill locations", "Reduces diesel generator running cost", "Battery stores power for night and cloudy-day use"],
    process: [
      { name: "Load assessment", detail: "We calculate daily power needs for lights, fans, appliances, and pump usage." },
      { name: "System design", detail: "Panel count, battery capacity, and inverter size are planned for your exact usage." },
      { name: "Quotation", detail: "You receive a clear quote with battery type, backup hours, and maintenance notes." },
      { name: "Installation", detail: "Complete setup with panels, battery, wiring, earthing, and protection." },
      { name: "Testing and training", detail: "We test backup performance and explain how to operate the system." }
    ],
    documents: ["Aadhaar card or ID proof", "Property or land document", "Appliance list, we can help", "Site photos"],
    pricing: "Rs 80,000 onwards",
    priceNote: "Price varies by system size and battery type. Final quote is confirmed after load assessment.",
    ctaPrimary: "Book free site visit",
    ctaSecondary: "WhatsApp us"
  },
  {
    id: "solar-water-pump",
    type: "service",
    sortOrder: 4,
    active: true,
    title: "Solar Water Pump",
    badge: "Farm support",
    tagline: "Run irrigation with sunlight and reduce diesel or electricity dependency for farm water pumping.",
    description: "Ditch diesel pumps forever. Run irrigation with solar power and reduce fuel cost, maintenance headaches, and emissions.",
    details: ["Solar panels for pump", "Solar pump controller or VFD", "Submersible or surface pump", "MS panel mounting structure", "DC cabling and earthing", "1-year free service"],
    benefits: ["Reduce diesel fuel cost for irrigation", "Runs directly on sunlight for daytime pumping", "PM KUSUM subsidy support may be available for eligible farmers", "Low maintenance with clean energy for fields"],
    process: [
      { name: "Farm site visit", detail: "We check borewell depth, water level, land area, and irrigation requirement." },
      { name: "Pump and panel sizing", detail: "Right HP pump and panel capacity are calculated for your crop and land size." },
      { name: "Subsidy document support", detail: "KSS guides eligible customers for PM KUSUM or available local schemes." },
      { name: "Installation", detail: "Panels, pump, controller, and earthing are installed at your field." },
      { name: "Handover and demo", detail: "We demonstrate operation and explain maintenance basics." }
    ],
    documents: ["Aadhaar and farmer ID", "Land or khasra documents", "Borewell depth details", "Farm site photos"],
    pricing: "Rs 45,000 onwards",
    priceNote: "Final price depends on pump HP and panel capacity. Subsidy can reduce customer cost when applicable.",
    ctaPrimary: "Book free farm visit",
    ctaSecondary: "WhatsApp us"
  },
  {
    id: "commercial-solar",
    type: "service",
    sortOrder: 5,
    active: true,
    title: "Commercial Solar",
    badge: "For businesses",
    tagline: "Large-scale rooftop solar for factories, offices, shops, and commercial buildings with strong ROI tracking.",
    description: "Large-scale rooftop solar for factories, offices, and shops. Reduce operating costs and qualify for business benefits.",
    details: ["High-capacity panel installation", "3-phase inverter setup", "Industrial mounting structure", "Net metering and DISCOM sync", "Remote monitoring system", "1-year free AMC"],
    benefits: ["Reduce factory, office, or shop electricity bills by 70-90%", "Businesses may claim depreciation and input-credit benefits as applicable", "Strong ROI with typical payback in 3-5 years", "Improve brand image with clean energy adoption"],
    process: [
      { name: "Rooftop and load survey", detail: "Technical team measures roof area and reviews electricity bills." },
      { name: "Detailed proposal", detail: "System design includes generation estimate, savings projection, and ROI report." },
      { name: "Commercial approval support", detail: "KSS guides net metering, DISCOM coordination, and required paperwork." },
      { name: "Installation", detail: "Industrial-grade installation is planned with minimum disruption to business." },
      { name: "Commissioning and monitoring", detail: "Grid sync, commissioning, and remote monitoring access are handed over." }
    ],
    documents: ["12 months electricity bills", "Business registration proof", "Building or rooftop plan", "Owner or director ID proof"],
    pricing: "Rs 3,00,000 onwards",
    priceNote: "Depends on system capacity in kW or MW. Business tax benefits depend on customer eligibility.",
    ctaPrimary: "Request site assessment",
    ctaSecondary: "WhatsApp us"
  },
  {
    id: "amc-maintenance",
    type: "service",
    sortOrder: 6,
    active: true,
    title: "AMC & Maintenance",
    badge: "Keep it running",
    tagline: "Annual maintenance contracts to clean panels, check inverters, and keep output strong all year.",
    description: "Annual maintenance contracts to clean panels, check inverters, and ensure your solar system gives peak output all year round.",
    details: ["Panel cleaning visits", "Inverter health check", "Battery inspection where applicable", "Wiring and earthing check", "Performance report", "Priority support"],
    benefits: ["Cleaning can restore generation lost due to dust", "Catch small issues before they become expensive repairs", "Priority response for breakdowns and performance complaints", "Annual report shows generation, savings, and system health"],
    process: [
      { name: "Choose AMC plan", detail: "Select basic, standard, premium, or commercial support based on system size." },
      { name: "Baseline inspection", detail: "KSS checks current generation, wiring, inverter, earthing, and panel condition." },
      { name: "Scheduled visits", detail: "Cleaning and health checks happen as per your AMC plan." },
      { name: "Emergency support", detail: "Call or WhatsApp KSS when output drops or a fault appears." },
      { name: "Annual report", detail: "You get a summary of system performance and maintenance recommendations." }
    ],
    documents: ["Existing solar invoice if available", "System capacity details", "Inverter model photo", "Site or roof photos"],
    pricing: "Rs 2,500 / year onwards",
    priceNote: "Plans are available for residential, agricultural, and commercial solar systems of different sizes.",
    ctaPrimary: "Get AMC quote",
    ctaSecondary: "WhatsApp us"
  }
];

const defaultProducts = [
  {
    id: "solar-panels",
    type: "product",
    sortOrder: 1,
    active: true,
    title: "Solar Panels",
    badge: "Panel",
    warranty: "25 yr warranty",
    color: "#1a5c35",
    icon: "▦",
    description: "Main generation component for rooftop solar systems.",
    specs: [{ label: "Capacity", value: "550", unit: "Wp" }, { label: "Efficiency", value: "21.3", unit: "%" }, { label: "Type", value: "Mono PERC", unit: "" }],
    benefits: ["High rooftop generation output", "25-year performance guarantee", "Suitable for all roof types", "Low maintenance cost"],
    install: ["Selected by roof area and load", "Mounted on GI structure", "Used in final customer quote", "MNRE-approved options available"],
    process: ["Roof survey", "Capacity selection", "Mounting", "Wiring", "Generation check"]
  },
  {
    id: "solar-inverter",
    type: "product",
    sortOrder: 2,
    active: true,
    title: "Solar Inverter",
    badge: "Inverter",
    warranty: "5 yr warranty",
    color: "#1a4a8a",
    icon: "⚡",
    description: "Converts DC solar power to AC for home, business, and grid use.",
    specs: [{ label: "Output", value: "3.5", unit: "kW" }, { label: "Efficiency", value: "98.2", unit: "%" }, { label: "Type", value: "String", unit: "" }],
    benefits: ["Pure sine wave output", "Grid-tied compatible", "Auto shutdown on fault", "Remote monitoring app support"],
    install: ["Sized to match panel capacity", "Wall mounted near DB", "Connected to ACDB box", "Grid sync configured"],
    process: ["Panel sizing", "Inverter selection", "Wall mounting", "ACDB connect", "Grid sync"]
  },
  {
    id: "acdb-dcdb-protection",
    type: "product",
    sortOrder: 3,
    active: true,
    title: "ACDB/DCDB Protection",
    badge: "Protection",
    warranty: "2 yr warranty",
    color: "#8a4a1a",
    icon: "⛓",
    description: "Distribution boxes for safe AC and DC power management.",
    specs: [{ label: "AC Breaker", value: "32", unit: "A" }, { label: "DC Fuse", value: "15", unit: "A" }, { label: "IP Rating", value: "IP65", unit: "" }],
    benefits: ["Surge and overload protection", "Weatherproof enclosure", "Separate AC and DC circuits", "Easy fault isolation"],
    install: ["Mounted near inverter", "DC side from panels", "AC side to grid or load", "Earthing connected"],
    process: ["Site assessment", "Box sizing", "Panel mounting", "Wiring", "Testing"]
  },
  {
    id: "lithium-battery-storage",
    type: "product",
    sortOrder: 4,
    active: true,
    title: "Lithium Battery / Storage",
    badge: "Storage",
    warranty: "10 yr warranty",
    color: "#5a3a9a",
    icon: "▣",
    description: "Stores solar energy for night use and power backup.",
    specs: [{ label: "Capacity", value: "5", unit: "kWh" }, { label: "Cycles", value: "6000", unit: "+" }, { label: "Type", value: "LiFePO4", unit: "" }],
    benefits: ["Power backup during outages", "Use solar energy at night", "Reduces grid dependency", "Battery management protection"],
    install: ["Sized by daily usage", "Paired with hybrid inverter", "Wall or floor mounted", "BMS configured during setup"],
    process: ["Load analysis", "Capacity sizing", "Inverter pairing", "Installation", "BMS config"]
  },
  {
    id: "net-meter",
    type: "product",
    sortOrder: 5,
    active: true,
    title: "Net Meter",
    badge: "Meter",
    warranty: "1 yr warranty",
    color: "#0a7a7a",
    icon: "↔",
    description: "Bidirectional meter for grid export and import tracking.",
    specs: [{ label: "Type", value: "Bi-dir", unit: "" }, { label: "Accuracy", value: "Class", unit: "1.0" }, { label: "Use", value: "Import", unit: "/ Export" }],
    benefits: ["Tracks exported solar energy", "Enables net billing savings", "Required for subsidy process", "DISCOM-approved meter support"],
    install: ["Applied through DISCOM", "Installed by utility team", "Replaces existing meter", "Connected to inverter output"],
    process: ["Application", "Utility approval", "Old meter removal", "Net meter install", "Billing setup"]
  },
  {
    id: "mc4-connectors-cables",
    type: "product",
    sortOrder: 6,
    active: true,
    title: "MC4 Connectors & Cables",
    badge: "Cables",
    warranty: "5 yr warranty",
    color: "#8a6a1a",
    icon: "⌁",
    description: "Weatherproof DC wiring connecting panels to inverter.",
    specs: [{ label: "Wire size", value: "4", unit: "mm2" }, { label: "Rating", value: "1000", unit: "V DC" }, { label: "IP Rating", value: "IP68", unit: "" }],
    benefits: ["UV and weather resistant", "Locking solar connector", "Outdoor-rated cable life", "Reduces DC loss with proper sizing"],
    install: ["Run from panel to inverter", "Sized by system current", "Managed with proper routing", "Earthing cable included"],
    process: ["Route planning", "Cable sizing", "Panel to DCDB", "DCDB to inverter", "Continuity test"]
  },
  {
    id: "mounting-structure",
    type: "product",
    sortOrder: 7,
    active: true,
    title: "Mounting Structure",
    badge: "Structure",
    warranty: "10 yr warranty",
    color: "#6a6a1a",
    icon: "△",
    description: "GI or aluminium frame system for secure panel installation.",
    specs: [{ label: "Material", value: "GI", unit: "/ Aluminium" }, { label: "Tilt", value: "10-25", unit: "deg" }, { label: "Wind load", value: "150", unit: "km/h" }],
    benefits: ["Anti-rust structure options", "Tilt planned for better yield", "Suitable for RCC and sheet roof", "Fast pre-engineered installation"],
    install: ["Roof type assessed first", "Structure designed per load", "Anchor bolts fixed to roof", "Panels clamped on rails"],
    process: ["Roof inspection", "Structure design", "Anchor fixing", "Rail installation", "Panel clamping"]
  },
  {
    id: "product-solar-water-pump",
    type: "product",
    sortOrder: 8,
    active: true,
    title: "Solar Water Pump",
    badge: "Pump",
    warranty: "3 yr warranty",
    color: "#1a5a9a",
    icon: "◌",
    description: "Solar-powered pump for agriculture and water supply.",
    specs: [{ label: "Power", value: "2.5", unit: "HP" }, { label: "Head", value: "50", unit: "m" }, { label: "Type", value: "Submersible", unit: "" }],
    benefits: ["Zero electricity bill for pumping", "Runs directly on solar panels", "Ideal for agriculture and borewell", "PM-KUSUM support where applicable"],
    install: ["Panel sizing by pump HP", "VFD controller included", "Pump installed in borewell", "Dry-run protection sensor"],
    process: ["Site survey", "Pump sizing", "Panel installation", "Controller setup", "Test run"]
  }
];

const statusFlow = ["Applied", "Contacted", "Site Visit Scheduled", "Site Visit Completed", "Quotation Sent", "Installation Started", "In Progress", "Completed"];
const productCompatibilityOptions = ["On-grid", "Hybrid", "Off-grid", "Solar Pump", "Commercial"];
const productIconOptions = ["panel", "inverter", "battery", "protection", "meter", "cable", "structure", "pump"];
const phonePattern = /^[6-9]\d{9}$/;
const pinPattern = /^\d{6}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const appState = {
  currentUser: null,
  bootstrap: { users: [], customers: [], employees: [], applications: [], notifications: [], services: [], products: [], businessSettings: {} },
  adminTab: "customer",
  dashboardFilter: { search: "", status: "all", assigned: "all" },
  adminEditor: {
    services: { selectedId: "", panel: "basic" },
    products: { selectedId: "", panel: "basic" }
  }
};

let pendingEditorFocus = null;

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const api = {
  enabled: window.location.protocol !== "file:",
  lastError: "",
  async request(path, options = {}) {
    if (!this.enabled) {
      this.lastError = "Please start python server.py to use login, apply, and dashboard.";
      return null;
    }
    try {
      this.lastError = "";
      const response = await fetch(path, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Server request failed.");
      return data;
    } catch (error) {
      this.lastError = error.message;
      return null;
    }
  },
  get(path) {
    return this.request(path);
  },
  post(path, body) {
    return this.request(path, { method: "POST", body: JSON.stringify(body) });
  }
};

async function init() {
  appState.currentUser = getSessionUser();
  bindCommon();
  await hydrate();

  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "services") initServicesPage();
  if (page === "products") initProductsPage();
  if (page === "auth") initAuthPage();
  if (page === "apply") initApplyPage();
  if (page === "dashboard") initDashboardPage();
}

async function hydrate() {
  const data = await api.get("/api/bootstrap");
  if (data) {
    appState.bootstrap = data;
    storage.set("kssBootstrap", data);
    return;
  }
  appState.bootstrap = storage.get("kssBootstrap", appState.bootstrap);
}

function syncBootstrap(data) {
  if (!data) return;
  appState.bootstrap = {
    users: data.users || appState.bootstrap.users || [],
    customers: data.customers || appState.bootstrap.customers || [],
    employees: data.employees || appState.bootstrap.employees || [],
    applications: data.applications || appState.bootstrap.applications || [],
    notifications: data.notifications || appState.bootstrap.notifications || [],
    services: data.services || appState.bootstrap.services || [],
    products: data.products || appState.bootstrap.products || [],
    businessSettings: data.businessSettings || appState.bootstrap.businessSettings || {}
  };
  storage.set("kssBootstrap", appState.bootstrap);
}

function bindCommon() {
  bindNav();
  bindFloatingContact();
  bindPasswordToggles();
  bindCopyActions();
  const logout = document.querySelector("[data-logout]");
  if (logout) logout.addEventListener("click", logoutUser);
}

function bindNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]") || document.querySelector(".site-nav");
  if (!nav) return;
  ensureHomeNavLink(nav);
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }));
}

function ensureHomeNavLink(nav) {
  const page = document.body.dataset.page || "";
  if (page === "home" || nav.querySelector("[data-home-link]")) return;
  nav.insertAdjacentHTML("afterbegin", `
    <a class="home-nav-link" href="/index.html" aria-label="Go to home page" title="Home" data-home-link>
      <span class="home-nav-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M3 10.8 12 3l9 7.8"/>
          <path d="M5.5 9.8V21h13V9.8"/>
          <path d="M9.5 21v-6h5v6"/>
        </svg>
      </span>
    </a>
  `);
}

function bindFloatingContact() {
  ensureFloatingContact();
  const root = document.querySelector("[data-contact-float]");
  const toggle = document.querySelector("[data-contact-float-toggle]");
  if (!root || !toggle) return;
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = root.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  root.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      root.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("click", (event) => {
    if (root.contains(event.target)) return;
    root.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    root.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

function ensureFloatingContact() {
  if (document.querySelector("[data-contact-float]")) return;
  const settings = appState.bootstrap.businessSettings || {};
  const phone = String(settings.businessMobile || KSS_PHONE).replace(/\D/g, "") || KSS_PHONE;
  const phoneWithCountry = phone.length === 10 ? `91${phone}` : phone;
  const email = settings.businessEmail || ADMIN_EMAIL;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="contact-float" data-contact-float>
      <button class="contact-float-main" type="button" aria-label="Open quick contact options" aria-expanded="false" data-contact-float-toggle>
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.63 2.65a2 2 0 0 1-.45 2.11L8.09 9.69a16 16 0 0 0 6.22 6.22l1.21-1.2a2 2 0 0 1 2.11-.45c.85.3 1.74.51 2.65.63A2 2 0 0 1 22 16.92z"/>
        </svg>
      </button>
      <div class="contact-float-menu" aria-label="Quick contact options">
        <a href="https://wa.me/${escapeAttr(phoneWithCountry)}" target="_blank" rel="noreferrer">WhatsApp</a>
        <a href="tel:+${escapeAttr(phoneWithCountry)}">Call</a>
        <a href="mailto:${escapeAttr(email)}">Mail</a>
      </div>
    </div>
  `);
}

function bindPasswordToggles() {
  document.querySelectorAll(".password-field:not([data-password-bound])").forEach((field) => {
    field.dataset.passwordBound = "true";
    const input = field.querySelector("input");
    const button = field.querySelector("[data-toggle-password]");
    if (!input || !button) return;
    button.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      button.textContent = input.type === "password" ? "Show" : "Hide";
    });
  });
}

function initHome() {
  renderMenusAndCards();
  renderLiveStats();
  renderHomeProductStats();
  initHeroSlider();
  initCalculator();
  bindDetailDialog();
  bindContactCards();
}

function initServicesPage() {
  renderMenusAndCards();
  const slug = currentServiceSlug();
  if (slug) renderServiceDetailPage(slug);
  else renderServicesPage();
}

function initProductsPage() {
  renderMenusAndCards();
  const slug = currentProductSlug();
  if (slug) renderProductDetailPage(slug);
  else renderProductsPage();
}

function renderMenusAndCards() {
  const serviceList = document.querySelector("[data-service-list]");
  const productList = document.querySelector("[data-product-list]");
  const serviceMenu = document.querySelector("[data-service-menu]");
  const productMenu = document.querySelector("[data-product-menu]");
  const services = activeServices();
  if (serviceList) serviceList.innerHTML = services.map(cardTemplate).join("");
  const products = activeProducts();
  if (productList) productList.innerHTML = products.map(cardTemplate).join("");
  if (serviceMenu) serviceMenu.innerHTML = services.map(serviceMenuTemplate).join("");
  if (productMenu) productMenu.innerHTML = products.map(productMenuTemplate).join("");
  document.querySelectorAll("[data-open-detail]").forEach((node) => node.addEventListener("click", openDetailFromClick));
}

function editableServices() {
  const saved = appState.bootstrap.services || [];
  const merged = new Map(defaultServices.map((service) => [service.id, service]));
  saved.forEach((service) => merged.set(service.id || makeSlug(service.title), { ...(merged.get(service.id) || {}), ...service }));
  return Array.from(merged.values())
    .map((service, index) => normalizeService(service, index))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function activeServices() {
  return editableServices().filter((service) => service.active !== false);
}

function editableProducts() {
  const saved = appState.bootstrap.products || [];
  const merged = new Map(defaultProducts.map((product) => [product.id, product]));
  saved.forEach((product) => merged.set(product.id || makeSlug(product.title), { ...(merged.get(product.id) || {}), ...product }));
  return Array.from(merged.values())
    .map((product, index) => normalizeProduct(product, index))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function activeProducts() {
  return editableProducts().filter((product) => product.active !== false);
}

function normalizeService(service, index = 0) {
  const title = service.title || `service-${index + 1}`;
  const slug = makeSlug(service.slug || service.id || title);
  const startingPrice = normalizePrice(service.startingPrice ?? service.starting_price ?? service.price ?? service.pricing);
  return {
    ...service,
    id: service.id || slug,
    slug,
    type: "service",
    sortOrder: Number(service.sortOrder || index + 1),
    active: service.active !== false,
    tagline: service.tagline || service.description || "",
    fullDescription: service.fullDescription || service.tagline || service.description || "",
    whoFor: service.whoFor || service.audience || "",
    details: normalizeList(service.details),
    benefits: normalizeList(service.benefits),
    process: normalizeSteps(service.process),
    documents: normalizeList(service.documents),
    startingPrice,
    pricing: service.pricing || formatStartingPrice(startingPrice),
    priceNote: service.priceNote || "Final price is confirmed after site visit and requirement check.",
    ctaPrimary: service.ctaPrimary || "Book free site visit",
    ctaSecondary: service.ctaSecondary || "WhatsApp us"
  };
}

function normalizeList(items) {
  return Array.isArray(items) ? items.map((item) => String(item).trim()).filter(Boolean) : [];
}

function normalizeSteps(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "string") return { name: item, detail: "" };
    return { name: String(item.name || "").trim(), detail: String(item.detail || item.description || "").trim() };
  }).filter((item) => item.name || item.detail);
}

function normalizePrice(value) {
  const digits = String(value ?? "").replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

function formatCurrency(value) {
  const number = Number(value || 0);
  if (!number) return "Custom quote";
  return `Rs ${number.toLocaleString("en-IN")}`;
}

function formatStartingPrice(value) {
  const label = formatCurrency(value);
  return label === "Custom quote" ? label : `${label} onwards`;
}

function normalizeProduct(product, index = 0) {
  const title = product.title || `product-${index + 1}`;
  const slug = makeSlug(product.slug || product.id || title);
  const startingPrice = normalizePrice(product.startingPrice ?? product.starting_price ?? product.price ?? product.pricing);
  return {
    ...product,
    id: product.id || slug,
    slug,
    type: "product",
    sortOrder: Number(product.sortOrder || index + 1),
    active: product.active !== false,
    fullDescription: product.fullDescription || product.description || "",
    categoryIcon: product.categoryIcon || product.iconName || product.icon || "panel",
    warranty: product.warranty || "Warranty available",
    color: product.color || "#9a5c12",
    startingPrice,
    pricing: product.pricing || formatStartingPrice(startingPrice),
    priceNote: product.priceNote || "Price varies by capacity, brand, and project requirement.",
    icon: product.icon || "▦",
    specs: normalizeSpecs(product.specs),
    benefits: normalizeList(product.benefits),
    compatibleWith: normalizeList(product.compatibleWith),
    install: normalizeList(product.install || product.details),
    process: normalizeList(product.process)
  };
}

function normalizeSpecs(specs) {
  if (!Array.isArray(specs)) return [];
  return specs.map((spec) => ({
    label: String(spec.label || spec.l || "").trim(),
    value: String(spec.value || spec.v || "").trim(),
    unit: String(spec.unit || spec.u || "").trim()
  })).filter((spec) => spec.label || spec.value || spec.unit);
}

function cardTemplate(item) {
  const product = item.type === "product" ? normalizeProduct(item) : null;
  if (item.type === "service") {
    const service = normalizeService(item);
    return `
      <a class="info-card" href="${escapeAttr(serviceUrl(service))}">
        <span class="tag">${escapeHtml(service.badge)}</span>
        <h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.description)}</p>
        <span class="details-link">View service details</span>
      </a>
    `;
  }
  return `
    <article class="info-card" data-open-detail="${escapeHtml(item.title)}">
      ${product ? `<div class="product-card-icon" style="--product-color:${escapeAttr(product.color)}">${escapeHtml(product.icon)}</div>` : ""}
      <span class="tag">${escapeHtml(item.badge)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <span class="details-link">Open full details</span>
    </article>
  `;
}

function serviceMenuTemplate(item) {
  const service = normalizeService(item);
  return `<a href="${escapeAttr(serviceUrl(service))}">${escapeHtml(service.title)}</a>`;
}

function productMenuTemplate(item) {
  const product = normalizeProduct(item);
  return `<a href="${escapeAttr(productUrl(product))}">${escapeHtml(product.title)}</a>`;
}

function menuTemplate(item, sectionId) {
  return `<a href="#${sectionId}" data-open-detail="${escapeHtml(item.title)}">${escapeHtml(item.title)}</a>`;
}

function renderServicesPage() {
  const services = activeServices();
  const root = document.querySelector("[data-services-page]");
  if (!root) return;
  root.innerHTML = `
    <section class="services-list-hero">
      <div class="services-page-wrap">
        <p class="eyebrow">Our services</p>
        <h1>Every solar solution you need, under one roof.</h1>
        <p>From homes to farms to businesses &mdash; we design, install and maintain it all.</p>
      </div>
    </section>
    <section class="services-list-section">
      <div class="services-page-wrap">
        <div class="services-list-grid">
          ${services.map((service) => serviceListingCard(normalizeService(service))).join("") || `<p class="muted">No active services are available right now.</p>`}
        </div>
      </div>
    </section>
  `;
}

function serviceListingCard(item) {
  return `
    <article class="service-list-card">
      <span class="tag">${escapeHtml(item.badge || "Solar service")}</span>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.description)}</p>
      <a href="${escapeAttr(serviceUrl(item))}">Open full details &rarr;</a>
    </article>
  `;
}

function servicePageBlock(title, body) {
  return `<section class="service-page-block"><h3>${escapeHtml(title)}</h3>${body}</section>`;
}

function renderServiceDetailPage(slug) {
  const root = document.querySelector("[data-services-page]");
  const services = activeServices().map((service) => normalizeService(service));
  const item = services.find((service) => service.slug === slug || service.id === slug);
  if (!root) return;
  if (!item) {
    root.innerHTML = `
      <section class="service-detail-page">
        <div class="services-page-wrap">
          <a class="service-back-link" href="/services">&larr; Back to all services</a>
          <h1>Service not found</h1>
          <p class="muted">This service may be inactive or unavailable.</p>
        </div>
      </section>
    `;
    return;
  }
  root.innerHTML = `
    <article class="service-detail-page">
      <div class="services-page-wrap service-detail-wrap">
        <a class="service-back-link" href="/services">&larr; Back to all services</a>
        <span class="tag">${escapeHtml(item.badge || "Solar service")}</span>
        <h1>${escapeHtml(item.title)}</h1>
        <p class="service-detail-intro">${escapeHtml(item.description || item.fullDescription)}</p>
        <section class="service-detail-panel">
          <h2>What's included</h2>
          <div class="service-check-grid">
            ${item.details.map((detail) => checkItem(detail)).join("") || `<p class="muted">Included items will be confirmed during consultation.</p>`}
          </div>
        </section>
        <section class="service-detail-panel">
          <h2>Key benefits</h2>
          <div class="service-benefit-list">
            ${item.benefits.map((benefit) => checkItem(benefit, "benefit-row")).join("") || `<p class="muted">Benefits will be confirmed after a site assessment.</p>`}
          </div>
        </section>
        <section class="service-detail-panel">
          <h2>How it works - your journey</h2>
          <div class="service-timeline">
            ${item.process.map((step, index) => `
              <div class="service-timeline-step">
                <span>${index + 1}</span>
                <div><strong>${escapeHtml(step.name)}</strong><p>${escapeHtml(step.detail)}</p></div>
              </div>
            `).join("") || `<p class="muted">KSS will guide you from site visit to handover.</p>`}
          </div>
        </section>
        <section class="service-detail-panel">
          <h2>Documents you'll need</h2>
          <div class="service-check-grid">
            ${item.documents.map((documentName) => checkItem(documentName, "doc-row")).join("") || `<p class="muted">Documents will be confirmed based on service and subsidy eligibility.</p>`}
          </div>
        </section>
        <section class="service-detail-panel">
          <h2>Pricing</h2>
          <div class="service-price-card">
            <span>Starting from</span>
            <strong>${escapeHtml(servicePriceLabel(item))}</strong>
          </div>
          <p>${escapeHtml(item.priceNote)}</p>
        </section>
        <div class="service-detail-actions">
          <a class="button primary" href="${escapeAttr(whatsappUrl(`Hi KSS, I want to book a free site visit for ${item.title}`))}" target="_blank" rel="noreferrer">${escapeHtml(item.ctaPrimary || "Book free site visit")}</a>
          <a class="button secondary" href="${escapeAttr(whatsappUrl(`Hi KSS, I want details for ${item.title}`))}" target="_blank" rel="noreferrer">${escapeHtml(item.ctaSecondary || "WhatsApp us")}</a>
        </div>
      </div>
    </article>
  `;
}

function currentServiceSlug() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const match = path.match(/^\/services\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : "";
}

function serviceUrl(service) {
  return `/services/${makeSlug(service.slug || service.id || service.title)}`;
}

function servicePriceLabel(service) {
  return service.startingPrice ? formatStartingPrice(service.startingPrice) : (service.pricing || "Custom quote");
}

function renderProductsPage() {
  const products = activeProducts();
  const root = document.querySelector("[data-products-page]");
  if (!root) return;
  root.innerHTML = `
    <section class="products-list-hero">
      <div class="products-page-wrap">
        <p class="product-eyebrow">Products</p>
        <h1>Smart solar products for every energy need.</h1>
        <p>High-performance components for homes, businesses and farms.</p>
      </div>
    </section>
    <section class="products-list-section">
      <div class="products-page-wrap">
        <div class="products-list-grid">
          ${products.map((product) => productListingCard(normalizeProduct(product))).join("") || `<p class="muted">No active products are available right now.</p>`}
        </div>
      </div>
    </section>
  `;
}

function productListingCard(item) {
  return `
    <article class="product-list-card">
      <div class="product-list-icon">${escapeHtml(productIconLabel(item.categoryIcon))}</div>
      <span class="product-tag">${escapeHtml(item.badge || "Product")}</span>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.description)}</p>
      <a href="${escapeAttr(productUrl(item))}">Open full details &rarr;</a>
    </article>
  `;
}

function renderProductDetailPage(slug) {
  const root = document.querySelector("[data-products-page]");
  const products = activeProducts().map((product) => normalizeProduct(product));
  const item = products.find((product) => product.slug === slug || product.id === slug);
  if (!root) return;
  if (!item) {
    root.innerHTML = `
      <section class="product-detail-page">
        <div class="products-page-wrap">
          <a class="product-back-link" href="/products">&larr; Back to all products</a>
          <h1>Product not found</h1>
          <p class="muted">This product may be inactive or unavailable.</p>
        </div>
      </section>
    `;
    return;
  }
  root.innerHTML = `
    <article class="product-detail-page">
      <div class="products-page-wrap product-detail-wrap">
        <a class="product-back-link" href="/products">&larr; Back to all products</a>
        <span class="product-tag">${escapeHtml(item.badge || "Product")}</span>
        <h1>${escapeHtml(item.title)}</h1>
        <p class="product-detail-intro">${escapeHtml(item.fullDescription || item.description)}</p>
        <section class="product-detail-panel">
          <h2>Specifications</h2>
          <div class="product-spec-detail-grid">
            ${item.specs.map((spec) => `
              <div>
                <span>${escapeHtml(spec.label)}</span>
                <strong>${escapeHtml([spec.value, spec.unit].filter(Boolean).join(" "))}</strong>
              </div>
            `).join("") || `<p class="muted">Specifications will be updated by the KSS team.</p>`}
          </div>
        </section>
        <section class="product-detail-panel">
          <h2>Key features</h2>
          <div class="product-feature-list">
            ${item.benefits.map((feature) => amberCheckItem(feature)).join("") || `<p class="muted">Features will be confirmed during product selection.</p>`}
          </div>
        </section>
        <section class="product-detail-panel">
          <h2>Compatible with</h2>
          <div class="product-compatible-tags">
            ${(item.compatibleWith.length ? item.compatibleWith : item.install).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") || `<p class="muted">Compatibility depends on your system design.</p>`}
          </div>
        </section>
        <section class="product-detail-panel">
          <h2>Pricing</h2>
          <div class="product-price-card">
            <span>Starting from</span>
            <strong>${escapeHtml(productPriceLabel(item))}</strong>
          </div>
          <p>${escapeHtml(item.priceNote)}</p>
        </section>
        <div class="product-detail-actions">
          <a class="button product-primary" href="${escapeAttr(whatsappUrl(`Hi KSS, I want a quote for ${item.title}`))}" target="_blank" rel="noreferrer">Get a quote</a>
          <a class="button product-secondary" href="${escapeAttr(whatsappUrl(`Hi KSS, I want details for ${item.title}`))}" target="_blank" rel="noreferrer">WhatsApp us</a>
        </div>
      </div>
    </article>
  `;
}

function renderHomeProductStats() {
  const products = activeProducts();
  const count = document.querySelector("[data-product-type-count]");
  const warranty = document.querySelector("[data-product-warranty]");
  if (count) count.textContent = `${Math.max(products.length, 8)}+`;
  if (warranty) {
    const panel = products.find((product) => /panel/i.test(product.title) && product.warranty);
    warranty.textContent = panel?.warranty?.replace(/\s+/g, "") || "25yr";
  }
}

function amberCheckItem(text) {
  return `<div class="product-check-row"><span aria-hidden="true">✓</span><p>${escapeHtml(text)}</p></div>`;
}

function currentProductSlug() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const match = path.match(/^\/products\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : "";
}

function productUrl(product) {
  return `/products/${makeSlug(product.slug || product.id || product.title)}`;
}

function productPriceLabel(product) {
  return product.startingPrice ? formatStartingPrice(product.startingPrice) : (product.pricing || "Custom quote");
}

function productIconLabel(icon) {
  const key = String(icon || "").toLowerCase();
  if (key.includes("inverter")) return "⚡";
  if (key.includes("battery") || key.includes("storage")) return "▣";
  if (key.includes("pump")) return "◌";
  if (key.includes("meter")) return "↔";
  if (key.includes("protection")) return "⛨";
  if (key.includes("structure")) return "△";
  if (key.includes("cable")) return "⌁";
  return "▦";
}

function whatsappNumber() {
  const settings = appState.bootstrap.businessSettings || {};
  const raw = settings.whatsappNumber || settings.businessMobile || KSS_PHONE;
  const digits = String(raw).replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits || `91${KSS_PHONE}`;
}

function whatsappUrl(text) {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(text)}`;
}

function serviceImage(id, index) {
  const images = {
    "on-grid-solar": "assets/solar-slide-rooftop.png",
    "hybrid-solar": "assets/solar-slide-home.png",
    "off-grid-solar": "assets/solar-slide-environment.png",
    "solar-water-pump": "assets/solar-slide-agri.png",
    "commercial-solar": "assets/solar-slide-install.png",
    "amc-maintenance": "assets/renewable-energy.png"
  };
  const fallback = ["assets/solar-slide-home.png", "assets/solar-slide-rooftop.png", "assets/solar-slide-install.png"];
  return images[id] || fallback[index % fallback.length];
}

function bindServicePageActions() {
  document.querySelectorAll("[data-service-apply]").forEach((link) => {
    link.addEventListener("click", () => storage.set("kssSelectedService", link.dataset.serviceApply));
  });
}

function focusLinkedService() {
  const id = decodeURIComponent(window.location.hash || "").replace("#", "");
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  window.setTimeout(() => {
    target.classList.add("focused");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

function openDetailFromClick(event) {
  const title = event.currentTarget.dataset.openDetail;
  const isLink = event.currentTarget.tagName.toLowerCase() === "a";
  if (!isLink) event.preventDefault();
  window.setTimeout(() => openDetail(title), isLink ? 180 : 0);
}

function openDetail(title) {
  const item = [...activeServices(), ...activeProducts()].find((entry) => entry.title === title);
  const dialog = document.querySelector("[data-detail-dialog]");
  const content = document.querySelector("[data-detail-content]");
  if (!item || !dialog || !content) return;
  if (item.type === "service") {
    content.innerHTML = serviceDetailTemplate(normalizeService(item));
    bindServiceDetailActions(item);
    dialog.showModal();
    return;
  }
  if (item.type === "product") {
    content.innerHTML = productDetailTemplate(normalizeProduct(item));
    bindProductDetailActions(item);
    dialog.showModal();
    return;
  }
  content.innerHTML = `
    <div class="detail-body">
      <span class="tag">${escapeHtml(item.badge)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p class="muted">${escapeHtml(item.description)}</p>
      <div class="detail-columns">
        <article><h4>Details</h4><ul>${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul></article>
        <article><h4>Benefits</h4><ul>${item.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join("")}</ul></article>
        <article><h4>Work flow</h4><ul>${item.process.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul></article>
        <article><h4>Next action</h4><p class="muted">Register, login, then submit a verified application.</p><a class="button primary" href="apply.html">Apply for this</a></article>
      </div>
    </div>
  `;
  dialog.showModal();
}

function productDetailTemplate(item) {
  return `
    <div class="product-detail" style="--product-color:${escapeAttr(item.color)}">
      <header class="product-detail-header">
        <div class="product-icon">${escapeHtml(item.icon)}</div>
        <div>
          <div class="product-badges"><span>${escapeHtml(item.badge)}</span><span>${escapeHtml(item.warranty)}</span></div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
      </header>
      <div class="product-detail-body">
        <div class="product-spec-grid">
          ${item.specs.slice(0, 3).map((spec) => `<article><span>${escapeHtml(spec.label)}</span><strong>${escapeHtml(spec.value)} <small>${escapeHtml(spec.unit)}</small></strong></article>`).join("")}
        </div>
        <div class="product-two-col">
          ${productInfoBox("Benefits", item.benefits)}
          ${productInfoBox("Installation details", item.install)}
        </div>
        <section class="product-workflow">
          <h4>Installation workflow</h4>
          <div class="product-steps">${item.process.map((step, index) => `
            <div class="product-step"><span>${index + 1}</span><p>${escapeHtml(step)}</p></div>
          `).join("")}</div>
        </section>
        <div class="service-cta-row">
          <a class="button primary" style="background:${escapeAttr(item.color)}" href="apply.html?product=${encodeURIComponent(item.title)}">Apply for this</a>
          <a class="button secondary" href="https://wa.me/91${KSS_PHONE}?text=${encodeURIComponent(`Hi KSS, I want details for ${item.title}`)}" target="_blank" rel="noreferrer">WhatsApp us</a>
        </div>
      </div>
    </div>
  `;
}

function productInfoBox(title, items) {
  return `<article><h4>${escapeHtml(title)}</h4><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>`;
}

function bindProductDetailActions(item) {
  const primary = document.querySelector("[data-detail-dialog] .service-cta-row .button.primary");
  if (!primary) return;
  primary.addEventListener("click", () => storage.set("kssSelectedProduct", item.title));
}

function serviceDetailTemplate(item) {
  return `
    <div class="service-detail">
      <header class="service-detail-header">
        <span class="tag">${escapeHtml(item.badge)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.tagline || item.description)}</p>
      </header>
      <div class="service-detail-body">
        ${serviceSection("What's included", `<div class="check-grid">${item.details.map((detail) => checkItem(detail)).join("")}</div>`)}
        ${serviceSection("Key benefits", `<div class="benefit-list">${item.benefits.map((benefit) => checkItem(benefit, "benefit-row")).join("")}</div>`)}
        ${serviceSection("How it works - your journey", `<div class="journey-list">${item.process.map((step, index) => `
          <div class="journey-step">
            <span>${index + 1}</span>
            <div><strong>${escapeHtml(step.name)}</strong><p>${escapeHtml(step.detail)}</p></div>
          </div>
        `).join("")}</div>`)}
        ${serviceSection("Documents you'll need", `<div class="docs-grid-detail">${item.documents.map((documentName) => checkItem(documentName, "doc-row")).join("")}</div>`)}
        ${serviceSection("Pricing", `
          <div class="price-row-detail"><span>Starting from</span><strong>${escapeHtml(item.pricing)}</strong></div>
          <p class="price-note-detail">${escapeHtml(item.priceNote)}</p>
        `)}
        <div class="service-cta-row">
          <a class="button primary" href="apply.html?service=${encodeURIComponent(item.title)}">${escapeHtml(item.ctaPrimary)}</a>
          <a class="button secondary" href="https://wa.me/91${KSS_PHONE}?text=${encodeURIComponent(`Hi KSS, I want details for ${item.title}`)}" target="_blank" rel="noreferrer">${escapeHtml(item.ctaSecondary)}</a>
        </div>
      </div>
    </div>
  `;
}

function serviceSection(title, body) {
  return `<section class="service-section"><h4>${escapeHtml(title)}</h4>${body}</section>`;
}

function checkItem(text, className = "check-item") {
  return `<div class="${className}"><span aria-hidden="true">✓</span><p>${escapeHtml(text)}</p></div>`;
}

function bindServiceDetailActions(item) {
  const primary = document.querySelector("[data-detail-dialog] .service-cta-row .button.primary");
  if (!primary) return;
  primary.addEventListener("click", () => storage.set("kssSelectedService", item.title));
}

function bindDetailDialog() {
  const dialog = document.querySelector("[data-detail-dialog]");
  const close = document.querySelector("[data-close-dialog]");
  if (!dialog || !close) return;
  close.addEventListener("click", () => dialog.close());
}

function renderLiveStats() {
  const applications = appState.bootstrap.applications || [];
  const completed = applications.filter((item) => item.status === "Completed").length;
  const active = applications.filter((item) => !["Completed", "Cancelled"].includes(item.status)).length;
  const liveMetrics = document.querySelector("[data-live-metrics]");
  const aboutStats = document.querySelector("[data-about-stats]");
  const whyInstallations = document.querySelector("[data-why-installations]");
  if (liveMetrics) liveMetrics.innerHTML = `<div><strong>${completed}</strong><span>Completed installations</span></div>`;
  if (whyInstallations) whyInstallations.textContent = `${Math.max(completed, 100)}+`;
  if (aboutStats) {
    aboutStats.innerHTML = `
      <article><strong>4.8★</strong><span>Google rating</span><small>68 verified reviews</small></article>
      <article><strong>${Math.max(completed, 25)}+</strong><span>Total installations</span><small>Growing monthly</small></article>
      <article><strong>${active}</strong><span>Work in progress</span><small>Live tracked projects</small></article>
    `;
  }
}

function initHeroSlider() {
  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = document.querySelector("[data-slider-dots]");
  const quoteKicker = document.querySelector("[data-quote-kicker]");
  const quoteText = document.querySelector("[data-quote-text]");
  const quoteSubtext = document.querySelector("[data-quote-subtext]");
  if (!slides.length || !dots) return;
  let activeIndex = 0;
  let timer;
  dots.innerHTML = slides.map((_, index) => `<button class="${index === 0 ? "active" : ""}" type="button" aria-label="Show solar slide ${index + 1}" data-slide-dot="${index}"></button>`).join("");
  const buttons = Array.from(dots.querySelectorAll("[data-slide-dot]"));
  const show = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === activeIndex));
    buttons.forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === activeIndex));
    const quote = heroQuotes[activeIndex % heroQuotes.length];
    if (quoteKicker) quoteKicker.textContent = quote.kicker;
    if (quoteText) quoteText.textContent = quote.quote;
    if (quoteSubtext) quoteSubtext.textContent = quote.subtext;
  };
  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(activeIndex + 1), 5200);
  };
  buttons.forEach((button) => button.addEventListener("click", () => {
    show(Number(button.dataset.slideDot));
    start();
  }));
  show(0);
  start();
}

function initCalculator() {
  const form = document.querySelector("[data-solar-calculator]");
  const result = document.querySelector("[data-calculator-result]");
  if (!form || !result) return;
  form.addEventListener("input", () => {
    const bill = Number(form.elements.bill.value || 0);
    const unitRate = Number(form.elements.unitRate.value || 8);
    const units = unitRate ? bill / unitRate : 0;
    const kw = Math.max(1, Math.ceil(units / 120));
    const monthlySaving = Math.round(Math.min(bill * 0.82, kw * 1100));
    const yearlySaving = monthlySaving * 12;
    result.innerHTML = `
      <div><strong>${kw} kW</strong><span>Suggested capacity</span></div>
      <div><strong>Rs ${monthlySaving.toLocaleString("en-IN")}</strong><span>Estimated monthly saving</span></div>
      <div><strong>Rs ${yearlySaving.toLocaleString("en-IN")}</strong><span>Estimated yearly saving</span></div>
    `;
  });
  form.dispatchEvent(new Event("input"));
}

function initAuthPage() {
  const loginForm = document.querySelector("[data-login-form]");
  const registerForm = document.querySelector("[data-register-form]");
  bindLoginModes();
  if (loginForm) loginForm.addEventListener("submit", submitLogin);
  if (registerForm) registerForm.addEventListener("submit", submitRegister);
}

function bindLoginModes() {
  const form = document.querySelector("[data-login-form]");
  if (!form) return;
  const help = document.querySelector("[data-login-help]");
  const helpText = {
    customer: "Already registered? Login with your mobile number/email and password.",
    employee: "Employees are created by admin only.",
    admin: "Admin is private. Use the backend seeded admin account."
  };
  document.querySelectorAll("[data-login-role]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-login-role]").forEach((item) => item.classList.toggle("active", item === button));
      form.elements.role.value = button.dataset.loginRole;
      form.elements.username.placeholder = button.dataset.loginRole === "customer" ? "10 digit mobile or email" : "Phone or email";
      if (help) help.textContent = helpText[button.dataset.loginRole];
    });
  });
}

async function submitRegister(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const customer = {
    name: form.elements.name.value.trim(),
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim(),
    password: form.elements.password.value
  };
  const error = validatePerson(customer, true);
  if (error) return showToast(error);
  const saved = await api.post("/api/register", customer);
  if (!saved) return showToast(api.lastError);
  syncBootstrap(saved);
  form.reset();
  showToast("Registration complete. Now login to apply.");
  const login = document.querySelector("[data-login-form]");
  if (login) {
    login.elements.role.value = "customer";
    login.elements.username.value = customer.phone;
    login.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

async function submitLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const role = form.elements.role.value;
  const username = form.elements.username.value.trim();
  const password = form.elements.password.value;
  if (role === "customer" && !phonePattern.test(username) && !emailPattern.test(username)) {
    return showToast("Use registered 10 digit mobile number or valid email.");
  }
  const data = await api.post("/api/login", { role, username, password });
  if (!data?.user) return showToast(api.lastError || "Login failed.");
  syncBootstrap(data);
  setSessionUser(data.user);
  window.location.href = role === "customer" ? "apply.html" : (role === "admin" ? "admin.html" : "employee.html");
}

function initApplyPage() {
  if (!appState.currentUser || appState.currentUser.role !== "customer") {
    showApplyGate();
    return;
  }
  renderApplyForm();
}

function showApplyGate() {
  const root = document.querySelector("[data-apply-page]");
  if (!root) return;
  root.innerHTML = `
    <section class="section band auth-required">
      <div class="section-heading">
        <p class="eyebrow">Login Required</p>
        <h2>Register and login before applying.</h2>
        <p>Applications need verified contact details so KSS admin can call, email, and visit the correct address.</p>
      </div>
      <div class="apply-gate active">
        <h3>Customer access needed</h3>
        <p>Without customer registration and login, application submission is blocked.</p>
        <div class="apply-gate-actions">
          <a class="button primary" href="auth.html">Login / Register</a>
          <a class="button secondary" href="index.html">Back to website</a>
        </div>
      </div>
    </section>
  `;
}

function renderApplyForm() {
  const root = document.querySelector("[data-apply-page]");
  if (!root) return;
  const services = activeServices();
  const selectedService = new URLSearchParams(window.location.search).get("service") || storage.get("kssSelectedService", "");
  root.innerHTML = `
    <section class="section band" id="apply">
      <div class="section-heading">
        <p class="eyebrow">Apply Now</p>
        <h2>Verified solar application</h2>
        <p>Use correct mobile, email, pincode, and documents so admin can contact you quickly.</p>
      </div>
      <form class="application-form full-application" data-application-form>
        <div class="form-section">
          <h3>Customer details</h3>
          <label>Name <input name="name" required minlength="2" value="${escapeAttr(appState.currentUser.name || "")}" placeholder="Customer full name"></label>
          <label>Mobile number <input name="phone" required pattern="[6-9][0-9]{9}" maxlength="10" inputmode="numeric" value="${escapeAttr(appState.currentUser.phone || "")}" placeholder="10 digit mobile number"></label>
          <label>Email <input name="email" type="email" required value="${escapeAttr(appState.currentUser.email || "")}" placeholder="active email address"></label>
        </div>
        <div class="form-section">
          <h3>Complete address</h3>
          <label>House / street / landmark <textarea name="addressLine" required placeholder="House no, street, landmark"></textarea></label>
          <label>Village / city <input name="villageCity" required placeholder="Village or city"></label>
          <label>District <input name="district" required placeholder="District"></label>
          <label>State <input name="state" required value="Odisha" placeholder="State"></label>
          <label>Pincode <input name="pincode" required pattern="[0-9]{6}" maxlength="6" inputmode="numeric" placeholder="6 digit pincode"></label>
          <label>Rooftop type
            <select name="roofType" required>
              <option value="">Choose rooftop type</option>
              <option>RCC roof</option>
              <option>Tin shed</option>
              <option>Commercial roof</option>
              <option>Ground mount</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <div class="form-section">
          <h3>Solar requirement</h3>
          <label>Service <select name="service" required>${services.map((service) => `<option ${selectedService === service.title ? "selected" : ""}>${escapeHtml(service.title)}</option>`).join("")}</select></label>
          <label>Monthly electricity bill <input name="monthlyBill" type="number" min="0" placeholder="Amount in rupees"></label>
          <label>Required capacity <input name="capacity" placeholder="Example: 3 KW, 5 KW"></label>
          <label>Preferred date <input name="preferredDate" type="date"></label>
          <label>Preferred time
            <select name="preferredTime">
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </label>
          <label>Message <textarea name="message" placeholder="Any extra detail for admin"></textarea></label>
        </div>
        <div class="form-section">
          <h3>Documents</h3>
          <p class="muted">PDF, JPG, PNG, or WebP. Each file should be below 5MB.</p>
          <div class="document-grid">
            ${documentFields().map(([name, label, required]) => `<label>${label} <input name="${name}" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" ${required ? "required" : ""}></label>`).join("")}
          </div>
        </div>
        <label class="checkbox"><input name="consent" type="checkbox" required> I confirm the details are correct and KSS can contact me.</label>
        <div class="form-actions">
          <a class="button secondary" href="index.html">Back</a>
          <button class="button primary" type="submit" data-submit-application>Submit Application</button>
        </div>
      </form>
    </section>
  `;
  document.querySelector("[data-application-form]").addEventListener("submit", submitApplication);
}

function documentFields() {
  return [
    ["aadhar", "Aadhar", true],
    ["pan", "PAN", true],
    ["bankPassbook", "Bank passbook", true],
    ["electricityBill", "Electricity bill", true],
    ["rooftopGpsPhoto", "Rooftop GPS photo", true],
    ["homePhoto", "Home photo", false],
    ["signaturePhoto", "Signature photo", true]
  ];
}

async function submitApplication(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  data.customerId = appState.currentUser.id;
  const error = validateApplication(data);
  if (error) return showToast(error);
  const button = form.querySelector("[data-submit-application]");
  button.disabled = true;
  button.textContent = "Submitting...";
  try {
    data.documents = await collectDocuments(form);
    const saved = await api.post("/api/applications", data);
    if (!saved) return showToast(api.lastError || "Application could not be saved.");
    syncBootstrap(saved);
    showToast("Application submitted. Admin notification created.");
    window.setTimeout(() => { window.location.href = "dashboard.html"; }, 900);
  } catch (error) {
    showToast(error.message || "Document upload failed.");
  } finally {
    button.disabled = false;
    button.textContent = "Submit Application";
  }
}

async function collectDocuments(form) {
  const documents = {};
  for (const [name] of documentFields()) {
    const file = form.elements[name]?.files?.[0];
    if (!file) continue;
    documents[name] = await fileToPayload(file);
  }
  return documents;
}

function fileToPayload(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) reject(new Error(`${file.name} is larger than 5MB.`));
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, data: reader.result });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function initDashboardPage() {
  if (!appState.currentUser) {
    window.location.href = "auth.html";
    return;
  }
  renderDashboard();
}

function renderDashboard(tab = appState.adminTab) {
  const user = appState.currentUser;
  if (user.role === "admin") {
    appState.adminTab = tab;
    renderAdminDashboard(tab);
  } else if (user.role === "employee") {
    renderEmployeeDashboard();
  } else {
    renderCustomerDashboard();
  }
}

function dashboardShell({ title, subtitle, tabs = [], activeTab = "", content }) {
  const root = document.querySelector("[data-dashboard]");
  root.innerHTML = `
    <section class="dashboard-shell" data-dashboard-shell>
      <div class="dashboard-topbar">
        <div><p class="eyebrow">${escapeHtml(appState.currentUser.role)} panel</p><h3>${escapeHtml(title)}</h3><p class="muted">${escapeHtml(subtitle)}</p></div>
        <button class="button secondary" type="button" data-logout>Logout</button>
      </div>
      ${tabs.length ? `<div class="dashboard-tabs">${tabs.map(([id, label]) => `<button class="${id === activeTab ? "active" : ""}" type="button" data-dashboard-tab="${id}">${escapeHtml(label)}</button>`).join("")}</div>` : ""}
      <div class="dashboard-tab-content">${content}</div>
    </section>
  `;
  bindCommon();
  document.querySelectorAll("[data-dashboard-tab]").forEach((button) => button.addEventListener("click", () => renderDashboard(button.dataset.dashboardTab)));
}

function renderAdminDashboard(tab) {
  const content = tab === "employee" ? employeeManager() : tab === "services" ? serviceManager() : tab === "products" ? productManager() : tab === "notifications" ? notificationTable() : applicationsManager(true);
  dashboardShell({
    title: "Admin Dashboard",
    subtitle: "Search, assign, update status, edit website services, and track verified applications.",
    tabs: [["customer", "Applications"], ["employee", "Employees"], ["services", "Services"], ["products", "Products"], ["notifications", "Notifications"]],
    activeTab: tab,
    content
  });
  bindDashboardFilters();
  bindApplicationActions();
  bindEmployeeForm();
  bindServiceForms();
  bindProductForms();
  bindAdminEditorShell();
}

function renderEmployeeDashboard() {
  dashboardShell({
    title: "Employee Dashboard",
    subtitle: "Work on assigned customer applications and update progress notes.",
    content: applicationsManager(true, true)
  });
  bindDashboardFilters();
  bindApplicationActions();
}

function renderCustomerDashboard() {
  const apps = appState.bootstrap.applications.filter((item) => item.phone === appState.currentUser.phone);
  dashboardShell({
    title: "Customer Dashboard",
    subtitle: "Track your application status and uploaded documents.",
    content: `
      <div class="card-grid compact">
        ${apps.map(customerApplicationCard).join("") || `<article class="work-card"><h4>No application yet</h4><p class="muted">Submit a solar application and it will show here.</p><a class="button primary" href="apply.html">Apply Now</a></article>`}
      </div>
    `
  });
}

function customerApplicationCard(item) {
  return `
    <article class="work-card">
      <span class="${statusClass(item.status)}">${escapeHtml(item.status)}</span>
      <h4>${escapeHtml(item.service)}</h4>
      <p class="muted">Application ID: ${escapeHtml(item.id)}</p>
      <p>${escapeHtml(item.notes || "Application received.")}</p>
      <div class="mini-timeline">${statusFlow.map((status) => `<span class="${statusFlow.indexOf(status) <= statusFlow.indexOf(item.status) ? "done" : ""}">${escapeHtml(status)}</span>`).join("")}</div>
    </article>
  `;
}

function applicationsManager(editable, employeeOnly = false) {
  const employees = appState.bootstrap.users.filter((user) => user.role === "employee" && user.active);
  const apps = filteredApplications(employeeOnly);
  return `
    <div class="dashboard-grid">
      <article><strong>${appState.bootstrap.applications.length}</strong><span>Total applications</span></article>
      <article><strong>${appState.bootstrap.applications.filter((item) => item.status === "Completed").length}</strong><span>Completed</span></article>
      <article><strong>${appState.bootstrap.applications.filter((item) => !["Completed", "Cancelled"].includes(item.status)).length}</strong><span>Active work</span></article>
    </div>
    <div class="dashboard-tools">
      <label>Search <input data-filter-search placeholder="Name, phone, ID, address" value="${escapeAttr(appState.dashboardFilter.search)}"></label>
      <label>Status <select data-filter-status><option value="all">All status</option>${["Cancelled", ...statusFlow].map((status) => `<option ${appState.dashboardFilter.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
      <label>Assigned <select data-filter-assigned><option value="all">All employees</option><option value="">Unassigned</option>${employees.map((employee) => `<option value="${escapeAttr(employee.phone)}" ${appState.dashboardFilter.assigned === employee.phone ? "selected" : ""}>${escapeHtml(employee.name)}</option>`).join("")}</select></label>
    </div>
    <div class="application-list">
      ${apps.map((item) => applicationRow(item, employees, editable)).join("") || `<div class="empty-state">No matching applications.</div>`}
    </div>
  `;
}

function filteredApplications(employeeOnly) {
  const { search, status, assigned } = appState.dashboardFilter;
  const needle = search.toLowerCase();
  return appState.bootstrap.applications.filter((item) => {
    if (employeeOnly && item.assignedTo && item.assignedTo !== appState.currentUser.phone) return false;
    if (status !== "all" && item.status !== status) return false;
    if (assigned !== "all" && (item.assignedTo || "") !== assigned) return false;
    const text = [item.id, item.name, item.phone, item.email, item.service, item.address, item.pincode].join(" ").toLowerCase();
    return !needle || text.includes(needle);
  });
}

function applicationRow(item, employees, editable) {
  const docs = Object.entries(item.documents || {});
  return `
    <article class="application-card">
      <div class="application-main">
        <span class="${statusClass(item.status)}">${escapeHtml(item.status)}</span>
        <h4>${escapeHtml(item.name)} <small>${escapeHtml(item.id)}</small></h4>
        <p>${escapeHtml(item.service)} | ${escapeHtml(item.phone)} | ${escapeHtml(item.email)}</p>
        <p class="muted">${escapeHtml(item.address)}</p>
        <p>${escapeHtml(item.notes || "No notes yet.")}</p>
        <div class="document-links">${docs.map(([key, doc]) => `<a href="${escapeAttr(doc.url)}" target="_blank" rel="noreferrer">${escapeHtml(labelFromKey(key))}</a>`).join("") || `<span>No documents</span>`}</div>
      </div>
      ${editable ? `
        <form class="application-actions" data-application-action="${escapeAttr(item.id)}">
          <label>Status <select name="status">${["Cancelled", ...statusFlow].map((status) => `<option ${item.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
          <label>Assign <select name="assignedTo"><option value="">Unassigned</option>${employees.map((employee) => `<option value="${escapeAttr(employee.phone)}" ${item.assignedTo === employee.phone ? "selected" : ""}>${escapeHtml(employee.name)}</option>`).join("")}</select></label>
          <label>Notes <textarea name="notes" placeholder="Call notes, visit update, document issue">${escapeHtml(item.notes || "")}</textarea></label>
          <div class="row-actions">
            <button type="submit">Save update</button>
            <button type="button" data-next-status="${escapeAttr(item.id)}">Next status</button>
          </div>
        </form>
      ` : ""}
    </article>
  `;
}

function bindDashboardFilters() {
  const search = document.querySelector("[data-filter-search]");
  const status = document.querySelector("[data-filter-status]");
  const assigned = document.querySelector("[data-filter-assigned]");
  if (search) search.addEventListener("input", () => {
    appState.dashboardFilter.search = search.value;
    renderDashboard();
  });
  if (status) status.addEventListener("change", () => {
    appState.dashboardFilter.status = status.value;
    renderDashboard();
  });
  if (assigned) assigned.addEventListener("change", () => {
    appState.dashboardFilter.assigned = assigned.value;
    renderDashboard();
  });
}

function bindApplicationActions() {
  document.querySelectorAll("[data-application-action]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const saved = await api.post("/api/applications/update", { id: form.dataset.applicationAction, ...data });
      if (!saved) return showToast(api.lastError);
      syncBootstrap(saved);
      showToast("Application updated.");
      renderDashboard();
    });
  });
  document.querySelectorAll("[data-next-status]").forEach((button) => {
    button.addEventListener("click", async () => {
      const saved = await api.post("/api/applications/update", { id: button.dataset.nextStatus, status: "next" });
      if (!saved) return showToast(api.lastError);
      syncBootstrap(saved);
      showToast("Status moved forward.");
      renderDashboard();
    });
  });
}

function employeeManager() {
  const employees = appState.bootstrap.users.filter((user) => user.role === "employee" && user.active);
  return `
    <section class="content-manager">
      <h4>Add Employee</h4>
      <form class="employee-form" data-employee-form>
        <label>Name <input name="name" required minlength="2" placeholder="Employee full name"></label>
        <label>Phone <input name="phone" required pattern="[6-9][0-9]{9}" maxlength="10" inputmode="numeric" placeholder="10 digit phone"></label>
        <label>Email <input name="email" type="email" placeholder="Employee email"></label>
        <label>Job role <input name="jobTitle" required placeholder="Installation Staff, Sales, Support"></label>
        <label class="password-field">Password <input name="password" type="password" required minlength="6" placeholder="Temporary password"><button type="button" data-toggle-password>Show</button></label>
        <button class="button primary" type="submit">Create Employee Login</button>
      </form>
      <h4>Employee accounts</h4>
      <div class="employee-list">${employees.map(employeeEditor).join("") || `<p class="muted">No employee accounts yet.</p>`}</div>
    </section>
  `;
}

function employeeEditor(employee) {
  return `
    <details class="employee-editor">
      <summary>
        <span><strong>${escapeHtml(employee.name)}</strong><small>${escapeHtml(employee.phone)} | ${escapeHtml(employee.email || "No email")} | ${escapeHtml(employee.jobTitle || "Installation Staff")}</small></span>
        <span class="kebab">⋮</span>
      </summary>
      <form class="employee-edit-form" data-employee-edit="${escapeAttr(employee.id)}">
        <label>Name <input name="name" required value="${escapeAttr(employee.name)}"></label>
        <label>Phone <input name="phone" required pattern="[6-9][0-9]{9}" maxlength="10" inputmode="numeric" value="${escapeAttr(employee.phone)}"></label>
        <label>Email <input name="email" type="email" value="${escapeAttr(employee.email || "")}"></label>
        <label>Job role <input name="jobTitle" required value="${escapeAttr(employee.jobTitle || "Installation Staff")}"></label>
        <label class="checkbox"><input name="active" type="checkbox" ${employee.active ? "checked" : ""}> Active</label>
        <div class="row-actions">
          <button type="submit">Save employee</button>
          <button type="button" data-delete-employee="${escapeAttr(employee.id)}">Delete</button>
        </div>
      </form>
    </details>
  `;
}

function bindEmployeeForm() {
  const form = document.querySelector("[data-employee-form]");
  if (!form) return;
  bindPasswordToggles();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const employee = Object.fromEntries(new FormData(form).entries());
    if (!phonePattern.test(employee.phone)) return showToast("Employee phone must be a valid 10 digit number.");
    const saved = await api.post("/api/employees", employee);
    if (!saved) return showToast(api.lastError);
    syncBootstrap(saved);
    showToast("Employee login created.");
    renderDashboard("employee");
  });

  document.querySelectorAll("[data-employee-edit]").forEach((editForm) => {
    editForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(editForm).entries());
      data.id = editForm.dataset.employeeEdit;
      data.active = Boolean(editForm.elements.active.checked);
      const saved = await api.post("/api/employees/update", data);
      if (!saved) return showToast(api.lastError);
      syncBootstrap(saved);
      showToast("Employee updated.");
      renderDashboard("employee");
    });
  });

  document.querySelectorAll("[data-delete-employee]").forEach((button) => {
    button.addEventListener("click", async () => {
      const saved = await api.post("/api/employees/delete", { id: button.dataset.deleteEmployee });
      if (!saved) return showToast(api.lastError);
      syncBootstrap(saved);
      showToast("Employee deleted.");
      renderDashboard("employee");
    });
  });
}

function serviceManager() {
  return adminContentManager("services");
}

function productManager() {
  return adminContentManager("products");
}

function adminContentManager(kind) {
  const isProducts = kind === "products";
  const items = isProducts ? editableProducts() : editableServices();
  const selected = appState.adminEditor[kind].selectedId ? selectedAdminItem(kind, items) : null;
  if (selected) {
    return `
      <section class="admin-editor-shell admin-editor-detail-shell" data-admin-editor="${escapeAttr(kind)}">
        <div class="admin-editor-detail-top">
          <button class="button secondary" type="button" data-admin-editor-back="${escapeAttr(kind)}">&larr; Back to ${isProducts ? "Products" : "Services"}</button>
        </div>
        ${isProducts ? productEditor(selected) : serviceEditor(selected)}
      </section>
    `;
  }
  return `
    <section class="admin-editor-shell" data-admin-editor="${escapeAttr(kind)}">
      <div class="admin-editor-body">
        ${adminEditorList({
          kind,
          title: isProducts ? "Products" : "Services",
          subtitle: "Click any item to edit",
          addLabel: "Add new",
          addAttribute: isProducts ? "data-add-product" : "data-add-service",
          items,
          selectedId: selected?.id || ""
        })}
      </div>
    </section>
  `;
}

function serviceEditor(service) {
  const item = normalizeService(service);
  const tabs = [
    ["basic", "Basic"],
    ["benefits", "Benefits"],
    ["audience", "Audience"],
    ["included", "Included"],
    ["journey", "Journey"],
    ["documents", "Documents"],
    ["pricing", "Pricing"]
  ];
  return `
    <form class="service-editor admin-editor-form" data-service-form="${escapeAttr(item.id)}" data-admin-editor-form="services">
      <div class="admin-editor-header">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>Service | Order ${escapeHtml(item.sortOrder)}</span>
        </div>
        ${activeToggle(item.active)}
      </div>
      ${adminEditorTabs("services", tabs)}
      <div class="admin-editor-panels">
        <div class="admin-editor-panel ${activeAdminPanel("services", "basic")}" data-editor-panel-content="basic">
          <div class="service-editor-grid">
            <input name="id" type="hidden" value="${escapeAttr(item.id)}">
            <label>Order <input name="sortOrder" type="number" min="1" value="${escapeAttr(item.sortOrder)}"></label>
            <label>Badge label <input name="badge" value="${escapeAttr(item.badge)}" placeholder="Best for low bills"></label>
            <label>Service name <input name="title" required value="${escapeAttr(item.title)}"></label>
            <label>Slug <input name="slug" required value="${escapeAttr(item.slug)}" placeholder="on-grid-solar"></label>
            <label>Short description <textarea name="description" required>${escapeHtml(item.description)}</textarea></label>
            <label>Full description <textarea name="fullDescription" required>${escapeHtml(item.fullDescription)}</textarea></label>
            <input name="tagline" type="hidden" value="${escapeAttr(item.tagline)}">
          </div>
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("services", "benefits")}" data-editor-panel-content="benefits">
          ${listEditor("Key benefits", "benefits", item.benefits)}
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("services", "audience")}" data-editor-panel-content="audience">
          <div class="service-editor-grid">
            <label>Who is this for? <textarea name="whoFor" required>${escapeHtml(item.whoFor)}</textarea></label>
          </div>
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("services", "included")}" data-editor-panel-content="included">
          ${listEditor("What's included", "details", item.details)}
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("services", "journey")}" data-editor-panel-content="journey">
          ${stepEditor("Journey steps", "process", item.process)}
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("services", "documents")}" data-editor-panel-content="documents">
          ${listEditor("Documents needed", "documents", item.documents)}
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("services", "pricing")}" data-editor-panel-content="pricing">
          <div class="service-editor-grid">
            <label>Starting price <input name="startingPrice" type="number" min="0" step="1" value="${escapeAttr(item.startingPrice || "")}" placeholder="65000"></label>
            <label>Pricing note <textarea name="priceNote">${escapeHtml(item.priceNote)}</textarea></label>
          </div>
        </div>
      </div>
      <div class="form-actions admin-editor-actions">
        <button class="button primary" type="submit">Save</button>
        <button class="button secondary" type="button" data-delete-service="${escapeAttr(item.id)}" data-delete-title="${escapeAttr(item.title)}">Delete</button>
      </div>
    </form>
  `;
}

function adminEditorList({ kind, title, subtitle, addLabel, addAttribute, items, selectedId }) {
  return `
    <aside class="admin-editor-list-col">
      <div class="admin-editor-list-head">
        <div>
          <h4>${escapeHtml(title)}</h4>
          <p class="muted">${escapeHtml(subtitle)}</p>
        </div>
        <button class="button secondary admin-editor-add" type="button" ${addAttribute}>${escapeHtml(addLabel)}</button>
      </div>
      <div class="admin-editor-list">
        ${items.map((item) => adminEditorListItem(kind, item, selectedId)).join("") || `<p class="muted">No items yet.</p>`}
      </div>
    </aside>
  `;
}

function adminEditorListItem(kind, item, selectedId) {
  const meta = kind === "products" ? [item.badge, item.warranty].filter(Boolean).join(" - ") : [item.badge, item.pricing].filter(Boolean).join(" - ");
  const activeText = item.active ? "Active" : "Off";
  return `
    <button class="admin-editor-card ${item.id === selectedId ? "active" : ""}" type="button" data-admin-editor-select="${escapeAttr(item.id)}" data-admin-editor-kind="${escapeAttr(kind)}">
      <span class="admin-drag-handle" aria-hidden="true">::</span>
      <span class="admin-editor-card-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(meta || `Order ${item.sortOrder}`)}</small>
      </span>
      <span class="admin-status-pill ${item.active ? "on" : ""}">${activeText}</span>
    </button>
  `;
}

function adminEditorEmpty(type) {
  return `
    <div class="admin-editor-empty">
      <strong>Select a ${escapeHtml(type)}</strong>
      <p class="muted">Choose one item from the left list to open the editor.</p>
    </div>
  `;
}

function selectedAdminItem(kind, items) {
  const state = appState.adminEditor[kind];
  if (!items.length) {
    state.selectedId = "";
    return null;
  }
  const selected = items.find((item) => item.id === state.selectedId);
  if (!selected) {
    state.selectedId = "";
    return null;
  }
  state.selectedId = selected.id;
  return selected;
}

function adminEditorTabs(kind, tabs) {
  const active = validAdminPanel(kind, tabs);
  return `
    <div class="admin-editor-tabs">
      ${tabs.map(([id, label]) => `<button class="${id === active ? "active" : ""}" type="button" data-editor-panel="${escapeAttr(id)}" data-editor-kind="${escapeAttr(kind)}">${escapeHtml(label)}</button>`).join("")}
    </div>
  `;
}

function validAdminPanel(kind, tabs) {
  const ids = tabs.map(([id]) => id);
  const state = appState.adminEditor[kind];
  if (!ids.includes(state.panel)) state.panel = ids[0];
  return state.panel;
}

function activeAdminPanel(kind, id) {
  return appState.adminEditor[kind].panel === id ? "active" : "";
}

function activeToggle(active) {
  return `
    <label class="admin-active-control">
      <input name="active" type="checkbox" ${active ? "checked" : ""}>
      <button class="admin-active-toggle ${active ? "on" : ""}" type="button" data-active-toggle aria-pressed="${active ? "true" : "false"}">
        <span></span>
      </button>
      <em>${active ? "Active" : "Off"}</em>
    </label>
  `;
}

function bindAdminEditorShell() {
  document.querySelectorAll("[data-admin-editor-mode]").forEach((button) => {
    button.addEventListener("click", () => renderDashboard(button.dataset.adminEditorMode));
  });

  document.querySelectorAll("[data-admin-editor-back]").forEach((button) => {
    button.addEventListener("click", () => closeAdminEditor(button.dataset.adminEditorBack));
  });

  document.querySelectorAll("[data-admin-editor-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const kind = button.dataset.adminEditorKind;
      if (!appState.adminEditor[kind]) return;
      appState.adminEditor[kind].selectedId = button.dataset.adminEditorSelect;
      appState.adminEditor[kind].panel = "basic";
      renderDashboard(kind);
    });
  });

  document.querySelectorAll("[data-editor-panel]").forEach((button) => {
    button.addEventListener("click", () => {
      const kind = button.dataset.editorKind;
      if (!appState.adminEditor[kind]) return;
      appState.adminEditor[kind].panel = button.dataset.editorPanel;
      const form = button.closest("[data-admin-editor-form]");
      form?.querySelectorAll("[data-editor-panel]").forEach((tab) => tab.classList.toggle("active", tab === button));
      form?.querySelectorAll("[data-editor-panel-content]").forEach((panel) => panel.classList.toggle("active", panel.dataset.editorPanelContent === button.dataset.editorPanel));
    });
  });

  document.querySelectorAll("[data-active-toggle]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const control = button.closest(".admin-active-control");
      const input = control?.querySelector('input[name="active"]');
      if (!input) return;
      input.checked = !input.checked;
      button.classList.toggle("on", input.checked);
      button.setAttribute("aria-pressed", input.checked ? "true" : "false");
      const label = control.querySelector("em");
      if (label) label.textContent = input.checked ? "Active" : "Off";
    });
  });
}

function closeAdminEditor(kind) {
  if (!appState.adminEditor[kind]) return;
  appState.adminEditor[kind].selectedId = "";
  appState.adminEditor[kind].panel = "basic";
  renderDashboard(kind);
}

function listEditor(label, name, items) {
  return `
    <div class="repeat-editor" data-repeat="${escapeAttr(name)}">
      <div class="repeat-head"><strong>${escapeHtml(label)}</strong><button type="button" data-add-repeat="${escapeAttr(name)}">Add new</button></div>
      <div class="repeat-list">${items.map((item) => repeatRow(name, item)).join("") || repeatRow(name, "")}</div>
    </div>
  `;
}

function stepEditor(label, name, steps) {
  return `
    <div class="repeat-editor" data-repeat="${escapeAttr(name)}" data-repeat-steps>
      <div class="repeat-head"><strong>${escapeHtml(label)}</strong><button type="button" data-add-repeat="${escapeAttr(name)}">Add step</button></div>
      <div class="repeat-list">${steps.map((step) => stepRow(name, step)).join("") || stepRow(name, { name: "", detail: "" })}</div>
    </div>
  `;
}

function repeatRow(name, value) {
  return `<div class="repeat-row"><input name="${escapeAttr(name)}[]" value="${escapeAttr(value)}" placeholder="Add detail"><button type="button" data-move-repeat="up">Up</button><button type="button" data-move-repeat="down">Down</button><button type="button" data-remove-repeat>Remove</button></div>`;
}

function stepRow(name, step) {
  return `<div class="repeat-row step-repeat"><input name="${escapeAttr(name)}Name[]" value="${escapeAttr(step.name || "")}" placeholder="Step title"><input name="${escapeAttr(name)}Detail[]" value="${escapeAttr(step.detail || "")}" placeholder="Step detail"><button type="button" data-move-repeat="up">Up</button><button type="button" data-move-repeat="down">Down</button><button type="button" data-remove-repeat>Remove</button></div>`;
}

function bindServiceForms() {
  document.querySelector("[data-add-service]")?.addEventListener("click", () => {
    const services = editableServices();
    const newService = normalizeService({
      id: makeSlug(`new-service-${Date.now()}`),
      sortOrder: services.length + 1,
      active: true,
      title: "New Solar Service",
      slug: "new-solar-service",
      badge: "New",
      description: "Short service card description.",
      fullDescription: "Full service detail for this solar solution.",
      whoFor: "Ideal for customers who need a tailored solar solution.",
      tagline: "Full service detail for this solar solution.",
      details: ["Included item"],
      benefits: ["Main customer benefit"],
      process: [{ name: "Free consultation", detail: "KSS understands the customer requirement." }],
      documents: ["Aadhaar card or ID proof"],
      startingPrice: 0,
      pricing: "Custom quote",
      priceNote: "Final price is confirmed after site visit.",
      ctaPrimary: "Book free site visit",
      ctaSecondary: "WhatsApp us"
    });
    saveService(newService, "New service added.", newService.id);
  });

  document.querySelectorAll("[data-service-form]").forEach((form) => {
    const titleInput = form.querySelector('input[name="title"]');
    const slugInput = form.querySelector('input[name="slug"]');
    const originalSlug = slugInput?.value || "";
    if (titleInput && slugInput) {
      slugInput.addEventListener("input", () => {
        slugInput.dataset.manual = "true";
      });
      titleInput.addEventListener("input", () => {
        if (slugInput.dataset.manual === "true" && slugInput.value !== originalSlug) return;
        slugInput.value = makeSlug(titleInput.value);
      });
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());
      const title = formData.title.trim();
      const slug = makeSlug(formData.slug || title);
      const startingPrice = normalizePrice(formData.startingPrice);
      const service = {
        id: formData.id,
        slug,
        type: "service",
        sortOrder: Number(formData.sortOrder || 0),
        active: Boolean(form.elements.active.checked),
        title,
        badge: formData.badge.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        whoFor: formData.whoFor.trim(),
        tagline: formData.fullDescription.trim(),
        details: collectRepeat(form, "details"),
        benefits: collectRepeat(form, "benefits"),
        process: collectSteps(form, "process"),
        documents: collectRepeat(form, "documents"),
        startingPrice,
        pricing: formatStartingPrice(startingPrice),
        priceNote: formData.priceNote.trim(),
        ctaPrimary: "Book free site visit",
        ctaSecondary: "WhatsApp us"
      };
      await saveService(service, "Service saved.");
    });
  });

  bindRepeatEditors();
  document.querySelectorAll("[data-delete-service]").forEach((button) => {
    button.addEventListener("click", async () => {
      const saved = await api.post("/api/services/delete", { id: button.dataset.deleteService, title: button.dataset.deleteTitle });
      if (!saved) return showToast(api.lastError);
      syncBootstrap(saved);
      showToast("Service deleted.");
      renderDashboard("services");
    });
  });
}

async function saveService(service, message, focusId = "") {
  const saved = await api.post("/api/services", { service });
  if (!saved) return showToast(api.lastError || "Service could not be saved.");
  syncBootstrap(saved);
  showToast(message);
  appState.adminEditor.services.selectedId = service.id;
  if (focusId) pendingEditorFocus = { type: "service", id: focusId };
  renderDashboard("services");
  focusPendingEditor();
}

function productEditor(product) {
  const item = normalizeProduct(product);
  const tabs = [
    ["basic", "Basic"],
    ["specs", "Specs"],
    ["features", "Features"],
    ["compat", "Compatible"],
    ["pricing", "Pricing"]
  ];
  return `
    <form class="service-editor product-editor admin-editor-form" data-product-form="${escapeAttr(item.id)}" data-admin-editor-form="products">
      <div class="admin-editor-header">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>Product | Order ${escapeHtml(item.sortOrder)}</span>
        </div>
        ${activeToggle(item.active)}
      </div>
      ${adminEditorTabs("products", tabs)}
      <div class="admin-editor-panels">
        <div class="admin-editor-panel ${activeAdminPanel("products", "basic")}" data-editor-panel-content="basic">
          <div class="service-editor-grid">
            <input name="id" type="hidden" value="${escapeAttr(item.id)}">
            <label>Order <input name="sortOrder" type="number" min="1" value="${escapeAttr(item.sortOrder)}"></label>
            <label>Category badge <input name="badge" value="${escapeAttr(item.badge)}" placeholder="Panel"></label>
            <label>Category icon <select name="categoryIcon">${productIconOptions.map((icon) => `<option value="${escapeAttr(icon)}" ${item.categoryIcon === icon ? "selected" : ""}>${escapeHtml(labelFromKey(icon))}</option>`).join("")}</select></label>
            <label>Product name <input name="title" required value="${escapeAttr(item.title)}"></label>
            <label>Slug <input name="slug" required value="${escapeAttr(item.slug)}" placeholder="solar-panels"></label>
            <label>Short description <textarea name="description" required>${escapeHtml(item.description)}</textarea></label>
            <label>Full description <textarea name="fullDescription">${escapeHtml(item.fullDescription)}</textarea></label>
          </div>
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("products", "specs")}" data-editor-panel-content="specs">
          ${specEditor(item.specs)}
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("products", "features")}" data-editor-panel-content="features">
          ${listEditor("Key features", "benefits", item.benefits)}
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("products", "compat")}" data-editor-panel-content="compat">
          ${compatibleEditor(item.compatibleWith)}
        </div>
        <div class="admin-editor-panel ${activeAdminPanel("products", "pricing")}" data-editor-panel-content="pricing">
          <div class="service-editor-grid">
            <label>Starting price <input name="startingPrice" type="number" min="0" step="1" value="${escapeAttr(item.startingPrice || "")}" placeholder="15000"></label>
            <label>Price note <textarea name="priceNote">${escapeHtml(item.priceNote)}</textarea></label>
          </div>
        </div>
      </div>
      <div class="form-actions admin-editor-actions">
        <button class="button primary" type="submit">Save</button>
        <button class="button secondary" type="button" data-delete-product="${escapeAttr(item.id)}" data-delete-title="${escapeAttr(item.title)}">Delete</button>
      </div>
    </form>
  `;
}

function specEditor(specs) {
  const rows = [...specs];
  if (!rows.length) rows.push({ label: "", value: "", unit: "" });
  return `
    <div class="repeat-editor spec-editor" data-spec-editor>
      <div class="repeat-head"><strong>Specifications</strong><button type="button" data-add-spec>Add spec</button></div>
      <div class="repeat-list">${rows.map((spec) => specRow(spec)).join("")}</div>
    </div>
  `;
}

function specRow(spec = { label: "", value: "", unit: "" }) {
  return `
        <div class="repeat-row spec-repeat">
          <input name="specLabel[]" value="${escapeAttr(spec.label)}" placeholder="Label">
          <input name="specValue[]" value="${escapeAttr(spec.value)}" placeholder="Value">
          <input name="specUnit[]" value="${escapeAttr(spec.unit)}" placeholder="Unit">
          <button type="button" data-move-repeat="up">Up</button>
          <button type="button" data-move-repeat="down">Down</button>
          <button type="button" data-remove-repeat>Remove</button>
        </div>
  `;
}

function compatibleEditor(selected) {
  const values = new Set(selected || []);
  return `
    <div class="compatible-editor">
      ${productCompatibilityOptions.map((option) => `
        <label>
          <input name="compatibleWith[]" type="checkbox" value="${escapeAttr(option)}" ${values.has(option) ? "checked" : ""}>
          <span>${escapeHtml(option)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function bindProductForms() {
  document.querySelector("[data-add-product]")?.addEventListener("click", () => {
    const products = editableProducts();
    const productId = makeSlug(`new-product-${Date.now()}`);
    saveProduct(normalizeProduct({
      id: productId,
      slug: productId,
      sortOrder: products.length + 1,
      active: true,
      title: "New Solar Product",
      badge: "Product",
      categoryIcon: "panel",
      color: "#9a5c12",
      icon: "▦",
      description: "Short product card description.",
      fullDescription: "Detailed product description.",
      specs: [{ label: "Brand", value: "Certified", unit: "" }, { label: "Warranty", value: "Available", unit: "" }],
      benefits: ["Main product feature"],
      compatibleWith: ["On-grid"],
      startingPrice: 0,
      pricing: "Custom quote",
      priceNote: "Price varies by capacity and brand."
    }), "New product added.", productId);
  });

  document.querySelectorAll("[data-product-form]").forEach((form) => {
    const titleInput = form.querySelector('input[name="title"]');
    const slugInput = form.querySelector('input[name="slug"]');
    const originalSlug = slugInput?.value || "";
    if (titleInput && slugInput) {
      slugInput.addEventListener("input", () => {
        slugInput.dataset.manual = "true";
      });
      titleInput.addEventListener("input", () => {
        if (slugInput.dataset.manual === "true" && slugInput.value !== originalSlug) return;
        slugInput.value = makeSlug(titleInput.value);
      });
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());
      const previous = editableProducts().find((product) => product.id === formData.id) || {};
      const specs = collectSpecs(form);
      const title = formData.title.trim();
      const slug = makeSlug(formData.slug || title);
      const startingPrice = normalizePrice(formData.startingPrice);
      const product = {
        id: formData.id,
        slug,
        type: "product",
        sortOrder: Number(formData.sortOrder || 0),
        active: Boolean(form.elements.active.checked),
        title,
        badge: formData.badge.trim(),
        categoryIcon: formData.categoryIcon,
        warranty: specValue(specs, "Warranty") || previous.warranty || "Warranty available",
        color: previous.color || "#9a5c12",
        icon: formData.categoryIcon,
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        specs,
        benefits: collectRepeat(form, "benefits"),
        compatibleWith: collectChecked(form, "compatibleWith"),
        startingPrice,
        pricing: formatStartingPrice(startingPrice),
        priceNote: formData.priceNote.trim()
      };
      await saveProduct(product, "Product saved.");
    });
  });

  bindRepeatEditors();
  bindSpecEditors();
  document.querySelectorAll("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", async () => {
      const saved = await api.post("/api/products/delete", { id: button.dataset.deleteProduct, title: button.dataset.deleteTitle });
      if (!saved) return showToast(api.lastError);
      syncBootstrap(saved);
      showToast("Product deleted.");
      renderDashboard("products");
    });
  });
}

async function saveProduct(product, message, focusId = "") {
  const saved = await api.post("/api/products", { product });
  if (!saved) return showToast(api.lastError || "Product could not be saved.");
  syncBootstrap(saved);
  showToast(message);
  appState.adminEditor.products.selectedId = product.id;
  if (focusId) pendingEditorFocus = { type: "product", id: focusId };
  renderDashboard("products");
  focusPendingEditor();
}

function focusPendingEditor() {
  if (!pendingEditorFocus) return;
  const safeId = pendingEditorFocus.id.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const selector = pendingEditorFocus.type === "service" ? `[data-service-form="${safeId}"]` : `[data-product-form="${safeId}"]`;
  const form = document.querySelector(selector);
  pendingEditorFocus = null;
  if (!form) return;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    const title = form.querySelector('input[name="title"]');
    title?.focus();
    title?.select();
  }, 250);
}

function bindRepeatEditors() {
  document.querySelectorAll("[data-add-repeat]:not([data-repeat-bound])").forEach((button) => {
    button.dataset.repeatBound = "true";
    button.addEventListener("click", () => {
      const editor = button.closest("[data-repeat]");
      const list = editor?.querySelector(".repeat-list");
      if (!editor || !list) return;
      const name = editor.dataset.repeat;
      list.insertAdjacentHTML("beforeend", editor.hasAttribute("data-repeat-steps") ? stepRow(name, { name: "", detail: "" }) : repeatRow(name, ""));
      bindRepeatEditors();
    });
  });
  document.querySelectorAll("[data-remove-repeat]:not([data-remove-bound])").forEach((button) => {
    button.dataset.removeBound = "true";
    button.addEventListener("click", () => button.closest(".repeat-row")?.remove());
  });
  document.querySelectorAll("[data-move-repeat]:not([data-move-bound])").forEach((button) => {
    button.dataset.moveBound = "true";
    button.addEventListener("click", () => {
      const row = button.closest(".repeat-row");
      if (!row) return;
      if (button.dataset.moveRepeat === "up" && row.previousElementSibling) {
        row.parentNode.insertBefore(row, row.previousElementSibling);
      }
      if (button.dataset.moveRepeat === "down" && row.nextElementSibling) {
        row.parentNode.insertBefore(row.nextElementSibling, row);
      }
    });
  });
}

function bindSpecEditors() {
  document.querySelectorAll("[data-add-spec]:not([data-spec-bound])").forEach((button) => {
    button.dataset.specBound = "true";
    button.addEventListener("click", () => {
      const editor = button.closest("[data-spec-editor]");
      const list = editor?.querySelector(".repeat-list");
      if (!list) return;
      list.insertAdjacentHTML("beforeend", specRow());
      bindRepeatEditors();
      bindSpecEditors();
    });
  });
}

function collectRepeat(form, name) {
  return Array.from(form.querySelectorAll(`[name="${name}[]"]`)).map((input) => input.value.trim()).filter(Boolean);
}

function collectSteps(form, name) {
  const names = Array.from(form.querySelectorAll(`[name="${name}Name[]"]`));
  const details = Array.from(form.querySelectorAll(`[name="${name}Detail[]"]`));
  return names.map((input, index) => ({ name: input.value.trim(), detail: details[index]?.value.trim() || "" })).filter((step) => step.name || step.detail);
}

function collectSpecs(form) {
  const labels = Array.from(form.querySelectorAll('[name="specLabel[]"]'));
  const values = Array.from(form.querySelectorAll('[name="specValue[]"]'));
  const units = Array.from(form.querySelectorAll('[name="specUnit[]"]'));
  return labels.map((input, index) => ({ label: input.value.trim(), value: values[index]?.value.trim() || "", unit: units[index]?.value.trim() || "" })).filter((spec) => spec.label || spec.value || spec.unit);
}

function collectChecked(form, name) {
  return Array.from(form.querySelectorAll(`[name="${name}[]"]:checked`)).map((input) => input.value.trim()).filter(Boolean);
}

function specValue(specs, label) {
  const wanted = String(label || "").toLowerCase();
  const found = specs.find((spec) => String(spec.label || "").toLowerCase() === wanted);
  return found ? [found.value, found.unit].filter(Boolean).join(" ") : "";
}

function makeSlug(value) {
  return String(value || "service").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "service";
}

function notificationTable() {
  const items = appState.bootstrap.notifications || [];
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>To</th><th>Subject</th><th>Status</th><th>Created</th></tr></thead>
        <tbody>${items.map((mail) => `<tr><td>${escapeHtml(mail.recipient)}</td><td>${escapeHtml(mail.subject)}</td><td>${mail.sent_online ? "Sent" : escapeHtml(mail.email_status || "Queued")}</td><td>${escapeHtml(mail.created_at)}</td></tr>`).join("") || `<tr><td colspan="4">No notifications yet.</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function validatePerson(data, passwordRequired) {
  if (data.name.length < 2) return "Enter a valid name.";
  if (!phonePattern.test(data.phone)) return "Mobile number must be a valid 10 digit Indian number.";
  if (!emailPattern.test(data.email)) return "Enter a valid email address.";
  if (passwordRequired && data.password.length < 6) return "Password must be at least 6 characters.";
  return "";
}

function validateApplication(data) {
  const personError = validatePerson(data, false);
  if (personError) return personError;
  if (!pinPattern.test(data.pincode)) return "Pincode must be exactly 6 digits.";
  return "";
}

function getSessionUser() {
  return storage.get("kssSession", null) || JSON.parse(sessionStorage.getItem("kssSession") || "null");
}

function setSessionUser(user) {
  sessionStorage.setItem("kssSession", JSON.stringify(user));
  storage.set("kssSession", user);
  appState.currentUser = user;
}

function logoutUser() {
  sessionStorage.removeItem("kssSession");
  localStorage.removeItem("kssSession");
  window.location.href = "index.html";
}

function bindCopyActions() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copy);
      showToast("Copied.");
    });
  });
}

function bindContactCards() {
  document.querySelectorAll("[data-contact-trigger]").forEach((button) => {
    button.addEventListener("click", () => button.closest("[data-contact-card]")?.classList.toggle("open"));
  });
}

function statusClass(status) {
  const key = String(status || "").toLowerCase();
  if (key.includes("complete")) return "status completed";
  if (key.includes("cancel")) return "status cancelled";
  if (key.includes("progress")) return "status progress";
  if (key.includes("started")) return "status started";
  if (key.includes("visit")) return "status visit";
  return "status applied";
}

function labelFromKey(value) {
  return String(value).replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message || "Done.";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

init();
