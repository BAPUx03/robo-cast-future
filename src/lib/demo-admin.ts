export const DEMO_EMAIL = import.meta.env.VITE_DEMO_ADMIN_EMAIL ?? "";
export const DEMO_PASSWORD = import.meta.env.VITE_DEMO_ADMIN_PASSWORD ?? "";

const SESSION_KEY = "modtech-demo-admin";
const DATA_KEY = "modtech-demo-admin-data";

export type DemoRow = Record<string, unknown> & { id?: string };

type DemoData = Record<string, DemoRow[]>;

const initialData: DemoData = {
  blog_posts: [
    {
      id: "demo-post-1",
      title: "Building repeatable investment casting workflows",
      slug: "repeatable-investment-casting-workflows",
      kind: "article",
      category: "casting",
      author: "Modtech Machinery",
      read_minutes: 5,
      cover_url: "",
      excerpt: "A practical guide to improving process consistency across the foundry floor.",
      body: "Demo article content for local admin testing.",
      tags: ["casting", "process"],
      pinned: true,
      published: true,
      published_at: "2026-09-18T10:00:00.000Z",
      updated_at: "2026-09-18T10:00:00.000Z",
    },
  ],
  products: [
    {
      id: "demo-product-1",
      title: "Six Axis Robotic Cell",
      code: "MRC-600",
      slug: "six-axis-robotic-cell",
      category: "robotics",
      sort_order: 1,
      image_url: "/productsimg/robots/robot-6-axis.jpg",
      tagline: "Flexible automation for demanding production lines.",
      description: "Demo product used for local admin testing.",
      highlights: ["Flexible", "Repeatable", "Connected"],
      applications: ["Machine tending", "Material handling"],
      specs: [{ label: "Payload", value: "20 kg" }],
      published: true,
      updated_at: "2026-09-18T10:00:00.000Z",
    },
  ],
  news_items: [
    {
      id: "demo-news-1",
      title: "New automation cell commissioned",
      tag: "Company",
      category: "automation",
      date_label: "SEP 2026",
      sort_order: 1,
      image_url: "",
      excerpt: "Demo news entry for the local control centre.",
      body: "## Project overview\n\nA new automation cell has been commissioned for repeatable, high-throughput production.\n\n## Key outcomes\n\n- Improved cycle consistency\n- Better operator safety\n- Production data visibility",
      published: true,
      updated_at: "2026-09-18T10:00:00.000Z",
    },
  ],
  exhibitions: [
    {
      id: "demo-event-1",
      title: "Industrial Automation Expo",
      date_label: "NOV 2026",
      location: "Pune, India",
      sort_order: 1,
      image_url: "",
      published: true,
      updated_at: "2026-09-18T10:00:00.000Z",
    },
  ],
  enquiries: [
    {
      id: "demo-enquiry-1",
      name: "Demo Customer",
      company: "Example Manufacturing",
      email: "customer@example.com",
      phone: "+91 90000 00000",
      message: "We would like to discuss a robotic machine-tending cell.",
      status: "new",
      created_at: "2026-09-19T08:30:00.000Z",
    },
  ],
  site_settings: [
    { key: "admin_notify_email", value: "sales@modtech.example" },
    { key: "sender_email", value: "noreply@modtech.example" },
    { key: "sender_name", value: "Modtech Machinery" },
  ],
};

export function hasDemoSession() {
  return import.meta.env.DEV && sessionStorage.getItem(SESSION_KEY) === "active";
}

export function startDemoSession() {
  sessionStorage.setItem(SESSION_KEY, "active");
}

export function endDemoSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function readData(): DemoData {
  const stored = localStorage.getItem(DATA_KEY);
  if (!stored) return structuredClone(initialData);
  try {
    return JSON.parse(stored) as DemoData;
  } catch {
    return structuredClone(initialData);
  }
}

function writeData(data: DemoData) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function getDemoRows(table: string) {
  return readData()[table] ?? [];
}

export function saveDemoRow(table: string, row: DemoRow) {
  const data = readData();
  const rows = data[table] ?? [];
  const next = { ...row, id: row.id ?? `demo-${crypto.randomUUID()}` };
  const index = rows.findIndex((item) => item.id === next.id);
  if (index >= 0) rows[index] = next;
  else rows.unshift(next);
  data[table] = rows;
  writeData(data);
}

export function deleteDemoRow(table: string, id: string) {
  const data = readData();
  data[table] = (data[table] ?? []).filter((item) => item.id !== id);
  writeData(data);
}

export function updateDemoRow(table: string, id: string, values: DemoRow) {
  const data = readData();
  data[table] = (data[table] ?? []).map((item) => (item.id === id ? { ...item, ...values } : item));
  writeData(data);
}

export function saveDemoSettings(values: Record<string, string>) {
  const data = readData();
  data.site_settings = Object.entries(values).map(([key, value]) => ({ key, value }));
  writeData(data);
}
