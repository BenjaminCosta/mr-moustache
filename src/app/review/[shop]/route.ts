import { redirectToShopLink } from "@/lib/automation/short-links";

/** Short link used in review emails: /review/broadbeach → Google "write a review". */
export async function GET(_request: Request, { params }: { params: Promise<{ shop: string }> }) {
  return redirectToShopLink("review", (await params).shop);
}
