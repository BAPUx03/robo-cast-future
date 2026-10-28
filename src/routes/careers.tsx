import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, BriefcaseBusiness, Mail } from "lucide-react";
import { PageHero, PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

const HR_EMAIL = "hr@modtechworld.com";

type Vacancy = {
  id: string;
  title: string;
  openings: number;
  qualification: string;
  experience: string;
};

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | Modtech Machine" },
      {
        name: "description",
        content:
          "Explore career opportunities at Modtech Machine and apply directly to our HR team.",
      },
      { property: "og:title", content: "Careers at Modtech Machine" },
    ],
  }),
  component: CareersPage,
});

function applyHref(title: string) {
  return `mailto:${HR_EMAIL}?subject=${encodeURIComponent(`Application for ${title}`)}`;
}

function CareersPage() {
  const {
    data: vacancies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-career-vacancies"],
    queryFn: async (): Promise<Vacancy[]> => {
      const { data, error } = await supabase
        .from("career_vacancies")
        .select("id, title, openings, qualification, experience")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <PageShell>
      <PageHero
        title={
          <>
            Build what&apos;s next <span className="text-gradient-brand">with Modtech.</span>
          </>
        }
        subtitle="Explore opportunities across investment casting machinery, robotics and industrial automation."
      />

      <section className="px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="openings-title">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                / careers
              </p>
              <h2 id="openings-title" className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Current openings
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Choose a role and email your CV to our HR team. The Apply button opens your email
                app with the vacancy name in the subject.
              </p>
            </div>
            <a
              href={`mailto:${HR_EMAIL}`}
              className="inline-flex w-fit items-center gap-2 break-all rounded-full border border-brand/40 bg-brand/10 px-5 py-3 text-sm font-medium text-brand transition hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Mail className="h-4 w-4 shrink-0" /> {HR_EMAIL}
            </a>
          </div>

          {isLoading ? (
            <div className="mt-10 grid gap-4" aria-label="Loading vacancies">
              {[0, 1].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-2xl bg-card" />
              ))}
            </div>
          ) : vacancies.length > 0 ? (
            <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="hidden grid-cols-[2fr_0.7fr_1.5fr_1.2fr_auto] gap-5 border-b border-border bg-secondary/40 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground lg:grid">
                <span>Vacancy name</span>
                <span>No. of vacancies</span>
                <span>Educational qualification</span>
                <span>Required experience</span>
                <span className="sr-only">Apply</span>
              </div>
              <ul className="divide-y divide-border">
                {vacancies.map((vacancy) => (
                  <li
                    key={vacancy.id}
                    className="grid gap-5 px-5 py-6 transition hover:bg-secondary/20 sm:px-6 lg:grid-cols-[2fr_0.7fr_1.5fr_1.2fr_auto] lg:items-center"
                  >
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground lg:hidden">
                        Vacancy name
                      </span>
                      <h3 className="mt-1 font-display text-lg font-semibold text-foreground lg:mt-0">
                        {vacancy.title}
                      </h3>
                    </div>
                    <VacancyDetail label="No. of vacancies" value={String(vacancy.openings)} />
                    <VacancyDetail
                      label="Educational qualification"
                      value={vacancy.qualification}
                    />
                    <VacancyDetail label="Required experience" value={vacancy.experience} />
                    <a
                      href={applyHref(vacancy.title)}
                      aria-label={`Apply for ${vacancy.title} by email`}
                      className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      Apply <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center sm:p-12">
              <BriefcaseBusiness className="mx-auto h-8 w-8 text-brand" />
              <h3 className="mt-4 font-display text-xl font-semibold">
                {isError ? "Openings are temporarily unavailable" : "No current openings"}
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {isError
                  ? "Please contact our HR team for current opportunities."
                  : "Please check back soon. You can still email your CV to our HR team."}
              </p>
              <a
                href={`mailto:${HR_EMAIL}?subject=${encodeURIComponent("Career enquiry")}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground transition hover:-translate-y-0.5"
              >
                Email HR <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function VacancyDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground lg:hidden">
        {label}
      </span>
      <span className="mt-1 block text-sm leading-relaxed text-foreground/85 lg:mt-0">{value}</span>
    </div>
  );
}
