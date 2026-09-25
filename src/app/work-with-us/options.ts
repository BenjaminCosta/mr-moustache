import { locations } from "@/data/locations";

export const EXPERIENCE_OPTIONS = [
  "Apprentice / under 1 year",
  "1–3 years",
  "3–5 years",
  "5+ years",
] as const;

export const LOCATION_OPTIONS = [
  ...locations.map((location) => location.name),
  "Either location",
];

export type ApplicationField = "name" | "email" | "experience" | "location" | "message";

export type ApplicationValues = Record<ApplicationField | "phone", string>;

export type ApplicationState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<ApplicationField, string>>;
  /** Echoed back on errors so the form keeps what the visitor typed. */
  values: ApplicationValues;
  /** Submission counter; remounts the form so selects keep their value too. */
  attempt: number;
};

export const emptyApplicationValues: ApplicationValues = {
  name: "",
  email: "",
  phone: "",
  experience: "",
  location: "",
  message: "",
};

export const initialApplicationState: ApplicationState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: emptyApplicationValues,
  attempt: 0,
};
