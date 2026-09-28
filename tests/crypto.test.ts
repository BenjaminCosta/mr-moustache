import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { beforeEach, describe, it } from "node:test";

import { decryptSecret, encryptSecret, safeEqualStrings } from "../src/lib/automation/crypto";

describe("token encryption", () => {
  beforeEach(() => {
    process.env.SQUARE_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("base64");
  });

  it("round-trips a secret with a fresh IV each time", () => {
    const first = encryptSecret("EAAAl-access-token");
    const second = encryptSecret("EAAAl-access-token");

    assert.equal(decryptSecret(first), "EAAAl-access-token");
    assert.notEqual(first.iv, second.iv);
    assert.notEqual(first.ciphertext, second.ciphertext);
    assert.ok(!JSON.stringify(first).includes("EAAAl"));
  });

  it("rejects tampered ciphertext", () => {
    const secret = encryptSecret("refresh-token");
    const bytes = Buffer.from(secret.ciphertext, "base64");
    bytes[0] ^= 1;

    assert.throws(() => decryptSecret({ ...secret, ciphertext: bytes.toString("base64") }));
  });

  it("rejects a different key", () => {
    const secret = encryptSecret("refresh-token");
    process.env.SQUARE_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("base64");

    assert.throws(() => decryptSecret(secret));
  });

  it("requires a 32-byte key", () => {
    process.env.SQUARE_TOKEN_ENCRYPTION_KEY = randomBytes(16).toString("base64");
    assert.throws(() => encryptSecret("x"), /32-byte/);
  });
});

describe("safeEqualStrings", () => {
  it("compares without throwing on length mismatch", () => {
    assert.equal(safeEqualStrings("abc", "abc"), true);
    assert.equal(safeEqualStrings("abc", "abd"), false);
    assert.equal(safeEqualStrings("abc", "abcd"), false);
  });
});
