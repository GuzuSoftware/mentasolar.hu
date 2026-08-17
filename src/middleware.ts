import { defineMiddleware } from "astro:middleware";

const immutableSlugScript = String.raw`<script>
  (() => {
    // Keystatic a fájlnévhez kötött azonosító átnevezését nem kezeli helyben.
    // A meglévő bejegyzésekben ezért az azonosító csak olvasható.
    const itemId = decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) || "");

    const lockSlug = () => {
      for (const input of document.querySelectorAll("input")) {
        if (input.value !== itemId || input.dataset.mentasolarSlugLocked === "true") continue;

        input.dataset.mentasolarSlugLocked = "true";
        input.readOnly = true;
        input.setAttribute("aria-readonly", "true");
        input.setAttribute("title", "A technikai azonosító mentés után nem módosítható.");
        input.style.cursor = "not-allowed";
        input.style.opacity = "0.72";
      }
    };

    lockSlug();
    new MutationObserver(lockSlug).observe(document.documentElement, { childList: true, subtree: true });
  })();
</script>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const { pathname } = context.url;
  const isAdminOrApiRoute = pathname === "/keystatic" || pathname.startsWith("/keystatic/") || pathname.startsWith("/api/");
  const isExistingKeystaticItem = /^\/keystatic\/collection\/[^/]+\/item\/[^/]+$/.test(pathname);
  const headers = new Headers(response.headers);

  if (isAdminOrApiRoute) {
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  if (!isExistingKeystaticItem || !response.headers.get("content-type")?.includes("text/html")) {
    if (!isAdminOrApiRoute) return response;

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const html = await response.text();
  headers.delete("content-length");

  // A Keystatic Astro-integráció egy HTML-fragmentet ad vissza, ezért nincs
  // garantált </body> zárótag, amely elé a scriptet be lehetne szúrni.
  return new Response(`${html}${immutableSlugScript}`, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
