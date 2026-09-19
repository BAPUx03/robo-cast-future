import { createFileRoute } from "@tanstack/react-router";
import { SolutionsContent } from "@/routes/automation";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Services & Solutions — Modtech Machinery" },
      {
        name: "description",
        content:
          "Turnkey robotic packaging, palletizing, pick-and-place, machine tending and vision solutions engineered by Modtech.",
      },
      { property: "og:title", content: "Modtech Services & Automation Solutions" },
      {
        property: "og:description",
        content:
          "Explore Modtech's engineering services and turnkey robotic automation solutions for industrial production lines.",
      },
    ],
  }),
  component: SolutionsContent,
});
