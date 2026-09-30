import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { WEB3FORMS_ENDPOINT } from "../src/lib/constants";

describe("work with us form", () => {
  it("sends applications to the Web3Forms submit API", () => {
    assert.equal(WEB3FORMS_ENDPOINT, "https://api.web3forms.com/submit");
  });
});
