/**
 * Cœur métier : calcul des codes NCK du TECHNO TR118.
 *
 * Seuls les chiffres d'indice 8 à 13 de l'IMEI sont lus ; les 8 premiers (TAC)
 * et le 15e (chiffre de contrôle Luhn) sont ignorés. Les sommes sont faites
 * chiffre par chiffre puis modulo 10.
 */

export type Codes = readonly [first: string, second: string];

export function digitsOf(value: string): string {
  return (value.match(/\d/g) ?? []).join("");
}

/** 123456789012345 -> "12 34 56 78 90 12 34 5" */
export function formatImei(digits: string): string {
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

/** Chiffre de contrôle IMEI (Luhn sur 15 chiffres). */
export function luhnValid(digits: string): boolean {
  if (digits.length !== 15) return false;
  let sum = 0;
  for (let i = 0; i < 15; i += 1) {
    let n = Number(digits[14 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export function computeCodes(imei: string): Codes {
  const d = digitsOf(imei).split("").map(Number);

  const y = (d[10] + d[11]) % 10; // centaines
  const z = (d[12] + d[13]) % 10; // dizaines

  const first = `8873${(d[8] + d[9]) % 10}${y}${z}3`;
  const second = `8873${d[9] % 10}${y}${z}3`;

  return [first, second];
}
