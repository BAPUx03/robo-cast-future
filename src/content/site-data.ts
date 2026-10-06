import { MessagesSquare, PencilRuler, Hammer, Bot, Headphones } from "lucide-react";
import { automationImages } from "@/content/automation-data";

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
    description: "Pick-and-place, machine tending and vision-guided robotic systems.",
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
    tagline: "Heavy-duty 4-pillar construction for large patterns.",
    desc: "Robust 4-pillar wax injection press engineered for large, deep-draw investment casting patterns with parallel platen control.",
    highlights: [
      "4-pillar rigid frame",
      "Parallel platen guidance",
      "Servo wax dosing",
      "Large mould window",
    ],
    applications: ["Pumps & valves", "Energy & power", "Heavy engineering", "Defence"],
    specs: [
      { label: "Clamp force", value: "60T – 300T" },
      { label: "Mould height", value: "Up to 800 mm" },
      { label: "Wax pressure", value: "0 – 60 bar" },
      { label: "Control", value: 'PLC + 10" HMI' },
    ],
  },
  {
    code: "WI.02",
    slug: "c-frame-wax-injector",
    title: "C-Frame Wax Injector",
    image: castingProductImages.cFrameWax,
    category: "casting",
    group: "wax-injector",
    tagline: "Open C-frame access for fast mould change.",
    desc: "C-frame wax injector built for accessibility and quick mould change-over on medium-tonnage investment patterns.",
    highlights: [
      "Open 3-side mould access",
      "Toolless clamp adjust",
      "Recipe storage",
      "Servo nozzle",
    ],
    applications: ["Automotive", "Medical", "Pumps & valves"],
    specs: [
      { label: "Clamp force", value: "30T – 150T" },
      { label: "Daylight", value: "Up to 600 mm" },
      { label: "Control", value: "PLC + HMI" },
      { label: "Cycle", value: "Semi / fully auto" },
    ],
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
      { label: "Clamp force", value: "30T – 150T" },
      { label: "Cycle time", value: "From 20 s/part" },
      { label: "Control", value: "PLC + servo dosing" },
      { label: "Mode", value: "Manual / semi / auto" },
    ],
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
    ],
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
    tagline: "Stable wax temperature, every shift, every shot.",
    desc: "Indirect water-jacket wax melting tank with PID control and continuous agitation for stable viscosity and uptime.",
    highlights: [
      "Twin-jacket heating",
      "Continuous agitation",
      "Auto top-up",
      "Insulated SS-304 body",
    ],
    applications: ["Investment casting foundries", "Pattern shops"],
    specs: [
      { label: "Capacity", value: "100 – 2000 kg" },
      { label: "Heating", value: "Indirect water-jacket" },
      { label: "Control", value: "PID, ±1 °C" },
      { label: "Body", value: "SS-304 insulated" },
    ],
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
    desc: "Automated wax cell that manages trays, handles injected patterns and combines gate cutting, de-flashing, orientation and vision inspection in one guarded process.",
    highlights: [
      "KUKA KR10 robot integration",
      "Automatic tray loading and unloading",
      "Pattern pickup, gate cutting and de-flashing",
      "Vision inspection and flexible spraying",
    ],
    applications: ["High-volume foundries", "Automotive Tier-1"],
    specs: [
      { label: "Robot platform", value: "KUKA KR10" },
      { label: "Handling", value: "Automated tray management" },
      { label: "Inspection", value: "Vision based" },
      { label: "Control", value: "Operator control system" },
    ],
  },
  {
    code: "WA.02",
    slug: "kawas",
    title: "KAWAS — Robotic Wax Assembly Cell",
    image: castingGalleryImage("kawas", "front.webp"),
    images: [castingGalleryImage("kawas", "front.webp")],
    category: "casting",
    group: "wax-automation",
    tagline: "Enclosed robotic handling for repeatable wax-component assembly.",
    desc: "KAWAS is an enclosed robotic cell for repeatable wax-component handling and assembly, with guarded access, dedicated fixtures and operator HMI control.",
    highlights: [
      "Industrial robot integration",
      "Dedicated part fixtures",
      "Guarded cell enclosure",
      "Operator HMI",
    ],
    applications: ["Wax rooms", "Pattern assembly", "Repetitive component handling"],
    specs: [
      { label: "Robot", value: "Industrial multi-axis" },
      { label: "Control", value: "PLC + HMI" },
      { label: "Cell", value: "Fully guarded" },
      { label: "Fixtures", value: "Project specific" },
    ],
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
    tagline: "Uniform stucco coating for fine ceramic shells.",
    desc: "Fluidized bed stucco unit delivering uniform, controllable sand coating for primary and back-up coats.",
    highlights: [
      "Uniform fluidization",
      "Adjustable air flow",
      "Even particle coverage",
      "Easy media change",
    ],
    applications: ["Primary coats", "Fine-finish shells"],
    specs: [
      { label: "Bed area", value: "0.25 – 1.0 m²" },
      { label: "Media", value: "Zircon, silica, mullite" },
      { label: "Air control", value: "VFD blower" },
      { label: "Body", value: "SS-304" },
    ],
  },
  {
    code: "SH.04",
    slug: "wash-rinse-prewet-tanks",
    title: "Wash, Rinse & Pre-Wet Tanks",
    image: castingProductImages.washRinseTanks,
    category: "casting",
    group: "shelling",
    tagline: "Tree preparation tanks for clean shell builds.",
    desc: "Wash, rinse and pre-wet tanks engineered to prepare wax trees and shells with consistent surface conditions.",
    highlights: [
      "Filtered recirculation",
      "Temperature control",
      "Drain & overflow",
      "Modular sizing",
    ],
    applications: ["Shell rooms", "Pattern preparation"],
    specs: [
      { label: "Capacity", value: "100 – 1000 L" },
      { label: "Body", value: "SS-304" },
      { label: "Filtration", value: "Inline" },
      { label: "Control", value: "PLC optional" },
    ],
  },
  {
    code: "SH.05",
    slug: "slurry-tank",
    title: "Slurry Mixer",
    image: castingGalleryImage("slurry-mixer", "front.webp"),
    images: [
      castingGalleryImage("slurry-mixer", "front.webp"),
      castingGalleryImage("slurry-mixer", "side.webp"),
    ],
    category: "casting",
    group: "shelling",
    tagline: "Consistent mixing for stable ceramic slurry.",
    desc: "Ceramic slurry mixer built around a rotating tank and fixed paddle arrangement for consistent mixing, safe access and straightforward cleaning.",
    highlights: [
      "Fixed paddle with rotating tank",
      "Consistent slurry mixing",
      "Detachable tank covers",
      "Safety enclosure",
    ],
    applications: ["Primary & back-up slurry rooms"],
    specs: [
      { label: "Mixing action", value: "Rotating tank · fixed paddle" },
      { label: "Cover", value: "Detachable" },
      { label: "Safety", value: "Enclosed working area" },
      { label: "Configuration", value: "Application specific" },
    ],
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
    tagline: "Rigid 4-pillar ceramic core injection in 50T and 100T configurations.",
    desc: "Heavy-duty 4-pillar ceramic core injector with guarded working area, hydraulic clamping and HMI control. The gallery shows both 50T and 100T machine configurations.",
    highlights: [
      "4-pillar rigidity",
      "High-pressure hydraulic clamp",
      "Heated barrel",
      "Servo dosing",
    ],
    applications: ["Aerospace turbine cores", "Complex internal geometries"],
    specs: [
      { label: "Clamp force", value: "100T – 200T" },
      { label: "Pressure", value: "Up to 1500 bar" },
      { label: "Control", value: "PLC + servo" },
      { label: "Mould change", value: "Quick-clamp system" },
    ],
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
    highlights: ["Open mould access", "Toolless clamp", "Heated barrel", "Servo controls"],
    applications: ["Turbine cores", "Industrial ceramics"],
    specs: [
      { label: "Clamp force", value: "60T – 120T" },
      { label: "Pressure", value: "Up to 1200 bar" },
      { label: "Control", value: "PLC + HMI" },
      { label: "Mode", value: "Semi / fully auto" },
    ],
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
      "Heavy-duty spindle",
      "Operator-safe enclosure",
      "Coolant management",
      "Adjustable fixturing",
    ],
    applications: ["Foundry fettling rooms", "Post-cast processing"],
    specs: [
      { label: "Wheel size", value: "Up to 400 mm" },
      { label: "Power", value: "5.5 – 11 kW" },
      { label: "Cut capacity", value: "Up to Ø 80 mm" },
      { label: "Safety", value: "Interlocked guard" },
    ],
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
      { label: "Mould envelope", value: "200×150×150 to 700×400×400 mm" },
      { label: "Maximum mould", value: "100 kg" },
      { label: "Clamp", value: "500 mm stroke · 200 kg force" },
      { label: "Pneumatics", value: "7 bar · 46 CFM" },
      { label: "Hammer", value: "1,000 BPM adjustable" },
      { label: "Electrical", value: "1 kVA · 380 V · 3 phase · 50 Hz" },
    ],
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
      { label: "Control", value: "PLC + touchscreen HMI" },
      { label: "Support", value: "Ethernet enabled" },
    ],
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
      { label: "Control", value: "PLC + HMI" },
    ],
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
      { label: "Vision", value: "Optional camera & lighting" },
      { label: "Handling", value: "Custom end-of-arm tooling" },
      { label: "Control", value: "PLC + robot controller" },
    ],
  },
  {
    code: "RA.05",
    slug: "machine-tending",
    title: "Machine Tending",
    image: automationImages.machineTending,
    category: "robotics",
    group: "robotic",
    tagline: "Reliable loading and unloading for machines and presses.",
    desc: "Robotic machine tending for CNC equipment, injection moulding, wax injection and press operations, improving uptime and reducing repetitive manual work.",
    highlights: [
      "Machine interface integration",
      "Part presentation",
      "Safety-rated cells",
      "Cycle-time consistency",
    ],
    applications: ["CNC machining", "Plastic injection", "Wax injection", "Press tending"],
    specs: [
      { label: "Cell", value: "Single or multi-machine" },
      { label: "Robot", value: "Payload selected by part" },
      { label: "Interface", value: "Machine I/O integration" },
    ],
  },
  {
    code: "RA.06",
    slug: "robotic-vision-system",
    title: "Robotic Vision System",
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
