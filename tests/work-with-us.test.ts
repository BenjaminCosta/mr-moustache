import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FORMSUBMIT_ACTION } from "../src/lib/constants";

describe("work with us form", () => {
  it("posts straight to the client's FormSubmit inbox", () => {
    assert.equal(FORMSUBMIT_ACTION, "https://formsubmit.co/aitgv0@gmail.com");
  });
});
