export const PHONE = "8117845317";
export const EMAIL = "krishnamoharana011@gmail.com";

export const heroSlides = [
  ["/assets/solar-slide-home.png", "Solar panels with a clean energy city landscape"],
  ["/assets/solar-slide-environment.png", "Clean energy landscape with solar panels"],
  ["/assets/solar-slide-install.png", "Solar technicians installing panels"],
  ["/assets/solar-slide-rooftop.png", "Solar panel installation on a rooftop"],
  ["/assets/solar-slide-agri.png", "Solar pump installation in an agricultural field"],
];

export const defaultServices = [
  {
    id: "on-grid-solar",
    slug: "on-grid-solar",
    title: "On-grid Solar",
    badge: "Best for low bills",
    description: "Connect your home or business to the grid and cut electricity bills by up to 90%. Earn credits by selling surplus power back.",
    fullDescription: "Plug your rooftop into the grid and watch your electricity bill shrink from month one. Extra generation flows back to the grid as credit.",
    pricing: "Rs 65,000 onwards",
    details: ["Solar panel installation", "Grid-tie inverter setup", "Net meter application", "Earthing and safety checks", "1-year free service"],
    benefits: ["Cut electricity bills significantly", "Earn credits for surplus power", "Eligible systems can receive government subsidy", "Long-term clean power"],
    process: ["Free site survey", "Custom proposal", "Installation", "Net meter and subsidy support", "Handover and monitoring"],
  },
  {
    id: "hybrid-solar",
    slug: "hybrid-solar",
    title: "Hybrid Solar",
    badge: "Solar with backup",
    description: "Get grid power plus battery backup in one smart solar system. Stay powered during outages and reduce bills.",
    fullDescription: "Daytime savings from solar plus automatic battery backup when the grid goes down.",
    pricing: "Rs 1,20,000 onwards",
    details: ["Solar panel installation", "Hybrid inverter setup", "Battery bank installation", "Net metering support", "Safety checks"],
    benefits: ["Automatic backup during power cuts", "Strong bill savings", "Smart energy management", "Ideal for homes and shops"],
    process: ["Free site survey", "Backup planning", "Custom proposal", "Installation and testing", "Handover"],
  },
  {
    id: "off-grid-solar",
    slug: "off-grid-solar",
    title: "Off-grid Solar",
    badge: "No grid needed",
    description: "Fully independent solar power with battery storage for remote homes, farmhouses, and no-grid locations.",
    fullDescription: "Solar panels charge a battery bank that runs remote properties day and night without a grid connection.",
    pricing: "Rs 80,000 onwards",
    details: ["Solar panels", "Off-grid inverter", "Battery bank", "Charge controller", "Complete wiring"],
    benefits: ["Zero grid dependence", "Works in remote locations", "Reduces diesel costs", "Night-time battery power"],
    process: ["Load assessment", "System design", "Quotation", "Installation", "Testing and training"],
  },
  {
    id: "solar-water-pump",
    slug: "solar-water-pump",
    title: "Solar Water Pump",
    badge: "Farm support",
    description: "Run irrigation with sunlight and reduce diesel or electricity dependency for farm water pumping.",
    fullDescription: "Solar panels power borewell or surface pumps directly from sunlight with low running cost.",
    pricing: "Rs 45,000 onwards",
    details: ["Solar panels for pump", "Pump controller or VFD", "Submersible or surface pump", "Mounting structure", "Earthing"],
    benefits: ["Reduce irrigation fuel costs", "Runs directly on sunlight", "Subsidy support where available", "Low maintenance"],
    process: ["Farm site visit", "Pump sizing", "Subsidy guidance", "Installation", "Demo"],
  },
  {
    id: "commercial-solar",
    slug: "commercial-solar",
    title: "Commercial Solar",
    badge: "For businesses",
    description: "Large-scale rooftop solar for factories, offices, shops, and commercial buildings with strong ROI tracking.",
    fullDescription: "Turn commercial rooftops into clean power assets with monitored generation and long-term savings.",
    pricing: "Rs 3,00,000 onwards",
    details: ["High-capacity panels", "3-phase inverter", "Industrial mounting", "Net metering", "Remote monitoring"],
    benefits: ["Reduce commercial bills", "Strong ROI", "Remote performance visibility", "Improve sustainability"],
    process: ["Load survey", "Detailed proposal", "Approval support", "Installation", "Commissioning"],
  },
  {
    id: "amc-maintenance",
    slug: "amc-maintenance",
    title: "AMC & Maintenance",
    badge: "Keep it running",
    description: "Annual maintenance contracts to clean panels, check inverters, and keep output strong all year.",
    fullDescription: "Scheduled cleaning, health checks, wiring inspection, and priority breakdown support.",
    pricing: "Rs 2,500 / year onwards",
    details: ["Panel cleaning", "Inverter health check", "Battery inspection", "Wiring and earthing check", "Performance report"],
    benefits: ["Restore output lost to dust", "Catch issues early", "Priority support", "Annual performance visibility"],
    process: ["Choose a plan", "Baseline inspection", "Scheduled visits", "Emergency support", "Annual report"],
  },
];

export const defaultProducts = [
  ["solar-panels", "Solar Panels", "Panel", "25 yr warranty", "High-efficiency panels engineered for strong generation through heat, dust, and monsoon."],
  ["solar-inverter", "Solar Inverter", "Inverter", "5 yr warranty", "Smart conversion, grid sync, monitoring, and fault protection for your solar setup."],
  ["acdb-dcdb-protection", "ACDB/DCDB Protection", "Protection", "2 yr warranty", "Weatherproof electrical protection for inverter, wiring, and appliances."],
  ["lithium-battery-storage", "Lithium Battery / Storage", "Storage", "10 yr warranty", "Store daytime solar energy for outages and night-time use."],
  ["net-meter", "Net Meter", "Meter", "1 yr warranty", "A bidirectional meter that tracks imported and exported electricity."],
  ["mc4-connectors-cables", "MC4 Connectors & Cables", "Cables", "5 yr warranty", "Outdoor-rated solar cabling and locking connectors for reliable power transfer."],
  ["mounting-structure", "Mounting Structure", "Structure", "10 yr warranty", "Durable galvanized steel or aluminium frames for secure panel mounting."],
  ["product-solar-water-pump", "Solar Water Pump", "Pump", "3 yr warranty", "Solar-powered borewell and irrigation pumping with smart protection."],
].map(([id, title, badge, warranty, description], index) => ({
  id,
  slug: id,
  title,
  badge,
  warranty,
  description,
  fullDescription: description,
  active: true,
  sortOrder: index + 1,
  benefits: ["Certified components", "Expert installation", "Warranty guidance", "Service support"],
  process: ["Requirement check", "Product selection", "Installation", "Testing", "Handover"],
}));

export const statusFlow = [
  "Documents Received",
  "Applied",
  "Contacted",
  "Site Visit Scheduled",
  "Site Visit Completed",
  "Quotation Sent",
  "Installation Started",
  "In Progress",
  "Completed",
];

export const mergeContent = (defaults, saved = []) => {
  const merged = new Map(defaults.map((item) => [item.id, item]));
  saved.forEach((item) => merged.set(item.id, { ...(merged.get(item.id) || {}), ...item }));
  return [...merged.values()].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
};
