import caseErector from "@/assets/case-erector.png.asset.json";
import casePacker from "@/assets/case-packer.png.asset.json";
import machineTending from "@/assets/machine-tending.png.asset.json";
import palletizer from "@/assets/palletizer.png.asset.json";
import robot6Axis from "@/assets/robot-6-axis.jpg.asset.json";
import robotAmr from "@/assets/robot-amr.jpg.asset.json";
import robotCobot from "@/assets/robot-cobot.png.asset.json";
import robotLinear from "@/assets/robot-linear.jpg.asset.json";
import robotPalletizer from "@/assets/robot-palletizer.jpg.asset.json";
import robotScara from "@/assets/robot-scara.jpg.asset.json";

// Sourced from the official Modtech "Robotics & Automation" company deck.
export const automationImages = {
  caseErector: caseErector.url,
  casePacker: casePacker.url,
  machineTending: machineTending.url,
  palletizer: palletizer.url,
  robot6Axis: robot6Axis.url,
  robotAmr: robotAmr.url,
  robotCobot: robotCobot.url,
  robotLinear: robotLinear.url,
  robotPalletizer: robotPalletizer.url,
  robotScara: robotScara.url,
};

export const automationStats = [
  { value: "1994", label: "Founded" },
  { value: "1000+", label: "Projects in 45+ Countries" },
  { value: "10+", label: "Fortune 500 Customers" },
  { value: "250+", label: "Talent Pool" },
  { value: "25+", label: "Std. & As-built Modules" },
  { value: "2", label: "Manufacturing Facilities" },
];

export type AutomationSolution = {
  slug: string;
  title: string;
  image: string;
  summary: string;
  valueAdds: string[];
  includes: string[];
};

export const automationSolutions: AutomationSolution[] = [
  {
    slug: "robotic-case-erector",
    title: "Robotic Case Erector",
    image: automationImages.caseErector,
    summary:
      "An automated end-of-line packaging solution for erecting corrugated boxes and bottom sealing. The cell combines a 6-axis robot handling multiple case magazines with a bottom flap folder and case sealing head — a fast, efficient way to fully automate the start of your packaging line.",
    valueAdds: [
      "Eliminates error, delivering repeatability and reliability",
      "Repeatable operation throughout the batch, minimal SKU changeover",
      "Small footprint, high uptime, very low maintenance",
      "Rugged design for any production environment",
      "Easy to integrate with an existing line",
      "Recipe function for running different SKUs",
      "Industry 4.0 enabled",
    ],
    includes: [
      "Robotic box erector system",
      "Top & bottom taping machine",
      "Box handling conveyors",
      "Infeed conveyor integrated with your production output",
      "Touch-screen control with remote logging and monitoring capacity",
      "Guarding and interlocked safety doors",
      "Custom-built robot gripper (vacuum or mechanical)",
      "Ethernet connectivity for remote support",
    ],
  },
  {
    slug: "robotic-case-packer",
    title: "Robotic Case Packer",
    image: automationImages.casePacker,
    summary:
      "A complete box filling and packaging line where a precise 6-axis robot fills the case, with sealing, labelling and inkjet printing available as peripherals. Capable of handling multiple SKUs and product sizes on the same line.",
    valueAdds: [
      "Eliminates error and increases line reliability",
      "Maintains repeatable operation throughout the batch",
      "Automatic tool changers, very low maintenance",
      "Tooling adjustable across a wide range of product sizes",
      "Operator pendant for recipes, error reporting and diagnostics",
      "Precise 6-axis robot with servo-controlled system",
      "Remote support module for worldwide service",
      "Industry 4.0 enabled",
    ],
    includes: [
      "Robotic box filling system",
      "Top & bottom taping machine",
      "Box handling conveyors",
      "Infeed conveyor integrated with your production output",
      "Touch-screen control system with recipe management",
      "Guarding and interlocked safety doors",
      "Ethernet connectivity for remote support",
    ],
  },
  {
    slug: "robotic-palletizing",
    title: "Robotic Palletizing",
    image: automationImages.palletizer,
    summary:
      "A fully automatic palletizing system with pallet feeder, configurable for many product types and plant layouts. It runs without operator input beyond loading a stack of pallets and removing finished ones.",
    valueAdds: [
      "Reduces severe injury and fatigue to workers",
      "Increases throughput, productivity and efficiency",
      "Very low maintenance",
      "Eliminates errors, adding repeatability and reliability",
      "Industry 4.0 enabled",
    ],
    includes: [
      "Robotic palletizer",
      "Automatic pallet feeding system",
      "Pallet feeding conveyors",
      "Infeed conveyor integrated with your production output",
      "Touch-screen control with production logging and monitoring",
      "Guarding doors with interlocks and safety as required",
      "Custom-built robot gripper",
      "Ethernet connectivity for remote support",
    ],
  },
  {
    slug: "robotic-pick-and-place",
    title: "Robotic Pick & Place",
    image: automationImages.robot6Axis,
    summary:
      "A robotic handling system configurable for multiple product types and plant layouts, running without operator input while picking and placing parts from one process into another — reducing repetitive strain and fatigue while lifting throughput.",
    valueAdds: [
      "High picking accuracy and repeatable work",
      "Extremely high-speed output",
      "Vision-guided sorting, packing and defect separation",
      "Ideal for bin picking, sorting, assembly, packaging and inspection",
      "Industry 4.0 enabled",
    ],
    includes: [
      "Pick & place robot",
      "Touch-screen control system with monitoring capacity",
      "Vision camera for fill level, orientation and scanning",
      "Guarding and interlocked safety doors",
      "Bespoke robot gripper",
      "Conveyor and product station as required",
    ],
  },
  {
    slug: "machine-tending",
    title: "Machine Tending",
    image: automationImages.machineTending,
    summary:
      "Robotic loading and unloading of components on CNC machines, plastic injection moulding, wax injection cells and laminate presses. Robots handle raw material and finished parts accurately, ensuring consistent cycle times and repeatable quality on every operation.",
    valueAdds: [
      "Increased productivity and machine uptime",
      "Consistent and repeatable part handling",
      "Reduced labour costs and operator fatigue",
      "Improved workplace safety",
      "Scalable and flexible automation",
    ],
    includes: [
      "Plastic injection part take-out",
      "CNC machine loading and unloading",
      "Wax injection cell with pre & post processing",
      "Laminate and copper clad laminate press tending",
    ],
  },
  {
    slug: "vision-system",
    title: "Vision System",
    image: automationImages.robotScara,
    summary:
      "Robotic vision combines cameras, purpose-built lighting and software so the robot knows exactly where a part is and how it is oriented. Conveyor tracking lets the robot pick products while they are still moving, simplifying cell design and lowering cost.",
    valueAdds: [
      "Checking orientation and fill level",
      "Barcode print checking and OCR / OCV label verification",
      "Dent, scratch and defect detection",
      "Part detection and volume calculation on the conveyor",
      "Product quality monitoring in-process",
      "Accurate part alignment for assembly and pick & place",
    ],
    includes: [
      "Fixed or robot-mounted cameras",
      "Special purpose lighting",
      "Inspection software and calibration",
      "Belt encoder conveyor tracking",
    ],
  },
];

