import Image from "next/image";

import ImeiForm from "@/components/ImeiForm";

const STEPS = [
  {
    title: "Retirez la batterie",
    body: (
      <>
        L&apos;<b>IMEI</b> est imprimé sur l&apos;étiquette placée <b>sous le modem</b>, dans le
        logement de la batterie : 15 chiffres.
      </>
    ),
  },
  {
    title: "Insérez une SIM inconnue",
    body: (
      <>
        Glissez une carte SIM d&apos;un autre opérateur — une SIM quelconque, non reconnue par le
        modem — puis remettez la batterie en place.
      </>
    ),
  },
  {
    title: "Allumez et connectez-vous",
    body: (
      <>
        Allumez le modem, connectez-vous à son réseau Wi-Fi, puis ouvrez son{" "}
        <b>interface d&apos;administration</b> dans le navigateur.
      </>
    ),
  },
  {
    title: "Saisissez le code NCK",
    body: (
      <>
        L&apos;interface réclame un code de déblocage réseau : entrez le <b>NCK</b> généré plus haut
        à partir de l&apos;IMEI.
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="wrap">
      <header>
        <span className="badge">
          <span className="dot" />
          Outil de déblocage
        </span>
        <h1>Générateur de code de déblocage IMEI</h1>
        <p className="sub">
          Calcul <strong>100 % local</strong> des deux codes <strong>NCK</strong> du modem{" "}
          <strong>TECHNO TR118</strong> (Orange AirBox), à partir de l&apos;IMEI. Aucune donnée
          n&apos;est envoyée : tout se passe dans votre navigateur.
        </p>
      </header>

      <main className="card">
        <ImeiForm />

        <h2 className="proc-h">Comment débloquer le modem</h2>

        <div className="steps">
          <figure className="device">
            <a href="/assets/modem.png" target="_blank" rel="noopener noreferrer" title="Ouvrir l'image en grand">
              <Image
                src="/assets/modem.png"
                alt="Modem TECHNO TR118 (Orange AirBox) photographié de face, de dos, de profil et de dessous, montrant la trappe de la batterie."
                width={838}
                height={420}
                sizes="(max-width: 700px) 100vw, 700px"
              />
            </a>
            <figcaption>
              TECHNO TR118 — Orange AirBox
              <br />
              face · dos · profil · dessous
            </figcaption>
          </figure>

          <ol className="proc">
            {STEPS.map((step) => (
              <li key={step.title}>
                <span className="t">{step.title}</span>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </main>

      <footer>
        Application créée par <strong style={{ color: "#a9c0e6" }}>Bogims Unlock</strong> pour
        débloquer le TECHNO TR118.
        <br />
        Clone autonome — fonctionne hors ligne, sans serveur.
      </footer>
    </div>
  );
}
