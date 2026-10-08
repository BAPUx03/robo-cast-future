import { MessagesSquare, PencilRuler, Hammer, Bot, Headphones } from "lucide-react";
import { automationImages } from "@/content/automation-data";
import {
  officialMachineSpecifications,
  publishedMachineSpecification,
  type MachineSpecificationTable,
} from "@/content/official-machine-specifications";

const castingImg = automationImages.casting;
const castingProductImage = (filename: string) => `/productsimg/casting/${filename}`;
const castingGalleryImage = (machine: string, filename: string) =>
  `/productsimg/casting/gallery/${machine}/${filename}?v=2`;

const castingProductImages = {
  fourPillarWax: castingProductImage("4-pillar-wax-injector.png"),
  cFrameWax: castingProductImage("c-frame-wax-injector.jpg"),
  automodeWax: castingProductImage("automode-wax-injector.png"),
  igtWax: castingProductImage("igt-wax-injector.png"),
  waxMeltingTank: castingProductImage("wax-melting-tank.png"),
  waxConditioningTank: castingProductImage("wax-conditioning-tank.png"),
  waxInjectionCell: castingProductImage("wax-injection-cell.png"),
  kawas: castingProductImage("kawas.png"),
  highShearMixer: castingProductImage("high-shear-mixer.png"),
  rainSander: castingProductImage("rain-sanders.png"),
  fluidizedBed: castingProductImage("fluidized-bed.png"),
  washRinseTanks: castingProductImage("wash-rinse-prewet-tanks.png"),
  slurryTank: castingProductImage("slurry-tank.png"),
  shellingSolution: castingProductImage("automated-shelling-solution.png"),
  fourPillarCeramic: castingProductImage("4-pillar-ceramic-injector.png"),
  cFrameCeramic: castingProductImage("c-frame-ceramic-injector.png"),
  cutOff: castingProductImage("cut-off.png"),
  shellKnockOff: castingProductImage("shell-knock-off.png"),
};

export type Mode = "casting" | "robotics";
export type Category = "casting" | "robotics" | "automation";

export const categoryMeta: Record<Category, { label: string; accent: string }> = {
  casting: { label: "Investment Casting", accent: "from-copper to-brand" },
  robotics: { label: "Robotics", accent: "from-brand to-cyan" },
  automation: { label: "Automation", accent: "from-cyan to-brand" },
};

// Stats sourced from the official Modtech company deck.
export const stats = [
  { value: "1990", label: "Founded" },
  { value: "45+", label: "Countries Served" },
  { value: "1000+", label: "Projects Delivered" },
  { value: "250+", label: "Talent Pool" },
];

export const partnerCapabilities = [
  "Robot integration",
  "PLC & HMI controls",
  "Vision systems",
  "Custom end-of-arm tooling",
  "Safety integration",
];

// Industries Modtech serves — used by the marquee strip under the hero.
export const industries = [
  "Automotive",
  "Aerospace",
  "Defence",
  "Energy & Power",
  "Oil & Gas",
  "Heavy Engineering",
  "Pumps & Valves",
  "Medical",
  "Railways",
  "Industrial Tooling",
  "Marine",
  "Agricultural Equipment",
];

export const modeData: Record<
  Mode,
  {
    label: string;
    kicker: string;
    title: string;
    description: string;
    image: string;
    features: { title: string; desc: string }[];
    primaryCta: string;
    secondaryCta: string;
  }
> = {
  casting: {
    label: "Investment Casting",
    kicker: "Precision foundry machinery",
    title: "End-to-end casting line equipment, built for uptime.",
    description:
      "From wax injectors and conditioning tanks to slurry machines, rain sanders and ceramic injectors — industrial reliability across every step of the line.",
    image: castingImg,
    features: [
      { title: "Wax injectors", desc: "Servo-clamp 30T to 300T capacity." },
      { title: "Slurry systems", desc: "Closed-loop viscosity control." },
      { title: "Rain sanders", desc: "Curtain stucco for complex shells." },
      { title: "Ceramic injectors", desc: "Hydraulic precision for cores." },
    ],
    primaryCta: "Explore machines",
    secondaryCta: "Request a quote",
  },
  robotics: {
    label: "Robotics & Automation",
    kicker: "Turnkey production cells",
    title: "Robots, vision and controls engineered as one line.",
    description:
      "Six-axis robot integration, shelling automation, wax-room robotics and PLC-driven process control — built and validated under one roof.",
    image: automationImages.robot6Axis,
    features: [
      { title: "Robot cell integration", desc: "Custom EOAT, fencing, safety I/O and HMI." },
      { title: "Shelling automation", desc: "Hands-off dip · drain · stucco cycles." },
      { title: "Vision & sensors", desc: "Real-time QC and closed-loop control." },
      { title: "PLC + HMI", desc: "Production data, recipes and traceability." },
    ],
    primaryCta: "Explore machines",
    secondaryCta: "Talk to engineering",
  },
};

export const divisions: Array<{
  code: string;
  title: string;
  tag: string;
  image: string;
  description: string;
  points: string[];
  category: Category;
}> = [
  {
    code: "DIV.01",
    title: "Investment Casting",
    tag: "Precision foundry machinery",
    image: castingImg,
    category: "casting",
    description:
      "End-to-end casting line equipment — wax injectors, conditioning tanks, slurry machines, rain sanders, and ceramic injectors built for industrial reliability.",
    points: [
      "Wax injectors",
      "Conditioning tanks",
      "Slurry equipment",
      "Rain sanders",
      "Ceramic injectors",
      "Fettling equipment",
    ],
  },
  {
    code: "DIV.02",
    title: "Robotics & Automation",
    tag: "Autonomous production cells",
    image: automationImages.casePacker,
    category: "robotics",
    description:
      "Six-axis robot integration, shelling cells, wax-room automation and PLC-driven process control engineered for repeatable factory output.",
    points: [
      "Case erection & packing",
      "Palletizing",
      "Machine tending",
      "PLC + HMI control",
      "Vision systems",
      "Safety integration",
    ],
  },
];

export type Machine = {
  code: string;
  slug: string;
  title: string;
  image: string;
  images?: string[];
  desc: string;
  category: Category;
  section?: ProductSection;
  tagline: string;
  group:
    | "wax-injector"
    | "tank"
    | "wax-automation"
    | "shelling"
    | "ceramic-injector"
    | "fettling"
    | "robotic";
  highlights: string[];
  applications: string[];
  specs: { label: string; value: string }[];
  specificationTables?: MachineSpecificationTable[];
  videos?: { youtubeId: string; title: string }[];
  officialSourceUrl?: string;
};

export type ProductSection =
  | "wax-injection-machines"
  | "wax-processing-conditioning"
  | "wax-room-automation"
  | "shelling-solutions"
  | "ceramic-injectors"
  | "fettling-equipment"
  | "end-of-line-packaging"
  | "flexible-industrial-automation";

export const productSectionMeta: Record<
  ProductSection,
  { label: string; division: Mode; description: string }
> = {
  "wax-injection-machines": {
    label: "Wax Injection Machines",
    division: "casting",
    description:
      "Wax injectors for precision pattern production, from manual machines to large IGT presses.",
  },
  "wax-processing-conditioning": {
    label: "Wax Processing & Conditioning",
    division: "casting",
    description: "Extrusion, melting and conditioning equipment for stable, reusable foundry wax.",
  },
  "wax-room-automation": {
    label: "Wax Room Automation",
    division: "casting",
    description:
      "Robotic cells for hands-off injection, handling, inspection and wax-component assembly.",
  },
  "shelling-solutions": {
    label: "Shelling Solutions",
    division: "casting",
    description: "Slurry preparation, sanding and automated shell-building systems.",
  },
  "ceramic-injectors": {
    label: "Ceramic Injectors",
    division: "casting",
    description:
      "Machines for repeatable ceramic core injection across industrial and aerospace applications.",
  },
  "fettling-equipment": {
    label: "Fettling Equipment",
    division: "casting",
    description: "Post-cast cut-off and shell-removal systems.",
  },
  "end-of-line-packaging": {
    label: "End-of-Line Packaging",
    division: "robotics",
    description: "Robotic case erection, packing and palletizing cells.",
  },
  "flexible-industrial-automation": {
    label: "Flexible Industrial Automation",
    division: "robotics",
    description: "Pick-and-place and vision-guided robotic systems.",
  },
};

