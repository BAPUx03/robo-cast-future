import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/process")({
  beforeLoad: () => {
    throw redirect({ to: "/about", hash: "process", replace: true });
  },
});
