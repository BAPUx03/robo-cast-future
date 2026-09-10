import { MessagesSquare, PencilRuler, Hammer, Bot, Headphones } from "lucide-react";
import roboticsImg from "@/assets/robotics-visual.jpg";
import castingImg from "@/assets/casting-visual.jpg";
import mWaxInjector from "@/assets/m-wax-injector.jpg";
import mMeltingTank from "@/assets/m-melting-tank.jpg";
import mInjectionCell from "@/assets/m-injection-cell.jpg";
import mShearMixer from "@/assets/m-shear-mixer.jpg";
import mRainSander from "@/assets/m-rain-sander.jpg";
import mSlurryTank from "@/assets/m-slurry-tank.jpg";
import mShellingCell from "@/assets/m-shelling-cell.jpg";
import mCeramicInjector from "@/assets/m-ceramic-injector.jpg";
import newsRoboticImg from "@/assets/news-robotic-cell.jpg";
import newsRoboticWebp from "@/assets/news-robotic-cell.webp";
import newsAutomationImg from "@/assets/news-automation-line.jpg";
import newsAutomationWebp from "@/assets/news-automation-line.webp";
import newsCastingImg from "@/assets/news-casting-pour.jpg";
import newsCastingWebp from "@/assets/news-casting-pour.webp";

export type Mode = "casting" | "robotic";
export type Category = "casting" | "robotic" | "automation";

export const categoryMeta: Record<Category, { label: string; accent: string }> = {
  casting:    { label: "Investment Casting", accent: "from-copper to-brand" },
  robotic:    { label: "Robotics",           accent: "from-brand to-cyan" },
  automation: { label: "Automation",         accent: "from-cyan to-brand" },
};

// Stats sourced from the official Modtech company deck.
export const stats = [
  { value: "1994",  label: "Founded" },
  { value: "45+",   label: "Countries Served" },
  { value: "1000+", label: "Projects Delivered" },
  { value: "250+",  label: "Talent Pool" },
];

export const clients = [
  "SCHOTT KAISHA", "SRF", "UNILEVER", "PERFETTI VAN MELLE", "L&T TECHNOLOGY SERVICES",
  "HINDUSTAN UNILEVER", "WIPRO", "UPL", "USV", "PIDILITE", "ASTRAL PIPES",
  "ITC LIMITED", "PARAGON", "MITSU", "ATLAS PLASTIC",
];

// Industries Modtech serves — used by the marquee strip under the hero.
export const industries = [
  "Automotive", "Aerospace", "Defence", "Energy & Power", "Oil & Gas",
  "Heavy Engineering", "Pumps & Valves", "Medical", "Railways",
  "Industrial Tooling", "Marine", "Agricultural Equipment",
];

export const modeData: Record<Mode, {
  label: string; kicker: string; title: string; description: string; image: string;
  features: { title: string; desc: string }[]; primaryCta: string; secondaryCta: string;
}> = {
  casting: {
    label: "Investment Casting",
    kicker: "Precision foundry machinery",
    title: "End-to-end casting line equipment, built for uptime.",
    description:
      "From wax injectors and conditioning tanks to slurry machines, rain sanders and ceramic injectors — industrial reliability across every step of the line.",
    image: castingImg,
    features: [
      { title: "Wax injectors",     desc: "Servo-clamp 30T to 300T capacity." },
      { title: "Slurry systems",    desc: "Closed-loop viscosity control." },
      { title: "Rain sanders",      desc: "Curtain stucco for complex shells." },
      { title: "Ceramic injectors", desc: "Hydraulic precision for cores." },
    ],
    primaryCta: "Explore machines",
    secondaryCta: "Request a quote",
  },
  robotic: {
    label: "Robotics & Automation",
    kicker: "Autonomous production cells",
    title: "Robots, vision & PLC logic engineered as one cell.",
    description:
      "Six-axis robot integration, shelling automation, wax-room robotics and PLC-driven process control — built and validated under one roof.",
    image: roboticsImg,
    features: [
      { title: "Robot cell integration", desc: "Custom EOAT, fencing, safety I/O and HMI." },
      { title: "Shelling automation",    desc: "Hands-off dip · drain · stucco cycles." },
      { title: "Vision & sensors",       desc: "Real-time QC and closed-loop control." },
      { title: "PLC + HMI",              desc: "Production data, recipes and traceability." },
    ],
    primaryCta: "Explore machines",
    secondaryCta: "Talk to engineering",
  },
};

