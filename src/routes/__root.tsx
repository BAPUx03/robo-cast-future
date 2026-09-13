import { useState } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Modtech Machinery | Robotics & Casting Automation" },
      { name: "description", content: "Modern robotics, automation, and investment casting machinery from Modtech Machinery." },
      { name: "author", content: "Modtech Machinery" },
      { property: "og:title", content: "Modtech Machinery | Robotics & Casting Automation" },
      { property: "og:description", content: "Modern robotics, automation, and investment casting machinery from Modtech Machinery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Modtech Machinery | Robotics & Casting Automation" },
      { name: "twitter:description", content: "Modern robotics, automation, and investment casting machinery from Modtech Machinery." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/287feda9-fd9c-4936-ad26-9f550c48ffdf/id-preview-d4aa1074--308556a4-5b8e-4b2c-a6f1-1692b3c8298a.lovable.app-1778132368792.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/287feda9-fd9c-4936-ad26-9f550c48ffdf/id-preview-d4aa1074--308556a4-5b8e-4b2c-a6f1-1692b3c8298a.lovable.app-1778132368792.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  // Dark is the default theme; only an explicit stored choice switches to light.
  const themeInit = `(function(){try{var r=document.documentElement;var t=localStorage.getItem('mw-theme')==='light'?'light':'dark';r.classList.toggle('light',t==='light');r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;}catch(e){}})();`;
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }));
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
