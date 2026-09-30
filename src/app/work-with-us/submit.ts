import { readApplication } from "./application";
import { emptyApplicationValues, type ApplicationState } from "./options";

/**
 * Validates a Work With Us application in the browser, then posts it to
 * `/api/work-with-us`, which emails it through FormSubmit from the server.
 */
export async function submitApplication(
  previous: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const attempt = previous.attempt + 1;
  const { values, fieldErrors, isSpam } = readApplication((name) => formData.get(name));

  const success: ApplicationState = {
    status: "success",
    message: isSpam ? "Thanks, we'll be in touch." : "Thanks for applying. We'll be in touch soon.",
    fieldErrors: {},
    values: emptyApplicationValues,
    attempt,
  };

  if (isSpam) return success;

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values,
      attempt,
    };
  }

  const failure: ApplicationState = {
    status: "error",
    message: "Something went wrong sending your application. Please try again in a moment.",
    fieldErrors: {},
    values,
    attempt,
  };

  try {
    const response = await fetch("/api/work-with-us", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...values, company: formData.get("company") ?? "" }),
    });
    const result = (await response.json().catch(() => null)) as
      | { ok?: boolean; reason?: string; fieldErrors?: ApplicationState["fieldErrors"] }
      | null;

    if (result?.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
      return { ...failure, message: "Please check the highlighted fields.", fieldErrors: result.fieldErrors };
    }
    if (!response.ok || result?.ok !== true) {
      console.warn("[work-with-us] Application not sent:", result?.reason ?? response.status);
      return failure;
    }
  } catch (error) {
    console.error("[work-with-us] Application request failed", error);
    return failure;
  }

  return success;
}