export const divisions: Array<{
  code: string; title: string; tag: string; image: string;
  description: string; points: string[]; category: Category;
}> = [
  {
    code: "DIV.01",
    title: "Investment Casting",
    tag: "Precision foundry machinery",
    image: castingImg,
    category: "casting",
    description:
      "End-to-end casting line equipment — wax injectors, conditioning tanks, slurry machines, rain sanders, and ceramic injectors built for industrial reliability.",
    points: ["Wax injectors","Conditioning tanks","Slurry equipment","Rain sanders","Ceramic injectors","Fettling equipment"],
  },
  {
    code: "DIV.02",
    title: "Robotics & Automation",
    tag: "Autonomous production cells",
    image: roboticsImg,
    category: "robotic",
    description:
      "Six-axis robot integration, shelling cells, wax-room automation and PLC-driven process control engineered for repeatable factory output.",
    points: ["Robot cell integration","Shelling automation","Wax room robotics","PLC + HMI control","Vision & sensors","Safety systems"],
  },
];

export type Machine = {
  code: string; slug: string; title: string; image: string; desc: string;
  category: Category; tagline: string;
  group: "wax-injector" | "tank" | "wax-automation" | "shelling" | "ceramic-injector" | "fettling" | "robotic";
  highlights: string[]; applications: string[];
  specs: { label: string; value: string }[];
};