export function machineSection(machine: Machine): ProductSection {
  if (machine.section && machine.section in productSectionMeta) return machine.section;
  if (machine.category !== "casting") {
    return ["RA.01", "RA.02", "RA.03"].includes(machine.code)
      ? "end-of-line-packaging"
      : "flexible-industrial-automation";
  }
  if (machine.code.startsWith("WI.")) return "wax-injection-machines";
  if (machine.code.startsWith("WX.") || machine.code.startsWith("TK.")) {
    return "wax-processing-conditioning";
  }
  if (machine.group === "wax-automation") return "wax-room-automation";
  if (machine.group === "shelling") return "shelling-solutions";
  if (machine.group === "ceramic-injector") return "ceramic-injectors";
  if (machine.group === "fettling") return "fettling-equipment";
  return "wax-injection-machines";
}

// Full product catalogue — mirrors modtechworld.com product taxonomy.
const castingMachines: Machine[] = [
  // ---------- Wax Injectors (IGT special-purpose, up to 300T) ----------
  {
    code: "WI.01",
    slug: "4-pillar-wax-injector",
    title: "4-Pillar Wax Injector",
    image: castingProductImages.fourPillarWax,
    category: "casting",
    group: "wax-injector",
    tagline: "Plug-and-play 4-pillar soluble-wax injection from 12T to 100T.",
    desc: "Semi-automatic hydraulic 4-pillar soluble-wax injector with vertical downward clamping, side injection, adjustable pressure and flow, and HMI recipe control.",
    highlights: [
      "Shipped as a plug-and-play machine",
      "Production-ready within 48 hours of delivery",
      "Simple, cost-effective hydraulic design",
      "Remote access for rapid support",
      "Up to 200 die recipes",
      "Customised for specific industry requirements",
      "Choice of machine colour",
      "Configurable die-securing methods",
      "Multiple platen sizes",
      "Local supply voltages and country-specific parts",
    ],
    applications: ["Pumps & valves", "Energy & power", "Heavy engineering", "Defence"],
    specs: [
      { label: "Clamp force", value: "12T – 100T" },
      { label: "Daylight maximum", value: "400–1,000 mm" },
      { label: "Single-shot capacity", value: "1,000–3,500 cc" },
      { label: "Control", value: '7" / 15.6" HMI' },
    ],
    specificationTables: officialMachineSpecifications["4-pillar-wax-injector"],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=13",
  },
  {
    code: "WI.02",
    slug: "c-frame-wax-injector",
    title: "C-Frame Wax Injector",
    image: castingProductImages.cFrameWax,
    category: "casting",
    group: "wax-injector",
    tagline: "Accessible C-frame soluble-wax injection from 12T to 100T.",
    desc: "Semi-automatic hydraulic C-frame soluble-wax injector with vertical downward clamping, side injection, adjustable pressure and flow, and HMI recipe control.",
    highlights: [
      "Shipped as a plug-and-play machine",
      "Production-ready within 48 hours of delivery",
      "Simple, cost-effective C-frame design",
      "Remote access for rapid support",
      "Up to 200 die recipes",
      "Customised for specific industry requirements",
      "Choice of machine colour",
      "Configurable die-securing methods",
      "Multiple platen sizes",
      "Local supply voltages and country-specific parts",
    ],
    applications: ["Automotive", "Medical", "Pumps & valves"],
    specs: [
      { label: "Clamp force", value: "12T – 100T" },
      { label: "Daylight maximum", value: "400–1,000 mm" },
      { label: "Single-shot capacity", value: "1,000–3,500 cc" },
      { label: "Control", value: '7" / 15.6" HMI' },
    ],
    specificationTables: officialMachineSpecifications["c-frame-wax-injector"],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=14",
  },
  {
    code: "WI.03",
    slug: "automode-wax-injector",
    title: "Automode Wax Injector",
    image: castingProductImages.automodeWax,
    category: "casting",
    group: "wax-injector",
    tagline: "Fully automatic injection with auto pattern eject.",
    desc: "Automode wax injector with automatic mould close, inject, dwell, open and pattern eject — engineered for high-volume foundries.",
    highlights: [
      "Fully automatic cycle",
      "Auto pattern eject",
      "Shipped as a plug-and-play machine",
      "Production-ready within 48 hours of delivery",
      "Simple, cost-effective design",
      "Remote access for rapid support",
      "Customised for specific industry requirements",
      "Choice of machine colour",
      "Configurable die-securing methods and platen sizes",
      "Local supply voltages and country-specific parts",
    ],
    applications: ["High-volume foundries", "Automotive Tier-1"],
    specs: [
      { label: "Clamp force", value: "12T / 30T" },
      { label: "Daylight maximum", value: "800 / 900 mm" },
      { label: "Single-shot capacity", value: "2,500 cc" },
      { label: "Control", value: '15" touch screen' },
    ],
    specificationTables: officialMachineSpecifications["automode-wax-injector"],
  },
  {
    code: "WI.04",
    slug: "igt-wax-injector",
    title: "IGT Wax Injector (up to 300T)",
    image: castingProductImages.igtWax,
    category: "casting",
    group: "wax-injector",
    tagline: "Special-purpose IGT wax injector to 300T clamp.",
    desc: "IGT-class wax injection platform for large, complex aerospace and energy patterns, with high-flow delivery, multi-stage injection and configurable tooling access.",
    highlights: [
      "Ergonomic shuttle-table access for large IGT tooling",
      "Generous tie-rod clearance and open daylight",
      "T-slot die handling system",
      "Multiple wax types and nozzle configurations",
      "Wax recirculation from nozzle tip to tank",
      "Push-button wax purge",
      "Up to 1,000 cc/s conditioned-wax flow",
      "Multiple clamping-cylinder option",
      "Five-stage injection control",
      "Pressure and flow history mapping",
      "Multiple-zone PID temperature control",
      "Multi-position central control station",
      "Modular digital-servo hydraulics and power pack",
      "Light guards and interlocked observation panels",
      "CE-marked guarding and electrical system",
      "Operator-definable pattern ejector",
      "Shot capacity up to 32 litres",
      "Wax conditioning tanks up to 200 litres",
    ],
    applications: ["IGT components", "Aerospace structures", "Power generation"],
    specs: [
      { label: "Clamp force", value: "Up to 300T" },
      { label: "Shot size", value: "Up to 32 L" },
      { label: "Wax flow", value: "Up to 1,000 cc/s" },
      { label: "Conditioning tank", value: "Up to 200 L" },
      { label: "Injection control", value: "5 stages" },
      { label: "Temperature control", value: "Multi-zone PID" },
      { label: "Hydraulics", value: "Modular digital servo" },
      { label: "Tooling table", value: "Shuttle table with T-slots" },
      { label: "Safety", value: "Interlocked CE guarding" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=16",
  },

  {
    code: "WI.05",
    slug: "c20-wax-injection-machine",
    title: "C-20 Wax Injection Machine",
    image: castingGalleryImage("c20-wax-injector", "three-quarter.webp"),
    images: [
      castingGalleryImage("c20-wax-injector", "three-quarter.webp"),
      castingGalleryImage("c20-wax-injector", "front.webp"),
      castingGalleryImage("c20-wax-injector", "hmi.webp"),
    ],
    category: "casting",
    group: "wax-injector",
    tagline: "Compact production wax injector with touchscreen HMI control.",
    desc: "The C-20 is a compact hydraulic wax injection machine for repeatable investment-casting pattern production. Its gallery combines the full machine, front working area and HMI view as one product.",
    highlights: [
      "Compact vertical layout",
      "Touchscreen HMI",
      "Hydraulic clamping",
      "Accessible working table",
    ],
    applications: [
      "Investment casting patterns",
      "Small and medium moulds",
      "Production wax rooms",
    ],
    specs: [
      { label: "Model", value: "C-20" },
      { label: "Control", value: "PLC + HMI" },
      { label: "Operation", value: "Hydraulic" },
      { label: "Configuration", value: "Application specific" },
    ],
  },
  {
    code: "WI.06",
    slug: "manual-wax-injection-machine",
    title: "Manual Wax Injection Machine",
    image: castingGalleryImage("manual-wax-injector", "front.webp"),
    images: [
      castingGalleryImage("manual-wax-injector", "front.webp"),
      castingGalleryImage("manual-wax-injector", "front-close.webp"),
      castingGalleryImage("manual-wax-injector", "side.webp"),
      castingGalleryImage("manual-wax-injector", "side-two.webp"),
      castingGalleryImage("manual-wax-injector", "rear.webp"),
      castingGalleryImage("manual-wax-injector", "control-panel.webp"),
    ],
    category: "casting",
    group: "wax-injector",
    tagline: "Operator-controlled wax injection for flexible pattern production.",
    desc: "A manual wax injection machine designed for flexible, lower-volume pattern work, with an integrated wax preparation unit and straightforward operator controls.",
    highlights: [
      "Manual cycle control",
      "Integrated wax preparation",
      "Open working access",
      "Service-friendly layout",
    ],
    applications: [
      "Prototype patterns",
      "Short production runs",
      "Jobbing foundries",
      "Pattern development",
    ],
    specs: [
      { label: "Operation", value: "Manual / operator controlled" },
      { label: "Control", value: "Machine-mounted panel" },
      { label: "Wax supply", value: "Integrated unit" },
      { label: "Configuration", value: "Application specific" },
    ],
  },
  {
    code: "WX.01",
    slug: "wax-extruder-domestic",
    title: "Wax Extruder — Domestic Model",
    image: castingGalleryImage("wax-extruder-domestic", "front.webp"),
    images: [
      castingGalleryImage("wax-extruder-domestic", "front.webp"),
      castingGalleryImage("wax-extruder-domestic", "three-quarter.webp"),
      castingGalleryImage("wax-extruder-domestic", "side.webp"),
      castingGalleryImage("wax-extruder-domestic", "control-panel.webp"),
      castingGalleryImage("wax-extruder-domestic", "detail.webp"),
    ],
    category: "casting",
    group: "wax-injector",
    tagline: "Enclosed wax extrusion system for foundry wax preparation.",
    desc: "The domestic wax extruder is an enclosed production machine for preparing and extruding reusable foundry wax, with operator controls and foot-pedal actuation.",
    highlights: [
      "Enclosed machine body",
      "Foot-pedal operation",
      "Temperature controls",
      "Production-ready construction",
    ],
    applications: ["Wax preparation", "Wax recycling", "Investment casting wax rooms"],
    specs: [
      { label: "Variant", value: "Domestic model" },
      { label: "Operation", value: "Foot-pedal assisted" },
      { label: "Control", value: "Machine-mounted panel" },
      { label: "Configuration", value: "Application specific" },
    ],
  },
  {
    code: "WX.02",
    slug: "wax-extruder-export",
    title: "Wax Extruder — Export Model",
    image: castingGalleryImage("wax-extruder-export", "front.webp"),
    images: [
      castingGalleryImage("wax-extruder-export", "front.webp"),
      castingGalleryImage("wax-extruder-export", "front-wide.webp"),
      castingGalleryImage("wax-extruder-export", "three-quarter.webp"),
      castingGalleryImage("wax-extruder-export", "side.webp"),
      castingGalleryImage("wax-extruder-export", "rear.webp"),
      castingGalleryImage("wax-extruder-export", "control-panel.webp"),
      castingGalleryImage("wax-extruder-export", "detail.webp"),
    ],
    category: "casting",
    group: "wax-injector",
    tagline: "Heavy-duty wax extrusion package configured for export projects.",
    desc: "The export wax extruder packages the extrusion assembly, guarded enclosure and operator controls into a robust system for international investment-casting installations.",
    highlights: [
      "Heavy-duty enclosed build",
      "Integrated operator controls",
      "Foot-pedal actuation",
      "Export-project configuration",
    ],
    applications: [
      "Wax preparation",
      "Wax recycling",
      "Investment casting wax rooms",
      "Export installations",
    ],
    specs: [
      { label: "Variant", value: "Export model" },
      { label: "Operation", value: "Foot-pedal assisted" },
      { label: "Control", value: "Integrated panel" },
      { label: "Configuration", value: "Project specific" },
    ],
  },

  // ---------- Wax conditioning tanks ----------
  {
    code: "TK.01",
    slug: "wax-melting-tank",
    title: "Wax Melting Tank",
    image: castingProductImages.waxMeltingTank,
    category: "casting",
    group: "tank",
    tagline: "Consistent, efficient wax melting for reliable pattern production.",
    desc: "Wax melting tank with accurate temperature control, high-grade insulation and application-specific electric or thermic-fluid heating for consistent wax quality.",
    highlights: [
      "Uniform heating without wax degradation",
      "Accurate temperature control",
      "Energy-efficient insulated design",
      "Robust, maintenance-friendly construction",
      "User-friendly operation",
      "Electric or thermic-fluid heating",
      "Integrated safety controls and protections",
    ],
    applications: ["Investment casting foundries", "Wax preparation & storage", "Pattern shops"],
    specs: [
      { label: "Capacity", value: "Customisable to requirement" },
      { label: "Heating type", value: "Electric / thermic fluid" },
      { label: "Temperature range", value: "For standard investment-casting waxes" },
      { label: "Insulation", value: "High-grade thermal insulation" },
      { label: "Safety", value: "Integrated safety controls and protections" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=35",
  },
  {
    code: "TK.02",
    slug: "wax-conditioning-tank",
    title: "Wax Conditioning Tank",
    image: castingGalleryImage("wax-conditioning-tank", "front.webp"),
    images: [castingGalleryImage("wax-conditioning-tank", "front.webp")],
    category: "casting",
    group: "tank",
    tagline: "Holds wax at injection-ready viscosity, 24/7.",
    desc: "Wax conditioning system for filtering, de-aerating and stabilising temperature and viscosity before the wax reaches the injector.",
    highlights: [
      "Controlled melt transfer from the melting tank",
      "Precise 60–70 °C operating-temperature control",
      "Wax filtration",
      "Air removal before injection",
      "Stable process temperature",
      "Consistent injection viscosity",
      "Vacuum or mechanical de-aeration options",
      "Injection-ready wax verification",
    ],
    applications: ["Wax rooms", "Pattern shops"],
    specs: [
      { label: "Operating temperature", value: "Typically 60–70 °C, wax dependent" },
      { label: "Wax transfer", value: "Pump or gravity feed from melting tank" },
      { label: "Temperature control", value: "Thermostatic, with overheat prevention" },
      { label: "Filtration", value: "Fine-mesh or cartridge filtration" },
      { label: "De-aeration", value: "Vacuum system or mechanical stirring" },
      { label: "Viscosity control", value: "Temperature-adjusted and process recorded" },
      { label: "Injection-ready condition", value: "Clean, bubble-free and stable wax" },
      { label: "Contamination control", value: "Covered tank and clean transfer path" },
      { label: "Configuration", value: "Application specific" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=36",
  },

  // ---------- Wax-room automation ----------
  {
    code: "WA.01",
    slug: "wax-injection-cell",
    title: "Wax Injection Cell",
    image: castingProductImages.waxInjectionCell,
    category: "casting",
    group: "wax-automation",
    tagline: "Robotic transfer for hands-off pattern production.",
    desc: "Automated wax cell that extracts fresh patterns, cleans and sprays the mould, trims the sprue and places inspected patterns in a predefined tray sequence.",
    highlights: [
      "Precision robotic pattern extraction",
      "Programmed mould cleaning and release spray",
      "Automated sprue trimming",
      "Inspected-pattern tray placement in a predefined sequence",
      "Recipe and parameter management HMI",
      "Production statistics and alarm logging",
      "Maintenance diagnostics",
      "Reduced manual intervention and pattern variability",
    ],
    applications: ["High-volume foundries", "Automotive Tier-1"],
    specs: [
      { label: "Pattern handling", value: "Robot extraction and sequenced placement" },
      { label: "Mould service", value: "Air clean and release spray" },
      { label: "Finishing", value: "Automated sprue trimming" },
      { label: "Control", value: "Recipe-based smart HMI" },
      { label: "Diagnostics", value: "Statistics, alarms and maintenance" },
    ],
    videos: [{ youtubeId: "rArfx6gCAlY", title: "Modtech Wax Auto Cell" }],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=19",
  },
  {
    code: "WA.02",
    slug: "kawas",
    title: "KAWAS — Robotic Wax Assembly Cell",
    image: castingGalleryImage("kawas", "front.webp"),
    images: [castingGalleryImage("kawas", "front.webp")],
    category: "casting",
    group: "wax-automation",
    tagline: "Automated inspection and wax-pattern assembly in one integrated cell.",
    desc: "KAWAS combines Modtech wax injection, KUKA six-axis robotics, programmable spraying, trimming, hot-knife assembly and pattern inspection in an integrated wax-room system.",
    highlights: [
      "Fully automated inspection and assembly controls",
      "Integrated high-efficiency Modtech wax injector",
      "Pattern ejection and slab-melter / pallet loading",
      "Platen and die-temperature control with chillers",
      "Protection for up to four independent cores",
      'Windows OCS with 10.4" touchscreen',
      "Paste reservoir with rotational purge nozzle",
      "KUKA KR AGILUS six-axis robots",
      "Programmable spraying and tool changing",
      "Gate cutting, trimming and de-flashing",
      "Hot-knife wax assembly",
      "Automated pattern quality inspection",
      "Individual, row or complete-grid gluing programs",
    ],
    applications: ["Wax rooms", "Pattern assembly", "Repetitive component handling"],
    specs: [
      { label: "Robot", value: "KUKA KR AGILUS · 6 axis" },
      { label: "Control", value: 'Windows OCS · 10.4" touch screen' },
      { label: "Core handling", value: "Up to 4 independent cores" },
      { label: "Tool change", value: "Automatic" },
      { label: "Assembly", value: "Pattern, row or complete-grid gluing" },
      { label: "Inspection", value: "Injection and visual-defect checks" },
    ],
    videos: [{ youtubeId: "en-PsAB6_oo", title: "Modtech KAWAS" }],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=20",
  },

  // ---------- Shelling solutions ----------
  {
    code: "SH.01",
    slug: "high-shear-mixer",
    title: "High Shear Mixer",
    image: castingGalleryImage("high-shear-mixer", "front.webp"),
    images: [castingGalleryImage("high-shear-mixer", "front.webp")],
    category: "casting",
    group: "shelling",
    tagline: "Industrial slurry preparation for ceramic shells.",
    desc: "Industrial high-shear mixer for preparing, ageing and stabilising primary and backup ceramic slurries in single- or multi-station layouts.",
    highlights: [
      "Variable speed drive",
      "Multiple blade configurations",
      "Single or multiple stations",
      "Optional water-cooled drums",
      "Purpose-designed slurry preparation, ageing and stabilisation",
      "Purpose-made tanks available",
      "Motor and mixer power configurable to the application",
    ],
    applications: ["Primary & back-up slurries", "Ceramic core slurries"],
    specs: [
      { label: "Standard speed", value: "35–110 rpm" },
      { label: "Special speed", value: "Up to 1,100 rpm" },
      { label: "Standard motor", value: "5 hp" },
      { label: "Layout", value: "Single / multiple station" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=21",
  },
  {
    code: "SH.02",
    slug: "rain-sander",
    title: "Rotary Rainfall Sander",
    image: castingGalleryImage("rain-sander", "front.webp"),
    images: [
      castingGalleryImage("rain-sander", "front.webp"),
      castingGalleryImage("rain-sander", "interior.webp"),
    ],
    category: "casting",
    group: "shelling",
    tagline: "Controlled rotary stucco rainfall for uniform, high-integrity shells.",
    desc: "Modtech's rotary rainfall sander uses a purpose-developed rotating head and lift-bucket feed to maintain continuous, homogeneous stucco coverage. Variable-speed control adapts sand-fall density to the shell recipe while extraction and changeover options support clean multi-grade operation.",
    highlights: [
      "Fully variable operating speed",
      "Rotating sander head for homogeneous coverage",
      "Dust-extraction hoods",
      "Automatic stucco loading",
      "Reverse-pulse jet extraction option",
      "Local-button and process-control operation",
      "Heavy-duty steel construction",
      "Removable drip trays and safety guarding",
      "Online filling and base-level adjustment",
      "Changeover trolley for different stucco grades",
      "Dual-level or multi-station options",
    ],
    applications: ["Complex shell geometries", "Aero & defence parts"],
    specs: [
      { label: "Speed", value: "Fully variable" },
      { label: "Diameter", value: "1,700–4,000 mm" },
      { label: "Depth", value: "1,400–3,000 mm" },
      { label: "Loading", value: "Lift-bucket · manual / automatic" },
      { label: "Extraction", value: "Reverse-pulse jet option" },
    ],
    specificationTables: officialMachineSpecifications["rain-sander"],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=23",
  },
  {
    code: "SH.03",
    slug: "fluidized-bed",
    title: "Fluidized Bed System",
    image: castingGalleryImage("fluidized-bed", "front.webp"),
    images: [
      castingGalleryImage("fluidized-bed", "front.webp"),
      castingGalleryImage("fluidized-bed", "blower.webp"),
      castingGalleryImage("fluidized-bed", "dust-collector-and-blower.webp"),
    ],
    category: "casting",
    group: "shelling",
    tagline: "Pressurised, uniform stucco coating with automatic process safeguards.",
    desc: "Fluidized bed stucco system with matched turbine blower, multi-zone air distribution and pressure monitoring for uniform primary and backup shell coats.",
    highlights: [
      "Multi-zone air distribution",
      "Pressure-monitored robot interlock",
      "Fixed or variable flow control",
      "Manual or automatic cleaning options",
      "Matched turbine blower on a base platform",
      "Built-in clean-out ports",
      "Sand filtration for agglomeration removal",
      "Reuse of decontaminated stucco",
      "Dust containment and extraction",
      "Automatic isolation and filling options",
      "Remote pressure and temperature monitoring options",
    ],
    applications: ["Primary coats", "Fine-finish shells"],
    specs: [
      { label: "Diameter", value: "600–1,500 mm" },
      { label: "Depth", value: "600–1,500 mm" },
      { label: "Blower", value: "Application-matched turbine" },
      { label: "Air control", value: "Fixed or variable volume" },
      { label: "Pressure protection", value: "No dip below correct pressure" },
      { label: "Cleaning", value: "Manual / automatic option" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=24",
  },
  {
    code: "SH.04",
    slug: "wash-rinse-prewet-tanks",
    title: "Wash, Rinse & Pre-Wet Tanks",
    image: castingProductImages.washRinseTanks,
    category: "casting",
    group: "shelling",
    tagline: "Stainless-steel pattern preparation tanks for clean, reliable shell builds.",
    desc: "Heavy-duty stainless-steel wash, rinse and pre-wet tanks for removing release agents and contaminants from wax patterns before shell making.",
    highlights: [
      "Heavy-duty stainless-steel construction",
      "Bottom waste plug",
      "Custom dimensions available",
      "Optional contaminant surface-clean device",
      "Release-agent and surface-contaminant removal",
      "Recirculation and air-agitation options",
      "Integrated heating option",
      "Controlled water infeed and overflow weir",
      "Spray-rinse and automatic-lid options",
    ],
    applications: ["Shell rooms", "Pattern preparation"],
    specs: [
      { label: "Diameter", value: "600–1,600 mm" },
      { label: "Depth", value: "600–1,500 mm" },
      { label: "Construction", value: "Heavy-duty stainless steel" },
      { label: "Drain", value: "Bottom waste plug" },
      { label: "Options", value: "Recirculation · agitation · heating · spray rinse" },
      { label: "Automation", value: "Water infeed and automatic lid options" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=26",
  },
  {
    code: "SH.05",
    slug: "slurry-tank",
    title: "Slurry Tank",
    image: castingGalleryImage("slurry-mixer", "front.webp"),
    images: [
      castingGalleryImage("slurry-mixer", "front.webp"),
      castingGalleryImage("slurry-mixer", "side.webp"),
    ],
    category: "casting",
    group: "shelling",
    tagline: "Controlled ceramic-slurry mixing for stable, repeatable shell coating.",
    desc: "Enclosed stainless-steel slurry tank available in compact and heavy-duty configurations, with adjustable mixing, safe access and straightforward cleaning for continuous shell-room operation.",
    highlights: [
      "Compact ST and heavy-duty LT configurations",
      "Adjustable mixing blades",
      "Detachable top cover",
      "Fully enclosed working area",
      "Stainless-steel tank with rigid mild-steel support",
      "Fixed or variable-speed mixer control",
      "Local or remote start",
      "Slurry-level monitoring option",
      "Water-cooled and custom paddle options",
    ],
    applications: ["Primary & back-up slurry rooms"],
    specs: [
      { label: "Configuration", value: "Compact ST / LT heavy-duty" },
      { label: "Diameter", value: "600–1,600 mm" },
      { label: "Depth", value: "600–1,500 mm" },
      { label: "Tank construction", value: "Stainless steel" },
      { label: "Support structure", value: "Rigid mild steel" },
      { label: "Mixing arrangement", value: "Fixed or adjustable paddle with rotating tank" },
      { label: "Mixer control", value: "Fixed / variable speed" },
      { label: "Operation", value: "Local / remote start" },
      { label: "Enclosure", value: "Fully enclosed working area" },
      { label: "Maintenance access", value: "Detachable top cover" },
      { label: "Safety options", value: "Edge covers and safety guards" },
      { label: "Magnetic cover", value: "Available" },
      { label: "Lid system", value: "Manual or automatic" },
      { label: "Slurry-level control", value: "Monitoring and control available" },
      { label: "Temperature control", value: "Water-cooled paddle available" },
      { label: "Large-tank paddle", value: "Custom design above 1,400 mm" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=29",
  },
  {
    code: "SH.06",
    slug: "automated-shelling-solution",
    title: "Automated Shelling Solution",
    image: castingProductImages.shellingSolution,
    category: "casting",
    group: "shelling",
    tagline: "Full-line automation: dip · drain · stucco · dry.",
    desc: "Robotic shelling platform with Windows-based production software for recipe control, shell tracking, line planning and remote production oversight.",
    highlights: [
      "Unlimited recipes and production logs",
      "Part and shell tracking",
      "Local and remote line overview",
      "ERP integration capability",
      "Intuitive shell-planning system",
      "Multi-level user access",
      "Remote robot-program selection and planning",
      "Windows-based production software",
      "Modular project-specific line configuration",
    ],
    applications: ["Investment casting foundries", "Aero & defence shells"],
    specs: [
      { label: "Software", value: "Windows based" },
      { label: "Recipes", value: "Unlimited" },
      { label: "Access", value: "Multi-level permissions" },
      { label: "Integration", value: "ERP ready" },
    ],
    videos: [{ youtubeId: "4FHmghBbwS4", title: "Modtech Shell Dip Line" }],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=32",
  },
  {
    code: "SH.07",
    slug: "shell-drying-conveyor",
    title: "Shell Drying Conveyor",
    image: "",
    category: "casting",
    group: "shelling",
    tagline: "Intelligent material handling for continuous automated shell-room operation.",
    desc: "Modtech's modular shell-drying conveyor provides precise movement and positioning of shell clusters through dipping, stuccoing, drying and unloading. Its semi-enclosed heavy-duty track, sealed bearings and encoder-controlled drive are engineered for continuous shell-room service.",
    highlights: [
      "Heavy-duty semi-enclosed track construction",
      "Smooth forward and reverse operation",
      "Encoder-based precision shell positioning",
      "Low-maintenance sealed bearings",
      "Rotating carriers for 360° shell orientation",
      "Single, double or triple-tier configurations",
      "Independent or synchronised drive arrangements",
      "Modular construction for future expansion",
      "Environmental-control and drying-cabinet integration",
    ],
    applications: [
      "Automated shell rooms",
      "Shell drying and transfer",
      "Dip and stucco line handling",
      "Multi-tier production layouts",
    ],
    specs: [
      { label: "Operation", value: "Continuous · forward / reverse" },
      { label: "Positioning", value: "Encoder based" },
      { label: "Configurations", value: "Single / double / triple tier" },
      { label: "Carrier", value: "Rotating hanger assemblies" },
    ],
    specificationTables: officialMachineSpecifications["shell-drying-conveyor"],
  },
  {
    code: "SH.08",
    slug: "stucco-elevator",
    title: "Stucco Elevator",
    image: "",
    category: "casting",
    group: "shelling",
    tagline: "Continuous, controlled stucco transfer from floor level to shelling equipment.",
    desc: "The Modtech stucco elevator combines a ground-level hopper, enclosed vertical elevator tower and high-level discharge arrangement to replenish rainfall sanders and fluidized beds without interrupting automated shell production.",
    highlights: [
      "Efficient continuous stucco handling",
      "Self-contained enclosed construction",
      "Consistent controlled discharge rate",
      "Heavy-duty bucket-belt assembly",
      "Low-maintenance design",
      "Compact footprint",
      "Suitable for automated shell rooms",
      "Custom discharge height available",
      "Variable-speed drive option",
    ],
    applications: [
      "Rainfall sander replenishment",
      "Fluidized-bed replenishment",
      "Automated shell rooms",
      "Refractory-media transfer",
    ],
    specs: [
      { label: "Feed", value: "Ground-level hopper" },
      { label: "Transfer", value: "Vertical bucket belt" },
      { label: "Discharge", value: "Custom project height" },
      { label: "Control", value: "Fixed / variable speed" },
    ],
    specificationTables: officialMachineSpecifications["stucco-elevator"],
  },
  {
    code: "SH.09",
    slug: "vertical-sander",
    title: "Vertical Sander",
    image: "",
    category: "casting",
    group: "shelling",
    tagline: "Precision vertical stucco application for aerospace and high-integrity shells.",
    desc: "Modtech's vertical sander uses an active upper reservoir, controlled multi-stage media flow and automatic stucco lifting to provide uniform, repeatable coverage with low material wastage across demanding shell recipes.",
    highlights: [
      "Controlled and uniform stucco flow",
      "Active-reservoir rainfall design",
      "Integrated auger or bucket elevator",
      "Sand-level monitoring and automatic filling",
      "Usage alarms and process indication",
      "Variable-speed operation",
      "Robotic shell-room compatibility",
      "Dust-extraction provision",
      "Automatic sand-cleaning option",
    ],
    applications: [
      "Aerospace shell production",
      "High-integrity castings",
      "Robotic shell rooms",
      "Recipe-controlled stucco application",
    ],
    specs: [
      { label: "Flow", value: "Multi-stage controlled rainfall" },
      { label: "Media lift", value: "Auger / bucket elevator" },
      { label: "Speed", value: "Variable" },
      { label: "Monitoring", value: "Level sensors and usage alarm" },
    ],
    specificationTables: officialMachineSpecifications["vertical-sander"],
  },
  {
    code: "SH.10",
    slug: "slurry-preparation-tank",
    title: "Slurry Preparation Tank",
    image: "",
    category: "casting",
    group: "shelling",
    tagline: "Dual-motion preparation for stable slurry viscosity and particle suspension.",
    desc: "The slurry preparation tank integrates an ST or LT-series stainless-steel tank with a high-efficiency power mixer. Synchronous tank and mixer motion disperses refractory, binder and additives while reducing sedimentation and simplifying cleaning access.",
    highlights: [
      "Dual-motion rotating mixer and tank",
      "Uniform refractory and binder dispersion",
      "Variable-frequency drive speed control",
      "Pivoting or lifting mixer arrangement",
      "Continuous or batch preparation",
      "Manual, semi-automatic or automatic operation",
      "PLC integration available",
      "Tank-stoppage and process monitoring options",
    ],
    applications: [
      "Primary slurry preparation",
      "Backup slurry preparation",
      "Automated shell rooms",
      "Continuous and batch mixing",
    ],
    specs: [
      { label: "Tank", value: "ST / LT stainless-steel series" },
      { label: "Mixing", value: "Dual motion" },
      { label: "Drive", value: "VFD controlled" },
      { label: "Control", value: "Fixed / programmable PLC" },
    ],
    specificationTables: officialMachineSpecifications["slurry-preparation-tank"],
  },
  {
    code: "SH.11",
    slug: "shell-hangers",
    title: "Shell Hangers",
    image: "",
    category: "casting",
    group: "shelling",
    tagline: "Secure, repeatable shell-cluster handling for robotic coating lines.",
    desc: "Modtech shell hangers use a heavy-duty T-bar interface and configurable attachment hardware to carry varied shell weights and geometries safely through automated dipping, coating and drying operations.",
    highlights: [
      "Single or multi-position configurations",
      "Heavy-duty steel construction",
      "Secure robot-gripper T-bar interface",
      "High repeatability and stable positioning",
      "Simple reliable attachment mechanism",
      "Custom designs for different shell geometries",
      "Wax adapters and conversion kits",
      "Alternative lock-ring and lynch-pin arrangements",
    ],
    applications: [
      "Robotic shell building",
      "Wax-tree handling",
      "Dip and stucco transfer",
      "Custom shell attachment systems",
    ],
    specs: [
      { label: "Configuration", value: "Single / multi-position" },
      { label: "Construction", value: "Heavy-duty steel" },
      { label: "Interface", value: "Robot-gripper T-bar" },
      { label: "Attachment", value: "Project specific" },
    ],
    specificationTables: officialMachineSpecifications["shell-hangers"],
  },
  {
    code: "SH.12",
    slug: "ic-series-robot",
    title: "IC-Series Shell Handling Robot",
    image: "",
    category: "casting",
    group: "shelling",
    tagline: "Heavy-payload robotic manipulation engineered for automated shell building.",
    desc: "The IC-series robot platform handles shell clusters through slurry tanks, rainfall sanders, fluidized beds and drying stations. Project-selected global robot platforms combine high-torque wrist assemblies, servo motion and recipe control for precise, repeatable coating cycles.",
    highlights: [
      "Large project-configured working envelope",
      "Payload capacities from 130 to 2,300 kg",
      "Heavy-duty continuous-operation construction",
      "High-torque wrist for stable shell handling",
      "Smooth digital servo-controlled movement",
      "Recipe-based programming and control",
      "Automatic slurry-level calibration option",
      "Integrated servo-driven seventh-axis option",
      "Protective robot covers available",
    ],
    applications: [
      "Automated shell dipping",
      "Stucco and fluidized-bed handling",
      "Drying-station transfer",
      "Heavy shell-cluster manipulation",
    ],
    specs: [
      { label: "Payload", value: "130–2,300 kg" },
      { label: "Motion", value: "Digital servo controlled" },
      { label: "Wrist", value: "High torque" },
      { label: "Robot brands", value: "KUKA · Kawasaki · FANUC · ABB · Yaskawa" },
    ],
    specificationTables: officialMachineSpecifications["ic-series-robot"],
  },
  {
    code: "SH.13",
    slug: "robot-gripper",
    title: "Shell Handling Robot Gripper",
    image: "",
    category: "casting",
    group: "shelling",
    tagline: "Pneumatic 360° end-of-arm tooling for secure shell-hanger handling.",
    desc: "Modtech's shell-handling gripper provides a rigid, repeatable connection between an industrial robot and the shell-hanger T-bar. Pneumatic actuation enables fast clamp and release while the rotary interface supports continuous shell orientation through the coating cycle.",
    highlights: [
      "Pneumatic clamp and release",
      "Continuous 360° rotation",
      "Rigid mechanical hanger interface",
      "High-payload construction",
      "Excellent repeatability",
      "Modular service-friendly design",
      "Mechanical-lock option",
      "Position-sensor option",
    ],
    applications: [
      "Shell-hanger handling",
      "Wax-tree manipulation",
      "Robotic dipping cycles",
      "Automated shell orientation",
    ],
    specs: [
      { label: "Actuation", value: "Pneumatic" },
      { label: "Rotation", value: "Continuous 360°" },
      { label: "Interface", value: "T-bar shell hanger" },
      { label: "Options", value: "Mechanical lock · position sensors" },
    ],
    specificationTables: officialMachineSpecifications["robot-gripper"],
  },

  // ---------- Ceramic injectors ----------
  {
    code: "CI.01",
    slug: "4-pillar-ceramic-injector",
    title: "4-Pillar Ceramic Injector",
    image: castingGalleryImage("4-pillar-ceramic-injector", "100t-front.webp"),
    images: [
      castingGalleryImage("4-pillar-ceramic-injector", "100t-front.webp"),
      castingGalleryImage("4-pillar-ceramic-injector", "50t-front.webp"),
      castingGalleryImage("4-pillar-ceramic-injector", "50t-side.webp"),
    ],
    category: "casting",
    group: "ceramic-injector",
    tagline: "Rigid 4-pillar ceramic core injection in 30T, 50T and 100T configurations.",
    desc: "Heavy-duty 4-pillar ceramic core injector with guarded working area, hydraulic clamping and HMI control. The published range covers 30T, 50T and 100T configurations.",
    highlights: [
      "4-pillar rigidity",
      "Full ceramic recirculation",
      "Heavy-duty tank and agitator",
      "Modular digital servo hydraulics",
      "Specific-purpose injection system",
      "Quick seal replacement and push-button purge",
      "Tank and injection system move together",
      "Hardened ceramic-contact parts",
      "Platen cooling channels and multiple die mounts",
      "Optional PLCS platen laser centering",
      "Heat-zone design that minimises heat loss",
      "CE-marked guarding and electrical system",
    ],
    applications: ["Aerospace turbine cores", "Complex internal geometries"],
    specs: [
      { label: "Clamp force", value: "30T – 100T" },
      { label: "Single-shot capacity", value: "1,500 – 3,500 cc" },
      { label: "Injection pressure", value: "3.5 – 70 bar" },
      { label: "Control", value: '15" touch screen' },
    ],
    specificationTables: officialMachineSpecifications["4-pillar-ceramic-injector"],
  },
  {
    code: "CI.02",
    slug: "c-frame-ceramic-injector",
    title: "C-Frame Ceramic Core Injector",
    image: castingGalleryImage("c-frame-ceramic-injector", "front.webp"),
    images: [castingGalleryImage("c-frame-ceramic-injector", "front.webp")],
    category: "casting",
    group: "ceramic-injector",
    tagline: "Open-frame ceramic injector for accessibility.",
    desc: "C-frame ceramic core injector providing open access for fast mould changes on medium-tonnage runs.",
    highlights: [
      "Open C-frame mould access",
      "Full ceramic recirculation",
      "Heavy-duty tank and agitator",
      "Modular digital servo hydraulics",
      "Specific-purpose injection system",
      "Quick seal replacement and push-button purge",
      "Tank and injection system move together",
      "Hardened ceramic-contact parts",
      "Platen cooling channels and multiple die mounts",
      "Optional PLCS platen laser centering",
      "Heat-zone design that minimises heat loss",
      "CE-marked guarding and electrical system",
    ],
    applications: ["Turbine cores", "Industrial ceramics"],
    specs: [
      { label: "Clamp force", value: "30T – 100T" },
      { label: "Single-shot capacity", value: "1,500 – 3,500 cc" },
      { label: "Injection pressure", value: "3.5 – 70 bar" },
      { label: "Control", value: '15" touch screen' },
    ],
    specificationTables: officialMachineSpecifications["c-frame-ceramic-injector"],
  },

  // ---------- Fettling ----------
  {
    code: "FT.01",
    slug: "cut-off",
    title: "Cut-off Machine",
    image: castingProductImages.cutOff,
    category: "casting",
    group: "fettling",
    tagline: "Precision gate cut-off for cast trees.",
    desc: "Industrial cut-off machine for separating castings from gates and runners with repeatable cut quality and operator safety.",
    highlights: [
      "Variable-speed abrasive cutting",
      "Servo-driven X and Y cutting head",
      "Five-axis workpiece manipulator",
      "Fully interlocked acoustic enclosure",
    ],
    applications: ["Foundry fettling rooms", "Post-cast processing"],
    specs: [
      { label: "Abrasive blade", value: "600–750 mm" },
      { label: "Cutting speed", value: "1,800–3,200 rpm · variable" },
      { label: "Optional main drive", value: "50 hp" },
      { label: "Working envelope", value: "600 × 600 × 600 mm" },
      { label: "Maximum part weight", value: "200 kg" },
      { label: "Table size", value: "920 × 700 mm" },
      { label: "Manipulator accuracy", value: "±1 mm" },
      { label: "Axis speed", value: "0.1–150 mm/sec" },
      { label: "Operation", value: "Manual / semi / fully automatic" },
      { label: "Control", value: "Interactive HMI and PLC" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=33",
  },
  {
    code: "FT.02",
    slug: "shell-knock-off",
    title: "Shell Knock-off Machine",
    image: castingGalleryImage("shell-knock-off", "front.webp"),
    images: [
      castingGalleryImage("shell-knock-off", "front.webp"),
      castingGalleryImage("shell-knock-off", "side.webp"),
    ],
    category: "casting",
    group: "fettling",
    tagline: "Pneumatic shell breaking after casting.",
    desc: "Enclosed vertical shell knock-off station with downward clamping, an adjustable pneumatic hammer and integrated dust extraction.",
    highlights: [
      "Vertical chipping process",
      "Downward mould clamping",
      "Sound-deadened dual-skin cabinet",
      "Integrated dust extraction",
    ],
    applications: ["Post-pour fettling", "Shell de-coring"],
    specs: [
      { label: "Maximum mould size", value: "700 H × 400 W × 400 D mm" },
      { label: "Minimum mould size", value: "200 H × 150 W × 150 D mm" },
      { label: "Maximum mould weight", value: "100 kg" },
      { label: "Loading height", value: "780 mm" },
      { label: "Clamp cylinder stroke", value: "500 mm" },
      { label: "Maximum clamp force", value: "200 kg" },
      { label: "Hammer", value: "Pneumatic · 1,000 BPM adjustable" },
      { label: "Dust extraction", value: "Included" },
      { label: "Operating pressure", value: "7 bar" },
      { label: "Pneumatic requirement", value: "46 CFM" },
      { label: "Electrical load", value: "1 kVA · 13 A · 380 V · 3 phase · 50 Hz" },
      { label: "Operational noise at 1 m", value: "No more than 120 dBA" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=34",
  },
];

const automationMachines: Machine[] = [
  {
    code: "RA.01",
    slug: "robotic-case-erector",
    title: "Robotic Case Erector",
    image: automationImages.caseErector,
    images: [
      automationImages.caseErector,
      automationImages.caseErectorFloor,
      automationImages.caseErectorOpen,
    ],
    category: "automation",
    group: "robotic",
    tagline: "Automate corrugated case erection and bottom sealing.",
    desc: "A six-axis robotic cell that handles multiple case magazines, forms bottom flaps and seals cases for a dependable start-of-line operation.",
    highlights: [
      "Repeatable case erection with minimal SKU changeover",
      "Six-axis robot with multiple case magazines",
      "Bottom-flap folding and case sealing",
      "Small footprint, high uptime and low maintenance",
      "Recipe control for multiple SKUs and lines",
      "Industry 4.0-enabled controls",
      "Interlocked guarding and safety doors",
      "Custom vacuum or mechanical robot gripper",
      "Ethernet connectivity for remote support",
      "Fully integrated design, build, installation and training",
    ],
    applications: ["FMCG", "Food & beverage", "Pharmaceutical", "Consumer goods"],
    specs: [
      { label: "Configuration", value: "Custom by case format" },
      { label: "Robot", value: "6-axis" },
      { label: "Control", value: "Touchscreen control system" },
      { label: "Case handling", value: "Multiple magazines and conveyors" },
      { label: "Sealing", value: "Top / bottom taping integration" },
      { label: "Safety", value: "Interlocked guarding and doors" },
      { label: "Gripper", value: "Vacuum / mechanical, product specific" },
      { label: "Support", value: "Ethernet enabled" },
    ],
    videos: [
      {
        youtubeId: "BuX7PRm1Q-0",
        title: "Modtech Random Case Erector, 12 CPM Speed",
      },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=45",
  },
  {
    code: "RA.02",
    slug: "robotic-case-packer",
    title: "Robotic Case Packer",
    image: automationImages.casePacker,
    images: [
      automationImages.casePacker,
      automationImages.casePackerFloor,
      automationImages.casePackerLine,
    ],
    category: "automation",
    group: "robotic",
    tagline: "Flexible robotic packing for multiple products and cases.",
    desc: "A turnkey box-filling cell with six-axis handling, product infeed, case sealing and optional labelling or coding peripherals.",
    highlights: [
      "Repeatable robotic box filling across multiple SKUs",
      "Adjustable tooling for a wide product-size range",
      "Automatic tool changers",
      "Operator pendant for recipes, diagnostics and errors",
      "Precise servo-controlled six-axis robot",
      "Integrated sealing, labelling and inkjet options",
      "Industry 4.0-enabled controls",
      "Interlocked guarding and safety doors",
      "Custom vacuum or mechanical gripper",
      "Ethernet remote-support module",
    ],
    applications: ["Food & beverage", "Pharmaceutical", "Personal care", "Household products"],
    specs: [
      { label: "Robot", value: "6-axis, application selected" },
      { label: "Formats", value: "Multi-SKU capable" },
      { label: "Integration", value: "Sealing, labelling & coding" },
      { label: "Product handling", value: "Adjustable tooling / automatic tool change" },
      { label: "Control", value: "Touchscreen recipes and diagnostics" },
      { label: "Conveyors", value: "Product infeed and box handling" },
      { label: "Safety", value: "Interlocked guarding and doors" },
      { label: "Support", value: "Ethernet enabled" },
    ],
    videos: [{ youtubeId: "c7oYzftZA8Y", title: "Modtech Robotics Case Packer" }],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=46",
  },
  {
    code: "RA.03",
    slug: "robotic-palletizing",
    title: "Robotic Palletizing",
    image: automationImages.palletizer,
    images: [
      automationImages.palletizer,
      automationImages.palletizingFloor,
      automationImages.palletizingCell,
    ],
    category: "automation",
    group: "robotic",
    tagline: "Automatic pallet feeding, stacking and finished-stack output.",
    desc: "A configurable palletizing system designed around product geometry, cycle time, plant layout and required pallet pattern.",
    highlights: [
      "Fully automatic pallet feeding and stacking",
      "Reduces repetitive lifting, injury and fatigue",
      "Higher throughput and repeatable stack quality",
      "Multiple SKUs and infeed lines",
      "Configurable product pick quantity and pallet pattern",
      "Very low maintenance",
      "Industry 4.0-enabled monitoring",
      "Interlocked guarding and custom gripper",
      "Ethernet connectivity for remote support",
    ],
    applications: ["Cases", "Bags", "Tins", "Bales & sacks"],
    specs: [
      { label: "Layout", value: "Custom cell design" },
      { label: "Feeding", value: "Automatic pallet feeder" },
      { label: "Control", value: "Touchscreen control system" },
      { label: "Formats", value: "Multi-SKU and multi-line" },
      { label: "Conveyors", value: "Pallet and product infeed" },
      { label: "Stack pattern", value: "Project configurable" },
      { label: "Safety", value: "Interlocked guarding and doors" },
      { label: "Support", value: "Ethernet enabled" },
    ],
    videos: [
      {
        youtubeId: "TUrfLrsIYtk",
        title: "Modtech EasyyRCPa - Palletizer for Multiple Lines",
      },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=44",
  },
  {
    code: "RA.04",
    slug: "robotic-pick-and-place",
    title: "Robotic Pick & Place",
    image: automationImages.pickPlaceRobotCell,
    images: [
      automationImages.pickPlaceRobotCell,
      automationImages.pickPlaceFloor,
      automationImages.pickPlaceBottles,
    ],
    category: "robotics",
    group: "robotic",
    tagline: "Vision-ready high-speed picking, sorting and handling.",
    desc: "Flexible robotic handling for picking, packing, sorting, defect removal, inspection and assembly across variable product flows.",
    highlights: [
      "High picking accuracy and repeatability",
      "High-speed mixed-product handling",
      "Vision-guided sorting and orientation",
      "Defect identification and separation",
      "Bin picking, assembly, packaging and inspection",
      "Industry 4.0-enabled controls",
      "Custom vacuum or mechanical gripper",
      "Conveyor and product-station integration",
      "Interlocked guarding and safety doors",
    ],
    applications: ["Bin picking", "Sorting", "Assembly", "Inspection"],
    specs: [
      { label: "Vision", value: "Camera and lighting as required" },
      { label: "Handling", value: "Custom end-of-arm tooling" },
      { label: "Control", value: "Touchscreen + robot controller" },
      { label: "Tracking", value: "Conveyor encoder integration available" },
      { label: "Conveyor", value: "Basic infeed included as required" },
      { label: "Safety", value: "Interlocked guarding and doors" },
      { label: "Integration", value: "Design, build, commissioning and training" },
    ],
    videos: [
      {
        youtubeId: "pwUt_JBN3Gs",
        title: "Vials Pick & Place With Pharma Grade Robot",
      },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=47",
  },
  {
    code: "RA.05",
    slug: "robotic-vision-system",
    title: "Vision System",
    image: automationImages.visionInspectionCell,
    images: [automationImages.visionInspectionCell, automationImages.visionInspection],
    category: "robotics",
    group: "robotic",
    tagline: "Give production cells reliable eyes and real-time decisions.",
    desc: "Vision systems combine cameras, purpose-built lighting and software to guide robots, inspect product quality and track parts in motion.",
    highlights: [
      "Product orientation and fill-level checking",
      "Barcode-print inspection",
      "OCR and OCV label verification",
      "Dent, scratch and surface-defect detection",
      "Part detection and conveyor-volume calculation",
      "In-process quality monitoring",
      "Accurate assembly alignment",
      "Vision-guided pick and place",
      "Moving-product conveyor tracking",
    ],
    applications: ["Packaging", "Traceability", "Quality inspection", "Assembly"],
    specs: [
      { label: "Camera", value: "Fixed or robot mounted" },
      { label: "Lighting", value: "Application specific" },
      { label: "Tracking", value: "Encoder integrated" },
      { label: "Software", value: "Position, orientation and inspection processing" },
      { label: "Verification", value: "Barcode · OCR · OCV · defect checks" },
      { label: "Calibration", value: "Vision-to-robot coordinate calibration" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=48",
  },
];

// Public catalogue: both company divisions, with each physical machine listed once.
// Alternate angles and configuration photos live in the machine's `images` gallery.
// The legacy Modtech pages sometimes publish one technical-value list instead of a
// multi-model comparison. Convert those values to the same structured table shape
// so every official machine page presents its details consistently.
export const functionalities: Machine[] = [...castingMachines, ...automationMachines].map(
  (machine) => {
    if (machine.specificationTables?.length || !machine.officialSourceUrl) return machine;

    return {
      ...machine,
      specificationTables: publishedMachineSpecification(machine.specs, machine.officialSourceUrl),
    };
  },
);

export const machineDivision = (machine: Machine): Mode =>
  machine.category === "casting" ? "casting" : "robotics";

export const processSteps = [
  {
    code: "01",
    name: "Consult",
    desc: "Map your line, throughput and constraints with our engineering team.",
    Icon: MessagesSquare,
  },
  {
    code: "02",
    name: "Engineer",
    desc: "Custom mechanical, electrical and control design tailored to your part.",
    Icon: PencilRuler,
  },
  {
    code: "03",
    name: "Build",
    desc: "Precision fabrication and assembly inside our integrated workshop.",
    Icon: Hammer,
  },
  {
    code: "04",
    name: "Automate",
    desc: "Robot cells, PLC logic and HMIs deployed and validated on-site.",
    Icon: Bot,
  },
  {
    code: "05",
    name: "Support",
    desc: "Lifecycle service, spares and continuous optimisation of output.",
    Icon: Headphones,
  },
];

export const news: Array<{
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  imageWebp: string;
  category: Category;
}> = [
  {
    tag: "Casting",
    date: "JAN 2025",
    title: "Investment casting process engineering",
    excerpt:
      "A look at the controlled pouring and process discipline that support consistent investment-casting quality.",
    image: automationImages.casting,
    imageWebp: automationImages.casting,
    category: "casting",
  },
  {
    tag: "Robotics",
    date: "MAR 2025",
    title: "Six-axis welding cell deployed for a Tier-1 supplier",
    excerpt:
      "How a robotic welding cell raised yield by 28% and cut cycle time across the wax-to-shell process.",
    image: automationImages.machineTendingCnc,
    imageWebp: automationImages.machineTendingCnc,
    category: "robotics",
  },
  {
    tag: "Automation",
    date: "FEB 2025",
    title: "PLC-driven shelling line with vision-based QC",
    excerpt:
      "Modular conveyor + vision pipeline delivers hands-off shell building with closed-loop process control.",
    image: automationImages.visionInspection,
    imageWebp: automationImages.visionInspection,
    category: "automation",
  },
];

// Exhibitions & events — sourced from modtechworld.com (rights confirmed by owner).
export const exhibitions: Array<{ title: string; date: string; location: string; image: string }> =
  [
    {
      title: "ICI 71st Technical Conference & Equipment Expo",
      date: "Oct 2024",
      location: "Covington, KY · USA",
      image: automationImages.facility,
    },
    {
      title: "International Foundry Trade Fair",
      date: "Mar 2025",
      location: "Düsseldorf · Germany",
      image: automationImages.casePackerLine,
    },
    {
      title: "Investment Casting Institute Expo",
      date: "May 2025",
      location: "Atlanta, GA · USA",
      image: automationImages.palletizingLine,
    },
    {
      title: "IFEX — India Foundry Congress",
      date: "Feb 2025",
      location: "Greater Noida · India",
      image: automationImages.machineTendingCnc,
    },
    {
      title: "EUROGUSS Foundry Show",
      date: "Jul 2025",
      location: "Nuremberg · Germany",
      image: automationImages.robot6Axis,
    },
  ];
