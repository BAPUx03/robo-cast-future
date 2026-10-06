import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Blogs — Modtech Machine" },
      {
        name: "description",
        content: "Engineering blogs, case studies and company updates from Modtech Machine.",
      },
    ],
  }),
  component: Outlet,
});
