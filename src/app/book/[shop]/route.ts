import { redirectToShopLink } from "@/lib/automation/short-links";

/** Short link used in rebooking emails: /book/broadbeach → the shop's Square booking page. */
export async function GET(_request: Request, { params }: { params: Promise<{ shop: string }> }) {
  return redirectToShopLink("book", (await params).shop);
}
