import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { readApplication } from "../src/app/work-with-us/application";
import { FORMSUBMIT_ACTION } from "../src/lib/constants";

const application: Record<string, string> = {
  name: "  Alex Barber ",
  email: "alex@example.com",
  phone: "",
  experience: "3–5 years",
  location: "Broadbeach",
  message: "Five years doing fades.",
};

describe("work with us form", () => {
  it("posts straight to the client's FormSubmit inbox", () => {
    assert.equal(FORMSUBMIT_ACTION, "https://formsubmit.co/aitgv0@gmail.com");
  });

  it("accepts a complete application and trims it", () => {
    const { values, firstError } = readApplication((name) => application[name]);
    assert.equal(firstError, undefined);
    assert.equal(values.name, "Alex Barber");
    assert.equal(values.location, "Broadbeach");
  });

  it("flags missing or unknown fields, first one first", () => {
    const { fieldErrors, firstError } = readApplication(
      (name) => ({ ...application, name: "", email: "nope", location: "Sydney" })[name],
    );
    assert.equal(firstError, "name");
    assert.ok(fieldErrors.email);
    assert.ok(fieldErrors.location);
    assert.equal(fieldErrors.message, undefined);
  });
});
