import { permanentRedirect } from "next/navigation";

/** Keeps existing careers links working (308) while the form now lives on Home. */
export default function WorkWithUsPage() {
  permanentRedirect("/#work-with-us");
}
