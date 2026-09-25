"use server";

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends a Work With Us application by email through Resend's REST API
 * (https://resend.com/docs/api-reference/emails/send-email).
 *
 * Needs RESEND_API_KEY and WORK_WITH_US_TO_EMAIL; WORK_WITH_US_FROM_EMAIL is
 * optional. Without them the form reports that online applications are not
 * connected yet instead of pretending the message was sent.
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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.WORK_WITH_US_TO_EMAIL;
  const from =
    process.env.WORK_WITH_US_FROM_EMAIL || "Mr Moustache Website <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn(
      "[work-with-us] Email delivery is not configured (RESEND_API_KEY / WORK_WITH_US_TO_EMAIL).",
    );
    return {
      status: "error",
      message:
        "Online applications aren't connected yet. Please call or message the shop directly and we'll get back to you.",
      fieldErrors: {},
      values: application,
      attempt,
    };
  }

  const rows: Array<[string, string]> = [
    ["Name", application.name],
    ["Email", application.email],
    ["Phone", application.phone || "—"],
    ["Experience", application.experience],
    ["Preferred location", application.location],
    ["Message", application.message],
  ];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((address) => address.trim()),
      reply_to: application.email,
      subject: `Work With Us: ${application.name} (${application.location})`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n\n"),
      html: rows
        .map(
          ([label, value]) =>
            `<p><strong>${label}</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`,
        )
        .join(""),
    }),
  });

  if (!response.ok) {
    console.error("[work-with-us] Resend responded with", response.status, await response.text());
    return {
      status: "error",
      message: "Something went wrong sending your application. Please try again in a moment.",
      fieldErrors: {},
      values: application,
      attempt,
    };
  }

  return {
    status: "success",
    message: "Thanks for applying. We'll be in touch soon.",
    fieldErrors: {},
    values: emptyApplicationValues,
    attempt,
  };
}
