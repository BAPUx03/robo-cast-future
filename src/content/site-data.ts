import { MessagesSquare, PencilRuler, Hammer, Bot, Headphones } from "lucide-react";
import { automationImages } from "@/content/automation-data";
import {
  officialMachineSpecifications,
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
      "Plug-and-play machine platform",
      "Up to 200 die recipes",
      "Remote access for rapid support",
      "Configurable platen and die securing",
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
      "Plug-and-play machine platform",
      "Up to 200 die recipes",
      "Remote access for rapid support",
      "Configurable platen and die securing",
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
      "Cycle counter & traceability",
      "Multi-recipe HMI",
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
      "Five-stage injection control",
      "Pressure and flow history mapping",
      "Multiple-zone PID temperature control",
      "Recirculation and automatic purge",
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
      "Wax filtration",
      "Air removal before injection",
      "Stable process temperature",
      "Consistent injection viscosity",
    ],
    applications: ["Wax rooms", "Pattern shops"],
    specs: [
      { label: "Wax temperature", value: "Typically 60–70 °C" },
      { label: "Process", value: "Filter · de-aerate · condition" },
      { label: "Temperature", value: "Wax-grade dependent" },
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
      "Recipe, alarm and maintenance HMI",
    ],
    applications: ["High-volume foundries", "Automotive Tier-1"],
    specs: [
      { label: "Pattern handling", value: "Robot extraction and sequenced placement" },
      { label: "Mould service", value: "Air clean and release spray" },
      { label: "Finishing", value: "Automated sprue trimming" },
      { label: "Control", value: "Recipe-based smart HMI" },
      { label: "Diagnostics", value: "Statistics, alarms and maintenance" },
    ],
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
      "KUKA KR AGILUS six-axis robots",
      "Programmable spraying and tool changing",
      "Hot-knife wax assembly",
      "Automated pattern quality inspection",
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
    title: "Rainfall Sander",
    image: castingGalleryImage("rain-sander", "front.webp"),
    images: [
      castingGalleryImage("rain-sander", "front.webp"),
      castingGalleryImage("rain-sander", "interior.webp"),
    ],
    category: "casting",
    group: "shelling",
    tagline: "Curtain stucco for uniform shells, every time.",
    desc: "Variable-speed rain sander for controlled stucco application across complex shell geometries, with extraction-ready enclosure and automatic stucco loading options.",
    highlights: [
      "Fully variable operating speed",
      "Dust-extraction hoods",
      "Automatic stucco loading",
      "Reverse-pulse jet extraction option",
    ],
    applications: ["Complex shell geometries", "Aero & defence parts"],
    specs: [
      { label: "Speed", value: "Fully variable" },
      { label: "Maximum size", value: "Up to 3,000 mm diameter" },
      { label: "Loading", value: "Automatic option" },
      { label: "Extraction", value: "Reverse-pulse jet option" },
    ],
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
    ],
    applications: ["Primary & back-up slurry rooms"],
    specs: [
      { label: "Diameter", value: "600–1,600 mm" },
      { label: "Depth", value: "600–1,500 mm" },
      { label: "Tank construction", value: "Stainless steel" },
      { label: "Support structure", value: "Rigid mild steel" },
      { label: "Mixer control", value: "Fixed / variable speed" },
      { label: "Paddle options", value: "Fixed · adjustable · water-cooled" },
      { label: "Operation", value: "Local / remote start" },
      { label: "Safety", value: "Enclosed with detachable cover" },
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
    ],
    applications: ["Investment casting foundries", "Aero & defence shells"],
    specs: [
      { label: "Software", value: "Windows based" },
      { label: "Recipes", value: "Unlimited" },
      { label: "Access", value: "Multi-level permissions" },
      { label: "Integration", value: "ERP ready" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-detail.php?id=32",
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
    category: "automation",
    group: "robotic",
    tagline: "Automate corrugated case erection and bottom sealing.",
    desc: "A six-axis robotic cell that handles multiple case magazines, forms bottom flaps and seals cases for a dependable start-of-line operation.",
    highlights: [
      "Multi-SKU recipe control",
      "Compact cell layout",
      "Remote-support-ready controls",
      "Custom end-of-arm tooling",
    ],
    applications: ["FMCG", "Food & beverage", "Pharmaceutical", "Consumer goods"],
    specs: [
      { label: "Configuration", value: "Custom by case format" },
      { label: "Control", value: "Touchscreen control system" },
      { label: "Support", value: "Ethernet enabled" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=45",
  },
  {
    code: "RA.02",
    slug: "robotic-case-packer",
    title: "Robotic Case Packer",
    image: automationImages.casePacker,
    category: "automation",
    group: "robotic",
    tagline: "Flexible robotic packing for multiple products and cases.",
    desc: "A turnkey box-filling cell with six-axis handling, product infeed, case sealing and optional labelling or coding peripherals.",
    highlights: [
      "Multi-product handling",
      "Automatic tool changes",
      "Recipe management",
      "Servo-controlled robot",
    ],
    applications: ["Food & beverage", "Pharmaceutical", "Personal care", "Household products"],
    specs: [
      { label: "Robot", value: "6-axis, application selected" },
      { label: "Formats", value: "Multi-SKU capable" },
      { label: "Integration", value: "Sealing, labelling & coding" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=46",
  },
  {
    code: "RA.03",
    slug: "robotic-palletizing",
    title: "Robotic Palletizing",
    image: automationImages.palletizer,
    category: "automation",
    group: "robotic",
    tagline: "Automatic pallet feeding, stacking and finished-stack output.",
    desc: "A configurable palletizing system designed around product geometry, cycle time, plant layout and required pallet pattern.",
    highlights: [
      "Automatic pallet feeder",
      "Multiple pallet patterns",
      "Reduced manual lifting",
      "Production monitoring",
    ],
    applications: ["Cases", "Bags", "Tins", "Bales & sacks"],
    specs: [
      { label: "Layout", value: "Custom cell design" },
      { label: "Feeding", value: "Automatic pallet feeder" },
      { label: "Control", value: "Touchscreen control system" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=44",
  },
  {
    code: "RA.04",
    slug: "robotic-pick-and-place",
    title: "Robotic Pick & Place",
    image: automationImages.pickPlaceRobotCell,
    category: "robotics",
    group: "robotic",
    tagline: "Vision-ready high-speed picking, sorting and handling.",
    desc: "Flexible robotic handling for picking, packing, sorting, defect removal, inspection and assembly across variable product flows.",
    highlights: [
      "Vision-guided handling",
      "High repeatability",
      "Custom grippers",
      "Conveyor tracking",
    ],
    applications: ["Bin picking", "Sorting", "Assembly", "Inspection"],
    specs: [
      { label: "Vision", value: "Camera and lighting as required" },
      { label: "Handling", value: "Custom end-of-arm tooling" },
      { label: "Control", value: "Touchscreen + robot controller" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=47",
  },
  {
    code: "RA.05",
    slug: "robotic-vision-system",
    title: "Vision System",
    image: automationImages.visionInspectionCell,
    category: "robotics",
    group: "robotic",
    tagline: "Give production cells reliable eyes and real-time decisions.",
    desc: "Vision systems combine cameras, purpose-built lighting and software to guide robots, inspect product quality and track parts in motion.",
    highlights: [
      "OCR & barcode checking",
      "Orientation detection",
      "Defect inspection",
      "Conveyor tracking",
    ],
    applications: ["Packaging", "Traceability", "Quality inspection", "Assembly"],
    specs: [
      { label: "Camera", value: "Fixed or robot mounted" },
      { label: "Lighting", value: "Application specific" },
      { label: "Tracking", value: "Encoder integrated" },
    ],
    officialSourceUrl: "https://www.modtechworld.com/product-robotic-detail.php?id=48",
  },
];

// Public catalogue: both company divisions, with each physical machine listed once.
// Alternate angles and configuration photos live in the machine's `images` gallery.
export const functionalities: Machine[] = [...castingMachines, ...automationMachines];

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
