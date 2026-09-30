import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FORMSUBMIT_ENDPOINT } from "../src/lib/constants";

describe("work with us form", () => {
  it("sends to the FormSubmit AJAX endpoint of the test inbox", () => {
    assert.equal(FORMSUBMIT_ENDPOINT, "https://formsubmit.co/ajax/benjacostm100@gmail.com");
  });
});
