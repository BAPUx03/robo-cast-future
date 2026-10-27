import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/industries")({
  beforeLoad: () => {
    throw redirect({ to: "/about", hash: "industries", replace: true });
  },
});