// Full product catalogue — mirrors modtechworld.com product taxonomy.
export const functionalities: Machine[] = [
  // ---------- Wax Injectors (IGT special-purpose, up to 300T) ----------
  { code: "WI.01", slug: "4-pillar-wax-injector", title: "4-Pillar Wax Injector", image: mWaxInjector, category: "casting", group: "wax-injector",
    tagline: "Heavy-duty 4-pillar construction for large patterns.",
    desc: "Robust 4-pillar wax injection press engineered for large, deep-draw investment casting patterns with parallel platen control.",
    highlights: ["4-pillar rigid frame", "Parallel platen guidance", "Servo wax dosing", "Large mould window"],
    applications: ["Pumps & valves", "Energy & power", "Heavy engineering", "Defence"],
    specs: [
      { label: "Clamp force", value: "60T – 300T" },
      { label: "Mould height", value: "Up to 800 mm" },
      { label: "Wax pressure", value: "0 – 60 bar" },
      { label: "Control", value: "PLC + 10\" HMI" },
    ],
  },
  { code: "WI.02", slug: "c-frame-wax-injector", title: "C-Frame Wax Injector", image: mWaxInjector, category: "casting", group: "wax-injector",
    tagline: "Open C-frame access for fast mould change.",
    desc: "C-frame wax injector built for accessibility and quick mould change-over on medium-tonnage investment patterns.",
    highlights: ["Open 3-side mould access", "Toolless clamp adjust", "Recipe storage", "Servo nozzle"],
    applications: ["Automotive", "Medical", "Pumps & valves"],
    specs: [
      { label: "Clamp force", value: "30T – 150T" },
      { label: "Daylight", value: "Up to 600 mm" },
      { label: "Control", value: "PLC + HMI" },
      { label: "Cycle", value: "Semi / fully auto" },
    ],
  },
  { code: "WI.03", slug: "automode-wax-injector", title: "Automode Wax Injector", image: mInjectionCell, category: "casting", group: "wax-injector",
    tagline: "Fully automatic injection with auto pattern eject.",
    desc: "Automode wax injector with automatic mould close, inject, dwell, open and pattern eject — engineered for high-volume foundries.",
    highlights: ["Fully automatic cycle", "Auto pattern eject", "Cycle counter & traceability", "Multi-recipe HMI"],
    applications: ["High-volume foundries", "Automotive Tier-1"],
    specs: [
      { label: "Clamp force", value: "30T – 150T" },
      { label: "Cycle time", value: "From 20 s/part" },
      { label: "Control", value: "PLC + servo dosing" },
      { label: "Mode", value: "Manual / semi / auto" },
    ],
  },
  { code: "WI.04", slug: "igt-wax-injector", title: "IGT Wax Injector (up to 300T)", image: mWaxInjector, category: "casting", group: "wax-injector",
    tagline: "Special-purpose IGT wax injector to 300T clamp.",
    desc: "IGT (Industrial Gas Turbine) class wax injector engineered for very large, complex aerospace and energy patterns up to 300T clamp force.",
    highlights: ["Up to 300T clamp", "Heavy platen rigidity", "Closed-loop temperature ±0.5°C", "High shot volume"],
    applications: ["IGT components", "Aerospace structures", "Power generation"],
    specs: [
      { label: "Clamp force", value: "Up to 300T" },
      { label: "Shot volume", value: "Up to 12,500 cc" },
      { label: "Temperature", value: "±0.5 °C closed-loop" },
      { label: "Control", value: "PLC + servo" },
    ],
  },

  // ---------- Wax conditioning tanks ----------
  { code: "TK.01", slug: "wax-melting-tank", title: "Wax Melting Tank", image: mMeltingTank, category: "casting", group: "tank",
    tagline: "Stable wax temperature, every shift, every shot.",
    desc: "Indirect water-jacket wax melting tank with PID control and continuous agitation for stable viscosity and uptime.",
    highlights: ["Twin-jacket heating", "Continuous agitation", "Auto top-up", "Insulated SS-304 body"],
    applications: ["Investment casting foundries", "Pattern shops"],
    specs: [
      { label: "Capacity", value: "100 – 2000 kg" },
      { label: "Heating", value: "Indirect water-jacket" },
      { label: "Control", value: "PID, ±1 °C" },
      { label: "Body", value: "SS-304 insulated" },
    ],
  },
  { code: "TK.02", slug: "wax-conditioning-tank", title: "Wax Conditioning Tank", image: mMeltingTank, category: "casting", group: "tank",
    tagline: "Holds wax at injection-ready viscosity, 24/7.",
    desc: "Wax conditioning tank that holds molten wax at injection-ready viscosity with low-shear stirring and accurate temperature control.",
    highlights: ["Low-shear stirring", "PID temperature control", "Auto level sensor", "Hygienic SS body"],
    applications: ["Wax rooms", "Pattern shops"],
    specs: [
      { label: "Capacity", value: "100 – 1500 kg" },
      { label: "Control", value: "PID, ±1 °C" },
      { label: "Stirrer", value: "Low-shear, VFD" },
      { label: "Body", value: "SS-304" },
    ],
  },

  // ---------- Wax-room automation ----------
  { code: "WA.01", slug: "wax-injection-cell", title: "Wax Injection Cell", image: mInjectionCell, category: "automation", group: "wax-automation",
    tagline: "Robotic transfer for hands-off pattern production.",
    desc: "Robotic wax injection cell that pairs the injector with a 6-axis robot, conveyor and vision QC for hands-off pattern production.",
    highlights: ["6-axis robot loader", "Auto pattern eject", "Vision QC", "Safety-fenced cell"],
    applications: ["High-volume foundries", "Automotive Tier-1"],
    specs: [
      { label: "Cycle time", value: "From 18 s/part" },
      { label: "Robot", value: "6-axis, 12 kg payload" },
      { label: "Footprint", value: "From 20 m²" },
      { label: "Safety", value: "PL-d / Cat-3" },
    ],
  },
  { code: "WA.02", slug: "kawas", title: "KAWAS — Knock-out & Wax Recovery", image: mInjectionCell, category: "automation", group: "wax-automation",
    tagline: "Automated wax recovery and assembly station.",
    desc: "KAWAS automation cell for tree assembly, wax recovery and re-circulation — reduces wax loss and manual handling.",
    highlights: ["Closed-loop wax recovery", "Auto tree assembly aids", "Reduced manual handling", "Integrated heating"],
    applications: ["Wax rooms", "Tree assembly stations"],
    specs: [
      { label: "Wax recovery", value: ">95%" },
      { label: "Control", value: "PLC + HMI" },
      { label: "Heating", value: "PID controlled" },
      { label: "Footprint", value: "Compact modular" },
    ],
  },

  // ---------- Shelling solutions ----------
  { code: "SH.01", slug: "high-shear-mixer", title: "High Shear Mixer", image: mShearMixer, category: "casting", group: "shelling",
    tagline: "Industrial slurry preparation for ceramic shells.",
    desc: "Industrial high-shear slurry preparation mixer for foundry-grade primary and back-up ceramic coatings.",
    highlights: ["Variable speed drive", "Stainless contact parts", "Toolless cleaning", "Heavy-duty bearings"],
    applications: ["Primary & back-up slurries", "Ceramic core slurries"],
    specs: [
      { label: "Capacity", value: "50 – 500 L" },
      { label: "Drive", value: "VFD, up to 7.5 kW" },
      { label: "Speed", value: "0 – 1500 rpm" },
      { label: "Body", value: "SS-304" },
    ],
  },
  { code: "SH.02", slug: "rain-sander", title: "Rain Sander", image: mRainSander, category: "casting", group: "shelling",
    tagline: "Curtain stucco for uniform shells, every time.",
    desc: "Curtain stucco rain sander for uniform sand application across complex shell geometries.",
    highlights: ["Curtain-flow stucco", "Dust extraction port", "Adjustable flow rate", "Low-maintenance design"],
    applications: ["Complex shell geometries", "Aero & defence parts"],
    specs: [
      { label: "Hopper", value: "150 – 600 kg" },
      { label: "Curtain", value: "Up to 800 mm wide" },
      { label: "Control", value: "Variable flow valve" },
      { label: "Power", value: "1.5 – 3 kW" },
    ],
  },
  { code: "SH.03", slug: "fluidized-bed", title: "Fluidized Bed", image: mRainSander, category: "casting", group: "shelling",
    tagline: "Uniform stucco coating for fine ceramic shells.",
    desc: "Fluidized bed stucco unit delivering uniform, controllable sand coating for primary and back-up coats.",
    highlights: ["Uniform fluidization", "Adjustable air flow", "Even particle coverage", "Easy media change"],
    applications: ["Primary coats", "Fine-finish shells"],
    specs: [
      { label: "Bed area", value: "0.25 – 1.0 m²" },
      { label: "Media", value: "Zircon, silica, mullite" },
      { label: "Air control", value: "VFD blower" },
      { label: "Body", value: "SS-304" },
    ],
  },
  { code: "SH.04", slug: "wash-rinse-prewet-tanks", title: "Wash, Rinse & Pre-Wet Tanks", image: mSlurryTank, category: "casting", group: "shelling",
    tagline: "Tree preparation tanks for clean shell builds.",
    desc: "Wash, rinse and pre-wet tanks engineered to prepare wax trees and shells with consistent surface conditions.",
    highlights: ["Filtered recirculation", "Temperature control", "Drain & overflow", "Modular sizing"],
    applications: ["Shell rooms", "Pattern preparation"],
    specs: [
      { label: "Capacity", value: "100 – 1000 L" },
      { label: "Body", value: "SS-304" },
      { label: "Filtration", value: "Inline" },
      { label: "Control", value: "PLC optional" },
    ],
  },
  { code: "SH.05", slug: "slurry-tank", title: "Slurry Tank", image: mSlurryTank, category: "casting", group: "shelling",
    tagline: "Closed-loop viscosity for consistent shell builds.",
    desc: "PLC-monitored slurry tank with closed-loop viscosity control for consistent primary and back-up shell builds.",
    highlights: ["Continuous low-shear stirring", "Inline viscosity sensor", "Auto binder top-up", "Recipe control"],
    applications: ["Primary & back-up slurry rooms"],
    specs: [
      { label: "Capacity", value: "200 – 2000 L" },
      { label: "Sensor", value: "Inline viscosity probe" },
      { label: "Control", value: "PLC, recipe-based" },
      { label: "Body", value: "SS-304" },
    ],
  },
  { code: "SH.06", slug: "automated-shelling-solution", title: "Automated Shelling Solution", image: mShellingCell, category: "robotic", group: "robotic",
    tagline: "Full-line automation: dip · drain · stucco · dry.",
    desc: "Six-axis robotic shelling cell automating the full dip, drain, stucco and dry cycle with multi-station layout and SCADA traceability.",
    highlights: ["6-axis robot", "Up to 6 stations", "Recipe per part", "Production traceability"],
    applications: ["Investment casting foundries", "Aero & defence shells"],
    specs: [
      { label: "Robot", value: "6-axis, 50 – 210 kg payload" },
      { label: "Stations", value: "Up to 6 (slurry + sand + dry)" },
      { label: "Throughput", value: "Up to 300 trees/shift" },
      { label: "Control", value: "PLC + SCADA" },
    ],
  },

  // ---------- Ceramic injectors ----------
  { code: "CI.01", slug: "4-pillar-ceramic-injector", title: "4-Pillar Ceramic Injector", image: mCeramicInjector, category: "casting", group: "ceramic-injector",
    tagline: "Rigid 4-pillar press for high-pressure ceramic cores.",
    desc: "Heavy-duty 4-pillar ceramic core injector with high-pressure hydraulic clamp for precision aerospace cores.",
    highlights: ["4-pillar rigidity", "High-pressure hydraulic clamp", "Heated barrel", "Servo dosing"],
    applications: ["Aerospace turbine cores", "Complex internal geometries"],
    specs: [
      { label: "Clamp force", value: "100T – 200T" },
      { label: "Pressure", value: "Up to 1500 bar" },
      { label: "Control", value: "PLC + servo" },
      { label: "Mould change", value: "Quick-clamp system" },
    ],
  },
  { code: "CI.02", slug: "c-frame-ceramic-injector", title: "C-Frame Ceramic Injector", image: mCeramicInjector, category: "casting", group: "ceramic-injector",
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
  { code: "FT.01", slug: "cut-off", title: "Cut-off Machine", image: mShellingCell, category: "casting", group: "fettling",
    tagline: "Precision gate cut-off for cast trees.",
    desc: "Industrial cut-off machine for separating castings from gates and runners with repeatable cut quality and operator safety.",
    highlights: ["Heavy-duty spindle", "Operator-safe enclosure", "Coolant management", "Adjustable fixturing"],
    applications: ["Foundry fettling rooms", "Post-cast processing"],
    specs: [
      { label: "Wheel size", value: "Up to 400 mm" },
      { label: "Power", value: "5.5 – 11 kW" },
      { label: "Cut capacity", value: "Up to Ø 80 mm" },
      { label: "Safety", value: "Interlocked guard" },
    ],
  },
  { code: "FT.02", slug: "shell-knock-off", title: "Shell Knock-off", image: mShellingCell, category: "casting", group: "fettling",
    tagline: "Pneumatic shell breaking after casting.",
    desc: "Shell knock-off station that quickly removes ceramic shell from cast trees with pneumatic chiselling and dust control.",
    highlights: ["Pneumatic chisel", "Dust extraction port", "Operator-safe cabin", "Adjustable fixturing"],
    applications: ["Post-pour fettling", "Shell de-coring"],
    specs: [
      { label: "Working area", value: "Up to 1.5 m²" },
      { label: "Air supply", value: "6 – 8 bar" },
      { label: "Dust port", value: "Standard Ø 200 mm" },
      { label: "Safety", value: "Interlocked cabin" },
    ],
  },
];

export const processSteps = [
  { code: "01", name: "Consult",  desc: "Map your line, throughput and constraints with our engineering team.", Icon: MessagesSquare },
  { code: "02", name: "Engineer", desc: "Custom mechanical, electrical and control design tailored to your part.", Icon: PencilRuler },
  { code: "03", name: "Build",    desc: "Precision fabrication and assembly inside our integrated workshop.", Icon: Hammer },
  { code: "04", name: "Automate", desc: "Robot cells, PLC logic and HMIs deployed and validated on-site.", Icon: Bot },
  { code: "05", name: "Support",  desc: "Lifecycle service, spares and continuous optimisation of output.", Icon: Headphones },
];

export const news: Array<{
  tag: string; date: string; title: string; excerpt: string;
  image: string; imageWebp: string; category: Category;
}> = [
  { tag: "Casting",    date: "JAN 2025", title: "Inside the MTW-300 wax injector & pour cell",            excerpt: "Servo clamp control, integrated conditioning tanks and a robotic pour cell engineered for repeatable quality.", image: newsCastingImg,    imageWebp: newsCastingWebp,    category: "casting" },
  { tag: "Robotic",    date: "MAR 2025", title: "Six-axis welding cell deployed for a Tier-1 supplier",   excerpt: "How a robotic welding cell raised yield by 28% and cut cycle time across the wax-to-shell process.", image: newsRoboticImg,    imageWebp: newsRoboticWebp,    category: "robotic" },
  { tag: "Automation", date: "FEB 2025", title: "PLC-driven shelling line with vision-based QC",          excerpt: "Modular conveyor + vision pipeline delivers hands-off shell building with closed-loop process control.", image: newsAutomationImg, imageWebp: newsAutomationWebp, category: "automation" },
];

// Exhibitions & events — sourced from modtechworld.com (rights confirmed by owner).
export const exhibitions: Array<{ title: string; date: string; location: string; image: string }> = [
  { title: "ICI 71st Technical Conference & Equipment Expo", date: "Oct 2024", location: "Covington, KY · USA",
    image: "https://www.modtechworld.com/storage/exhibitions/May2025/vQYP3JHX80GSroJGgtEo.jpg" },
  { title: "International Foundry Trade Fair",              date: "Mar 2025", location: "Düsseldorf · Germany",
    image: "https://www.modtechworld.com/storage/exhibitions/May2025/2mIAsEaS12gbw0p6BlrS.JPG" },
  { title: "Investment Casting Institute Expo",             date: "May 2025", location: "Atlanta, GA · USA",
    image: "https://www.modtechworld.com/storage/exhibitions/May2025/Ja9xzivUV0GVe6ITg6zS.jpg" },
  { title: "IFEX — India Foundry Congress",                 date: "Feb 2025", location: "Greater Noida · India",
    image: "https://www.modtechworld.com/storage/exhibitions/May2025/OQu3Z5bMVPEuE6aW7Eo9.png" },
  { title: "EUROGUSS Foundry Show",                          date: "Jul 2025", location: "Nuremberg · Germany",
    image: "https://www.modtechworld.com/storage/exhibitions/July2025/42mZaBVQsgrHVTXpAXb3.jpg" },
];
