const caseErector = "/productsimg/products/case-erector.png";
const casePacker = "/productsimg/products/case-packer-robot-cell.png";
const machineTending = "/productsimg/products/machine-tending-cnc-cell.png";
const palletizer = "/productsimg/products/palletizing-robot-cell.png";
const pickPlaceRobotCell = "/productsimg/products/pick-place-robot-cell.png";
const visionInspectionCell = "/productsimg/products/vision-inspection-cell.png";
const robot6Axis = "/productsimg/robots/robot-6-axis.jpg";
const robotAmr = "/productsimg/robots/robot-amr.jpeg";
const robotCobot = "/productsimg/robots/robot-cobot.png";
const robotLinear = "/productsimg/robots/robot-linear.jpg";
const robotPalletizer = "/productsimg/robots/robot-palletizer.jpg";
const robotScara = "/productsimg/robots/robot-scara.jpg";
import caseErectorFloor from "@/assets/automation/installations/case-erector-floor.png";
import palletizingFloor from "@/assets/automation/installations/palletizing-floor.png";
import pickPlaceFloor from "@/assets/automation/installations/pick-place-floor.png";
import machineTendingFloor from "@/assets/automation/installations/machine-tending-floor.png";
import casePackerLine from "@/assets/automation/applications/case-packer-line.png";
import palletizingLine from "@/assets/automation/applications/palletizing-line.png";
import palletizingCell from "@/assets/automation/applications/palletizing-cell.png";
import pickPlaceBottles from "@/assets/automation/applications/pick-place-bottles.png";
import machineTendingCnc from "@/assets/automation/applications/machine-tending-cnc.png";
import visionInspection from "@/assets/automation/applications/vision-inspection.png";
import facility from "@/assets/automation/company/facility.png";
import casting from "@/assets/automation/industries/casting.png";
import epson from "@/assets/automation/partners/epson-robots.png";
import fanuc from "@/assets/automation/partners/fanuc.png";
import kawasaki from "@/assets/automation/partners/kawasaki.png";
import omron from "@/assets/automation/partners/omron.png";
import abb from "@/assets/automation/partners/abb-robotics.jpeg";

// Curated from Modtech's approved Robotics & Automation brochure and image pack.
export const automationImages = { caseErector, casePacker, machineTending, palletizer, pickPlaceRobotCell, visionInspectionCell, robot6Axis, robotAmr, robotCobot, robotLinear, robotPalletizer, robotScara, caseErectorFloor, palletizingFloor, pickPlaceFloor, machineTendingFloor, casePackerLine, palletizingLine, palletizingCell, pickPlaceBottles, machineTendingCnc, visionInspection, facility, casting };

export const automationStats = [
  { value: "1990", label: "Founded" }, { value: "2", label: "Facilities" },
  { value: "1000+", label: "Projects in 45+ countries" }, { value: "25+", label: "Standard & custom modules" },
  { value: "10+", label: "Fortune 500 customers" }, { value: "250+", label: "Engineering talent" },
];

export type AutomationSolution = { slug: string; title: string; image: string; gallery?: string[]; summary: string; valueAdds: string[]; includes: string[]; applications: string[] };

