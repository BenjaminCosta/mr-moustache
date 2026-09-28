import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { automationLocations, locationForSquareId } from "../src/lib/automation/locations";

describe("automation locations", () => {
  it("maps configured Square location IDs to shops", () => {
    process.env.SQUARE_LOCATION_ID_BROADBEACH = "LOC_BB";
    process.env.GOOGLE_REVIEW_URL_BROADBEACH = "https://g.page/bb";
    process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL = "https://book.shared";
    delete process.env.SQUARE_LOCATION_ID_SURFERS_PARADISE;
    delete process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_BROADBEACH;

    assert.deepEqual(automationLocations(), [
      {
        key: "broadbeach",
        name: "Broadbeach",
        squareLocationId: "LOC_BB",
        reviewUrl: "https://g.page/bb",
        bookingUrl: "https://book.shared",
      },
    ]);
    assert.equal(locationForSquareId("LOC_BB")?.name, "Broadbeach");
    assert.equal(locationForSquareId("LOC_OTHER"), undefined);
    assert.equal(locationForSquareId(undefined), undefined);
  });
});
