import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions")({
  beforeLoad: () => {
    throw redirect({ to: "/machines", search: { division: "robotics" }, replace: true });
  },
});
