import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/automation")({
  beforeLoad: () => {
    throw redirect({ to: "/about", hash: "solutions", replace: true });
  },
});
