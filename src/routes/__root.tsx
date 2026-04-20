import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PostHogProvider from "../integrations/posthog/provider";
import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DocMarket — Document Marketplace" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function Devtools() {
  const [node, setNode] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (import.meta.env.PROD) return;

    let mounted = true;

    Promise.all([
      import("@tanstack/react-devtools"),
      import("@tanstack/react-router-devtools"),
      import("@tanstack/react-query-devtools"),
    ]).then(([reactDevtools, routerDevtools, queryDevtools]) => {
      if (!mounted) return;

      const TanStackDevtools = reactDevtools.TanStackDevtools;
      const TanStackRouterDevtoolsPanel =
        routerDevtools.TanStackRouterDevtoolsPanel;
      const ReactQueryDevtoolsPanel = queryDevtools.ReactQueryDevtoolsPanel;

      setNode(
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            { name: "Tanstack Query", render: <ReactQueryDevtoolsPanel /> },
          ]}
        />,
      );
    });

    return () => {
      mounted = false;
    };
  }, []);

  return node;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { location } = useRouterState();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <PostHogProvider>
          {!isAdminRoute && <Header />}
          {children}
          {!isAdminRoute && <Footer />}
          <Devtools />
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  );
}
