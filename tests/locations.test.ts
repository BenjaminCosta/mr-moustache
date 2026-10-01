import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { automationLocations, locationForSquareId } from "../src/lib/automation/locations";

describe("automation locations", () => {
  it("maps configured Square location IDs to shops", () => {
    process.env.SQUARE_LOCATION_ID_BROADBEACH = "LOC_BB";
    process.env.GOOGLE_REVIEW_URL_BROADBEACH = "https://g.page/bb";
    delete process.env.SQUARE_LOCATION_ID_SURFERS_PARADISE;

    assert.deepEqual(automationLocations(), [
      {
        key: "broadbeach",
        name: "Broadbeach",
        squareLocationId: "LOC_BB",
        reviewUrl: "https://g.page/bb",
        bookingUrl: "https://book.squareup.com/appointments/o0xkg1fz5zxow7/location/LS4XGMYEDQ5ER",
      },
    ]);
    assert.equal(locationForSquareId("LOC_BB")?.name, "Broadbeach");
    assert.equal(locationForSquareId("LOC_OTHER"), undefined);
    assert.equal(locationForSquareId(undefined), undefined);
  });

  it("uses each shop's Square booking page for rebooking reminders", () => {
    process.env.SQUARE_LOCATION_ID_SURFERS_PARADISE = "LOC_SP";
    process.env.SQUARE_LOCATION_ID_BROADBEACH = "LOC_BB";

    assert.deepEqual(
      automationLocations().map((location) => location.bookingUrl),
      [
        "https://book.squareup.com/appointments/o0xkg1fz5zxow7/location/LA3KEKYDA4KV3",
        "https://book.squareup.com/appointments/o0xkg1fz5zxow7/location/LS4XGMYEDQ5ER",
      ],
    );
  });

  it("falls back to each shop's Google write-review link", () => {
    process.env.SQUARE_LOCATION_ID_SURFERS_PARADISE = "LOC_SP";
    process.env.SQUARE_LOCATION_ID_BROADBEACH = "LOC_BB";
    delete process.env.GOOGLE_REVIEW_URL_SURFERS_PARADISE;
    delete process.env.GOOGLE_REVIEW_URL_BROADBEACH;

    assert.deepEqual(
      automationLocations().map((location) => location.reviewUrl),
      [
        "https://search.google.com/local/writereview?placeid=ChIJMUVO7fEFkWsRsYBHrfV0y7Y",
        "https://search.google.com/local/writereview?placeid=ChIJ8Qbj5d4FkWsR53Iktyc_sEI",
      ],
    );
  });
});