export const automationSolutions: AutomationSolution[] = [
  { slug: "robotic-case-erector", title: "Robotic Case Erector", image: caseErector, gallery: [caseErectorFloor, casePackerLine],
    summary: "A compact start-of-line cell that erects corrugated cases and seals their bottoms. A six-axis robot handles multiple case magazines while the flap folder and sealing head keep the line moving.",
    valueAdds: ["Repeatable case quality across every batch", "Minimal SKU changeover with recipe control", "Small footprint and low-maintenance operation", "Easy integration with an existing line", "Industry 4.0-ready controls"],
    includes: ["Robotic box erector", "Bottom flap folder and taping head", "Case handling and infeed conveyors", "Touchscreen HMI with logging capacity", "Safety guarding and custom vacuum or mechanical gripper"], applications: ["FMCG", "Food & beverage", "Pharmaceutical", "Consumer goods"] },
  { slug: "robotic-case-packer", title: "Robotic Case Packer", image: casePacker, gallery: [casePackerLine, pickPlaceFloor],
    summary: "A complete box-filling line in which a precise six-axis robot loads products into cases. Sealing, labelling and inkjet coding can be integrated around the product and case format.",
    valueAdds: ["Reliable packing across multiple SKUs", "Adjustable tooling and automatic tool changes", "Recipe, diagnostics and error reporting at the operator pendant", "Servo-controlled six-axis handling", "Remote-support-ready connectivity"],
    includes: ["Robotic box filling system", "Top and bottom case sealing", "Product and case conveyors", "Recipe-based touchscreen controls", "Safety guarding and bespoke gripper"], applications: ["Food & beverage", "Pharmaceutical", "Personal care", "Household products"] },
  { slug: "robotic-palletizing", title: "Robotic Palletizing", image: palletizer, gallery: [palletizingFloor, palletizingCell],
    summary: "A fully automatic palletizing system with pallet feeding, product infeed and finished-stack output. Each cell is configured around the product, achievable cycle time and available floor space.",
    valueAdds: ["Less repetitive lifting and worker fatigue", "Higher throughput and stack consistency", "Multiple SKU and line configurations", "Very low maintenance", "Industry 4.0-ready monitoring"],
    includes: ["Palletizing robot", "Automatic pallet feeder", "Pallet and product conveyors", "Production logging touchscreen controls", "Interlocked guarding and custom end-of-arm tooling"], applications: ["Cases", "Bags", "Tins", "Bales and sacks"] },
  { slug: "robotic-pick-and-place", title: "Robotic Pick & Place", image: pickPlaceRobotCell, gallery: [pickPlaceFloor, pickPlaceBottles],
    summary: "High-speed robotic handling for picking, sorting, packing, assembly and inspection. Vision guidance can identify orientation, separate defects and adapt picks while products move through the cell.",
    valueAdds: ["High picking accuracy and repeatable work", "Fast handling for mixed product flows", "Vision-guided sorting and defect separation", "Less repetitive strain for operators", "Flexible layouts for changing products"],
    includes: ["Pick-and-place robot", "Vision camera and lighting as required", "Recipe-based controls", "Bespoke gripper", "Conveyor, product station and safety guarding"], applications: ["Bin picking", "Sorting", "Assembly", "Inspection"] },
  { slug: "machine-tending", title: "Machine Tending", image: machineTending, gallery: [machineTendingFloor, machineTendingCnc],
    summary: "Robots load raw material and unload finished parts from CNC machines, injection presses, wax injection cells and laminate presses for consistent cycle times and safer production.",
    valueAdds: ["Improved machine uptime", "Consistent part handling", "Reduced operator fatigue", "Safer workstation design", "Scalable single- or multi-machine cells"],
    includes: ["Industrial robot and end-of-arm tooling", "Machine interface and safety controls", "Part presentation or conveyor", "Recipe and diagnostics HMI", "Installation and operator training"], applications: ["CNC machining", "Plastic injection", "Wax injection", "Laminates and press tending"] },
  { slug: "vision-system", title: "Robotic Vision System", image: visionInspectionCell, gallery: [visionInspection],
    summary: "Cameras, lighting, software and robot controls work together to locate, inspect and handle parts. Conveyor tracking lets the robot calculate moving-part positions without stopping the line.",
    valueAdds: ["Orientation and fill-level checks", "Barcode, OCR and OCV verification", "Dent, scratch and defect detection", "In-process quality monitoring", "Accurate assembly alignment"],
    includes: ["Fixed or robot-mounted camera", "Purpose-built lighting", "Inspection software and calibration", "Conveyor encoder integration", "Robot and PLC interface"], applications: ["Inspection", "Traceability", "Packaging", "Conveyor tracking"] },
];

export const tendingCells = [
  { name: "Plastic Injection Part Take-Out", images: [machineTendingFloor], video: "https://youtu.be/QEIFrphd8FY" },
  { name: "CNC Machine Tending", images: [machineTending, machineTendingFloor], video: "https://youtu.be/6-B0KG4wOtc" },
  { name: "Wax Injection Cell", images: [robot6Axis, machineTendingFloor], video: "https://youtu.be/yUD12phHkuM" },
  { name: "Laminate & Press Tending", images: [robotLinear, machineTendingFloor] },
];

export const robotTypes = [
  { name: "Articulated Robot (5/6-Axis)", image: robot6Axis, desc: "Flexible industrial handling for packaging, palletizing and machine tending." },
  { name: "Collaborative Robot", image: robotCobot, desc: "Compact, collaborative handling for assisted production and inspection tasks." },
  { name: "SCARA Robot (4-Axis)", image: robotScara, desc: "High-speed pick, place and assembly in a compact footprint." },
  { name: "Autonomous Mobile Robot", image: robotAmr, desc: "Autonomous in-plant movement between workstations and material stores." },
  { name: "Multi-Axis Linear Robot", image: robotLinear, desc: "Long-reach gantry handling across larger work envelopes." },
  { name: "Palletizing Robot", image: robotPalletizer, desc: "High-payload case, bag, tin and bale stacking." },
];

export const automationIndustries = ["FMCG", "Food & beverages", "Pharmaceutical", "Dairy", "Electronics", "PCB manufacturing", "Silicon wafer processing", "Plastics", "Chemical", "E-commerce", "Investment casting", "Machine tools"];
export const automationPartners = [
  { name: "Epson Robots", image: epson }, { name: "FANUC", image: fanuc }, { name: "Kawasaki Robotics", image: kawasaki }, { name: "Omron", image: omron }, { name: "ABB Robotics", image: abb },
];
export const companyContact = {
  name: "Modtech Machines Pvt. Ltd.",
  address: "Survey No. 396, Plot No. 73P, New Ahmedabad Industrial Estate, behind Zydus Research Centre, NH 8A, Moraiya, Sanand, Ahmedabad 382 213, Gujarat, India.",
  email: "info@modtechworld.com",
  phone: "+91 97234 56251",
  automationEmail: "sales.automation@modtechworld.com",
  automationPhone: "+91 98988 73558",
  supportEmail: "customercare@modtechworld.com",
  supportPhone: "+91 87359 15913",
  sparesEmail: "spares@modtechworld.com",
  vendorEmail: "purchase@modtechworld.com",
  vendorPhone: "+91 97234 56252",
  web: "www.modtechworld.com",
};
