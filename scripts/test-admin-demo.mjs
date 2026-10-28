import assert from "node:assert/strict";
import { resolve } from "node:path";
import { createServer } from "vite";

process.env.VITE_LOCAL_ADMIN_BYPASS = "true";

const storage = new Map();
const store = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
};
globalThis.localStorage = store;
globalThis.sessionStorage = store;
globalThis.window = new EventTarget();

const server = await createServer({
  configFile: false,
  resolve: { alias: { "@": resolve("src") } },
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const demo = await server.ssrLoadModule("/src/lib/demo-admin.ts");
  const content = await server.ssrLoadModule("/src/lib/site-content.ts");
  const careers = await server.ssrLoadModule("/src/lib/career-admin.ts");
  assert.equal(demo.DEMO_MODE, true);

  const draft = {
    title: "  Test vacancy  ",
    openings: "2",
    qualification: "  Engineering diploma  ",
    experience: "  1 year  ",
    published: true,
  };
  const validated = careers.validateCareerDraft(draft);
  assert.equal(validated.error, null);
  assert.equal(validated.value.title, "Test vacancy");
  assert.equal(validated.value.openings, 2);
  assert.equal(validated.value.qualification, "Engineering diploma");
  assert.equal(draft.title, "  Test vacancy  ", "validation must not mutate the form draft");
  for (const openings of [0, -1, 1.5, "abc", Number.MAX_SAFE_INTEGER + 1]) {
    assert.match(careers.validateCareerDraft({ ...draft, openings }).error, /whole number/);
  }
  assert.match(careers.validateCareerDraft({ ...draft, title: " ".repeat(2) }).error, /required/);
  assert.match(careers.validateCareerDraft({ ...draft, title: "x".repeat(161) }).error, /160/);
  assert.match(
    careers.validateCareerDraft({ ...draft, qualification: "x".repeat(301) }).error,
    /300/,
  );

  for (const table of ["blog_posts", "products", "news_items", "exhibitions", "career_vacancies"]) {
    const original = demo.getDemoRows(table).length;
    const id = `admin-test-${table}`;
    demo.saveDemoRow(table, { id, title: "Test entry", published: false });
    assert.equal(demo.getDemoRows(table).length, original + 1, `${table} create`);
    demo.updateDemoRow(table, id, { title: "Updated entry", published: true });
    assert.equal(
      demo.getDemoRows(table).find((row) => row.id === id)?.title,
      "Updated entry",
      `${table} update`,
    );
    demo.deleteDemoRow(table, id);
    assert.equal(demo.getDemoRows(table).length, original, `${table} delete`);
  }

  const enquiryId = demo.getDemoRows("enquiries")[0]?.id;
  assert.ok(enquiryId);
  demo.updateDemoRow("enquiries", enquiryId, { status: "contacted" });
  assert.equal(demo.getDemoRows("enquiries")[0].status, "contacted");
  demo.saveDemoSettings({ admin_notify_email: "admin@example.com" });
  assert.equal(demo.getDemoRows("site_settings")[0].value, "admin@example.com");

  const about = content.getDefaultSiteContent("about");
  assert.ok(about.about_photo_1?.startsWith("/gallery/"));
  const changed = {
    ...about,
    about_photo_1: "/gallery/customer-visits/uk-customer-machine-visit.webp",
  };
  await content.saveSiteContent("about", changed);
  assert.equal(content.getSiteContent("about").about_photo_1, changed.about_photo_1);
  assert.equal((await content.fetchSiteContent("about")).about_photo_1, changed.about_photo_1);

  console.log("Admin demo CRUD, Careers validation, and About content save/reload passed.");
} finally {
  await server.close();
}
