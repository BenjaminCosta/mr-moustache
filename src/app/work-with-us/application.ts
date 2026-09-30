import {
  EXPERIENCE_OPTIONS,
  LOCATION_OPTIONS,
  type ApplicationErrors,
  type ApplicationField,
  type ApplicationValues,
} from "./options";

const MAX_LENGTH = { name: 120, email: 200, phone: 40, message: 4000 };

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Reads and validates a Work With Us application before it is posted to
 * FormSubmit. `get` returns a raw field value, e.g. from FormData.
 */
export function readApplication(get: (name: string) => unknown) {
  const values: ApplicationValues = {
    name: text(get("name"), MAX_LENGTH.name),
    email: text(get("email"), MAX_LENGTH.email),
    phone: text(get("phone"), MAX_LENGTH.phone),
    experience: text(get("experience")),
    location: text(get("location")),
    message: text(get("message"), MAX_LENGTH.message),
  };

  const fieldErrors: ApplicationErrors = {};
  if (!values.name) fieldErrors.name = "Please add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    fieldErrors.email = "Please add a valid email address.";
  }
  if (!(EXPERIENCE_OPTIONS as readonly string[]).includes(values.experience)) {
    fieldErrors.experience = "Please choose your experience.";
  }
  if (!LOCATION_OPTIONS.includes(values.location)) {
    fieldErrors.location = "Please choose a location.";
  }
  if (!values.message) fieldErrors.message = "Please tell us a little about yourself.";

  return { values, fieldErrors, firstError: Object.keys(fieldErrors)[0] as ApplicationField | undefined };
}
