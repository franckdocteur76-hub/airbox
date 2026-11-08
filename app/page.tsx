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
          Débloque ton modem <strong>TECHNO TR118</strong> (Orange AirBox) facilement, à partir de
          l&apos;IMEI.
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

        <aside className="cta">
          <span className="yt" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8z" />
              <path d="M10 15.5v-7l6 3.5-6 3.5z" fill="#0b1222" />
            </svg>
          </span>

          <div className="grow">
            <span className="kicker">Besoin d&apos;aide&nbsp;?</span>
            <h2>La chaîne OneTechk est là pour ça</h2>
            <p>
              Déblocage, configuration, dépannage : les tutos sont en vidéo. Pour tout besoin, la
              chaîne YouTube OneTechk est là — abonne-toi pour ne rien rater.
            </p>
          </div>

          <a
            className="cta-btn"
            href="https://www.youtube.com/@OneTechk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8z" />
              <path d="M10 15.5v-7l6 3.5-6 3.5z" fill="#d81f26" />
            </svg>
            S&apos;abonner
          </a>
        </aside>
      </main>

      <footer>
        Application créée par <strong style={{ color: "#a9c0e6" }}>OneTechk</strong> pour débloquer le
        TECHNO TR118.
        <br />
        © {new Date().getFullYear()} OneTechk — tutoriels et dépannage sur{" "}
        <a href="https://www.youtube.com/@OneTechk" target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
        .
      </footer>
    </div>
  );
}
