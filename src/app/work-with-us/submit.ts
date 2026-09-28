import { FORMSUBMIT_ENDPOINT } from "@/lib/constants";
import {
  EXPERIENCE_OPTIONS,
  LOCATION_OPTIONS,
  emptyApplicationValues,
  type ApplicationState,
} from "./options";

const MAX_LENGTH = { name: 120, email: 200, phone: 40, message: 4000 };

function field(formData: FormData, name: string, max = 500) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Validates a Work With Us application and emails it through FormSubmit's
 * AJAX endpoint (https://formsubmit.co), straight from the visitor's browser.
 * No account or API key: the first submission sends an activation email to
 * the recipient, and applications arrive once that link has been clicked.
 */
export async function submitApplication(
  previous: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const attempt = previous.attempt + 1;

  // Honeypot: real visitors never see or fill this field.
  if (field(formData, "company")) {
    return {
      status: "success",
      message: "Thanks, we'll be in touch.",
      fieldErrors: {},
      values: emptyApplicationValues,
      attempt,
    };
  }

  const application = {
    name: field(formData, "name", MAX_LENGTH.name),
    email: field(formData, "email", MAX_LENGTH.email),
    phone: field(formData, "phone", MAX_LENGTH.phone),
    experience: field(formData, "experience"),
    location: field(formData, "location"),
    message: field(formData, "message", MAX_LENGTH.message),
  };

  const fieldErrors: ApplicationState["fieldErrors"] = {};
  if (!application.name) fieldErrors.name = "Please add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) {
    fieldErrors.email = "Please add a valid email address.";
  }
  if (!(EXPERIENCE_OPTIONS as readonly string[]).includes(application.experience)) {
    fieldErrors.experience = "Please choose your experience.";
  }
  if (!LOCATION_OPTIONS.includes(application.location)) {
    fieldErrors.location = "Please choose a location.";
  }
  if (!application.message) fieldErrors.message = "Please tell us a little about yourself.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values: application,
      attempt,
    };
  }

  const failure: ApplicationState = {
    status: "error",
    message: "Something went wrong sending your application. Please try again in a moment.",
    fieldErrors: {},
    values: application,
    attempt,
  };

  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        Name: application.name,
        Email: application.email,
        Phone: application.phone || "—",
        Experience: application.experience,
        "Preferred location": application.location,
        Message: application.message,
        _replyto: application.email,
        _subject: `Work With Us: ${application.name} (${application.location})`,
        _template: "table",
        _captcha: "false",
      }),
    });
    const result = (await response.json().catch(() => null)) as
      | { success?: string | boolean; message?: string }
      | null;

    if (!response.ok || String(result?.success) !== "true") {
      console.error("[work-with-us] FormSubmit rejected the application", response.status, result);
      return failure;
    }
  } catch (error) {
    console.error("[work-with-us] FormSubmit request failed", error);
    return failure;
  }

  return {
    status: "success",
    message: "Thanks for applying. We'll be in touch soon.",
    fieldErrors: {},
    values: emptyApplicationValues,
    attempt,
  };
}
