import "url-search-params-polyfill";
import { VueGtmUseOptions } from "./config";

/**
 * Load GTM script tag.
 *
 * @param id GTM ID.
 * @param config The config object.
 * @param initialMessageData A data to be injected to initial message.
 */
export function loadScript(
  id: string,
  config: Pick<VueGtmUseOptions, "defer" | "compatibility" | "queryParams" | "initialMessageData"> = {},
): void {
  const doc: Document = document;
  const script: HTMLScriptElement = doc.createElement("script");

  window.dataLayer = window.dataLayer ?? [];

  window.dataLayer?.push({
    event: "gtm.js",
    "gtm.start": new Date().getTime(),
    ...config.initialMessageData
  });

  if (!id) {
    return;
  }

  script.async = !config.defer;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  script.defer = Boolean(config.defer || config.compatibility);

  const queryString: URLSearchParams = new URLSearchParams({
    id,
    ...(config.queryParams ?? {}),
  });
  script.src = `https://www.googletagmanager.com/gtm.js?${queryString}`;
  doc.body.appendChild(script);
}

/**
 * Check if GTM script is in the document.
 *
 * @returns `true` if in the `document` is a `script` with `src` containing `googletagmanager.com/gtm.js`, otherwise `false`.
 */
export function hasScript(): boolean {
  return Array.from(document.getElementsByTagName("script")).some((script) =>
    script.src.includes("googletagmanager.com/gtm.js")
  );
}
