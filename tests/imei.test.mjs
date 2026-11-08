import test from "node:test";
import assert from "node:assert/strict";

import { computeCodes, digitsOf, formatImei, luhnValid } from "../lib/imei.ts";

// Échantillons réels relevés sur l'outil d'origine (94 cas vérifiés).
const SAMPLES = [
  ["123456789012345", "88739373", "88730373"],
  ["000000000000000", "88730003", "88730003"],
  ["111111111111111", "88732223", "88731223"],
  ["222222222222222", "88734443", "88732443"],
  ["555555555555555", "88730003", "88735003"],
  ["999999999999999", "88738883", "88739883"],
  ["000000001000000", "88731003", "88730003"],
  ["000000000100000", "88731003", "88731003"],
  ["000000000010000", "88730103", "88730103"],
  ["000000000001000", "88730103", "88730103"],
  ["000000000000100", "88730013", "88730013"],
  ["000000000000010", "88730013", "88730013"],
  ["356789012345678", "88735933", "88733933"],
  ["000000000099000", "88730803", "88730803"],
  ["490154203237518", "88735063", "88732063"],
  ["861234567890123", "88735933", "88738933"],
  ["000000001234567", "88733713", "88732713"],
];

test("computeCodes correspond au serveur d'origine", () => {
  for (const [imei, first, second] of SAMPLES) {
    assert.deepEqual(computeCodes(imei), [first, second], `IMEI ${imei}`);
  }
});

test("le 15e chiffre et les 8 premiers n'ont aucun effet", () => {
  assert.deepEqual(computeCodes("123456789012345"), computeCodes("123456789012340"));
  assert.deepEqual(computeCodes("000000001234567"), computeCodes("999999991234567"));
});

test("sums are digit-wise modulo 10", () => {
  // 9 + 9 -> 8 (et non 18)
  assert.deepEqual(computeCodes("000000009999999"), ["88738883", "88739883"]);
});

test("digitsOf / formatImei / luhnValid", () => {
  assert.equal(digitsOf("12 34-56 abc 789012345"), "123456789012345");
  assert.equal(formatImei("123456789012345"), "12 34 56 78 90 12 34 5");
  assert.equal(luhnValid("490154203237518"), true);
  assert.equal(luhnValid("123456789012345"), false);
  assert.equal(luhnValid("1234"), false);
});
