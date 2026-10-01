import { productionSiteUrl } from "./env";
import { shopLinks } from "./locations";

export type ShortLinkKind = "review" | "book";

/** e.g. https://moustachebarbersgc.com/review/broadbeach */
export function shortLink(kind: ShortLinkKind, shopKey: string) {
  return `${productionSiteUrl()}/${kind}/${shopKey}`;
}

/** Redirect for /review/{shop} and /book/{shop}; unknown shops go to the home page. */
export function redirectToShopLink(kind: ShortLinkKind, shopKey: string) {
  const links = shopLinks(shopKey);
  const target = links ? (kind === "review" ? links.reviewUrl : links.bookingUrl) : `${productionSiteUrl()}/`;
  return new Response(null, {
    status: 302,
    headers: { Location: target, "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