export const robotTypes: Array<{ name: string; image: string; desc: string }> = [
  { name: "Articulated Robot (5/6-Axis)", image: automationImages.robot6Axis, desc: "The workhorse for packing, palletizing and machine tending." },
  { name: "Collaborative Robot (Cobot)", image: automationImages.robotCobot, desc: "Safe alongside operators for light handling and inspection." },
  { name: "SCARA Robot (4-Axis)", image: automationImages.robotScara, desc: "High-speed pick, place and assembly in a compact footprint." },
  { name: "Palletizing Robot", image: automationImages.robotPalletizer, desc: "High-payload stacking for cases, bags, tins and bales." },
  { name: "Multi-Axis Linear Robot", image: automationImages.robotLinear, desc: "Long-reach gantry handling across large work envelopes." },
  { name: "AMR / AGV", image: automationImages.robotAmr, desc: "Autonomous in-plant material movement between stations." },
];

export const automationIndustries = [
  "FMCG", "Food & Beverages", "Pharmaceutical", "Dairy", "Electronics",
  "PCB Manufacturing", "Silicon Wafer Processing", "Plastic", "Chemical",
  "Investment Casting", "Foundry", "Machine Tools",
];

export const automationPartners = ["OMRON", "EPSON Robots", "Kawasaki Robotics", "ABB Robotics", "KUKA"];

export const automationCustomers = [
  "SCHOTT KAISHA", "SRF", "UNILEVER", "PERFETTI VAN MELLE", "L&T TECHNOLOGY SERVICES",
  "ATLAS PLASTIC", "HINDUSTAN UNILEVER", "WIPRO", "UPL", "USV", "PIDILITE",
  "ASTRAL PIPES", "ITC LIMITED", "PARAGON", "MITSU",
];

export const companyContact = {
  name: "Modtech Machines Pvt Ltd",
  address:
    "Survey No. 396, Plot No. 73P, New Ahmedabad Industrial Estate, B/h Zydus Research Center, NH 8A, Moraiya (Dist. Sanand), Ahmedabad 382 213, Gujarat, India.",
  email: "sales.automation@modtechworld.com",
  web: "www.modtechworld.com",
};
