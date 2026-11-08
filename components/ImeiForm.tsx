"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { computeCodes, digitsOf, formatImei, luhnValid, type Codes } from "@/lib/imei";

type Hint = { text: string; tone: "" | "ok" | "warn" | "err" };

const SECOND_CODE_DELAY = 420;

export default function ImeiForm() {
  const [digits, setDigits] = useState("");
  const [codes, setCodes] = useState<Codes | null>(null);
  const [showSecond, setShowSecond] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState<"first" | "second" | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootstrapped = useRef(false);

  const compute = (value: string) => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    const [first, second] = computeCodes(value);
    setCodes([first, second]);
    setShowSecond(false);
    setInvalid(false);
    revealTimer.current = setTimeout(() => setShowSecond(true), SECOND_CODE_DELAY);
  };

  // Lien direct : /?imei=123456789012345
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const pre = new URLSearchParams(window.location.search).get("imei");
    const value = digitsOf(pre ?? "").slice(0, 15);
    if (value.length !== 15) {
      inputRef.current?.focus();
      return;
    }
    setDigits(value);
    compute(value);
    setShowSecond(true);
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const hint: Hint = useMemo(() => {
    if (digits.length === 0) {
      return { text: "Les 15 chiffres imprimés sous le modem, sous la batterie", tone: "" };
    }
    if (digits.length < 15) {
      const rest = 15 - digits.length;
      return { text: `Encore ${rest} chiffre${rest > 1 ? "s" : ""}…`, tone: "" };
    }
    if (luhnValid(digits)) return { text: "IMEI valide ✓", tone: "ok" };
    return {
      text: "IMEI complet — chiffre de contrôle inhabituel (le calcul reste identique)",
      tone: "warn",
    };
  }, [digits]);

  const handleChange = (raw: string) => {
    const next = digitsOf(raw).slice(0, 15);
    setDigits(next);
    setInvalid(false);
    setCodes(null);
    setShowSecond(false);
    if (revealTimer.current) clearTimeout(revealTimer.current);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (digits.length !== 15) {
      setInvalid(true);
      inputRef.current?.focus();
      return;
    }
    compute(digits);
  };

  const handleReset = () => {
    setDigits("");
    setCodes(null);
    setShowSecond(false);
    setInvalid(false);
    if (revealTimer.current) clearTimeout(revealTimer.current);
    inputRef.current?.focus();
  };

  const copy = async (value: string, which: "first" | "second") => {
    const done = () => {
      setCopied(which);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1500);
    };

    try {
      await navigator.clipboard.writeText(value);
      done();
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch {
        /* copie indisponible */
      }
      document.body.removeChild(area);
    }
  };

  const hintClass = `hint${hint.tone ? ` ${hint.tone}` : ""}${invalid ? " err" : ""}`;
  const hintText = invalid ? "L'IMEI doit contenir exactement 15 chiffres." : hint.text;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="imei">Entrez l&apos;IMEI (15 chiffres)</label>

        <div className="field">
          <svg
            className="ico"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
            <path d="M10.5 18.5h3" />
          </svg>
          <input
            ref={inputRef}
            id="imei"
            name="imei"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={22}
            placeholder="123456789012345"
            value={formatImei(digits)}
            onChange={(event) => handleChange(event.target.value)}
            aria-describedby="imei-hint"
            aria-invalid={invalid}
          />
        </div>

        <div className="meta">
          <span className="counter">{digits.length} / 15</span>
          <span className={hintClass} id="imei-hint">
            {hintText}
          </span>
        </div>

        <div className="actions">
          <button type="submit" className="btn-primary">
            Calculer les codes
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            Effacer
          </button>
        </div>
      </form>

      <section className={`results${codes ? " show" : ""}`} aria-live="polite">
        {codes && (
          <div className="res">
            <div className="lab">
              <span>Code de déblocage 1</span>
              <div className="code">{codes[0]}</div>
            </div>
            <button
              type="button"
              className={`copy${copied === "first" ? " done" : ""}`}
              onClick={() => copy(codes[0], "first")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              {copied === "first" ? "Copié" : "Copier"}
            </button>
          </div>
        )}

        {codes && showSecond && (
          <div className="res" style={{ animationDelay: "0.18s" }}>
            <div className="lab">
              <span>Code de déblocage 2</span>
              <div className="code">{codes[1]}</div>
            </div>
            <button
              type="button"
              className={`copy${copied === "second" ? " done" : ""}`}
              onClick={() => copy(codes[1], "second")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              {copied === "second" ? "Copié" : "Copier"}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
