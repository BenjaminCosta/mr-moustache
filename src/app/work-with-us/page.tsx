import { redirect } from "next/navigation";

/** Keeps existing careers links working while the form now lives on Home. */
export default function WorkWithUsPage() {
  redirect("/#work-with-us");
}
