import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FORMSUBMIT_ACTION } from "../src/lib/constants";

describe("work with us form", () => {
  it("posts to the test inbox's FormSubmit form endpoint", () => {
    assert.equal(FORMSUBMIT_ACTION, "https://formsubmit.co/benjacostm100@gmail.com");
  });
});
