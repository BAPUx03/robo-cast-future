import { createFileRoute } from "@tanstack/react-router";
import { BlogsPage } from "@/routes/news";

export const Route = createFileRoute("/blog/")({
  component: BlogsPage,
});
