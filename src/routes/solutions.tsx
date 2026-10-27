import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/solutions")({
  beforeLoad: () => {
    throw redirect({ to: "/about", hash: "solutions", replace: true });
  },
});
