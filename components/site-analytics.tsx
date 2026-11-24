"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageDuration, recordPageView } from "@/lib/analytics";

export default function SiteAnalytics() {
  return (
    <Suspense fallback={null}>
      <RouteAnalytics />
    </Suspense>
  );
}

function RouteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const startedAt = Date.now();
    let recorded = false;
    recordPageView(pathname);

    function recordDuration() {
      if (recorded) return;
      recorded = true;
      recordPageDuration(pathname, (Date.now() - startedAt) / 1000);
    }

    window.addEventListener("pagehide", recordDuration);
    return () => {
      window.removeEventListener("pagehide", recordDuration);
      recordDuration();
    };
  }, [pathname]);

  return null;
}
