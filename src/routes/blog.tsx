import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  ssr: false,
  beforeLoad: ({ location }) => {
    const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
    if (normalizedPath === "/blog") {
      throw redirect({ to: "/news", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "News & Insights — Modtech Machinery" },
      {
        name: "description",
        content: "Engineering articles, case studies and company news from Modtech Machinery.",
      },
    ],
  }),
  component: Outlet,
});
