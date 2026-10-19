import Image from 'next/image';
import Link from 'next/link';
import { REGISTRATION_URL } from '@lib/constants';
import type { SessionizeSpeaker, SessionizeTalk } from '@lib/sessionize';
import styles from './home-sections.module.css';

type Props = {
  speakers: SessionizeSpeaker[];
  talks: SessionizeTalk[];
};

export default function HomeSections({ speakers, talks }: Props) {
  return (
    <div className={styles.home}>
      <section className={styles.section} aria-labelledby="home-sessions">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="home-sessions">De qué vamos a hablar</h2>
            <p>Un primer vistazo a las sesiones del DevFest.</p>
          </div>
          <Link className={styles.textLink} href="/agenda">Ver la agenda</Link>
        </div>
        {talks.length ? (
          <ul className={styles.talks}>
            {talks.map(talk => (
              <li key={talk.slug}>
                <Link className={styles.talk} href={`/sessions/${talk.slug}`}>
                  <div>
                    <h3>{talk.title}</h3>
                    <p>{talk.speakers.map(speaker => speaker.name).join(', ')}</p>
                  </div>
                  <span className={styles.sessionLink}>
                    Ver sesión
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="m9 5 7 7-7 7" /></svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Las sesiones se publicarán aquí cuando estén disponibles.</p>
        )}
      </section>

      <section className={styles.speakersSection} aria-labelledby="home-speakers">
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="home-speakers">Ponentes</h2>
              <p>Conoce a los ponentes de esta edición.</p>
            </div>
            <Link className={styles.textLink} href="/speakers">Ver todos los ponentes</Link>
          </div>
          {speakers.length ? (
            <ul className={styles.speakers}>
              {speakers.map(speaker => (
                <li key={speaker.slug}>
                  <Link className={styles.speaker} href={`/speakers/${speaker.slug}`}>
                    <div className={styles.portrait}>
                      <Image
                        src={speaker.image.url}
                        alt=""
                        fill
                        sizes="(max-width: 599px) 45vw, (max-width: 899px) 40vw, 280px"
                        className={styles.portraitImage}
                      />
                    </div>
                    <h3>{speaker.name}</h3>
                    {speaker.title && <p>{speaker.title}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Los ponentes se publicarán aquí cuando estén confirmados.</p>
          )}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="home-venue">
        <div className={styles.venue}>
          <div>
            <h2 id="home-venue">Nos vemos en Santiago</h2>
            <p>Escuela Técnica Superior de Ingeniería</p>
            <p className={styles.university}>Universidade de Santiago de Compostela</p>
          </div>
          <a
            className={styles.mapLink}
            href="https://maps.app.goo.gl/GFdS8heX79PLecbj6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
            Cómo llegar
          </a>
        </div>
      </section>

      <section className={styles.sponsorsSection} aria-labelledby="home-sponsors">
        <div className={styles.sponsorsInner}>
          <div>
            <h2 id="home-sponsors">Patrocinadores</h2>
            <Link className={styles.textLink} href="/partners">Conócelos</Link>
          </div>
          <div className={styles.sponsorLogos}>
            <a href="https://raiolanetworks.es" target="_blank" rel="noopener noreferrer">
              <Image src="/logo-Raiola-Networks-Plata.jpg" alt="Raiola Networks" width={220} height={110} className={styles.sponsorLogo} />
            </a>
            <a href="https://dinahosting.com" target="_blank" rel="noopener noreferrer">
              <Image src="/dinahosting.png" alt="dinahosting" width={220} height={110} className={styles.sponsorLogo} />
            </a>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="home-faq">
        <div className={styles.faq}>
          <div>
            <h2 id="home-faq">Antes de venir</h2>
            <p>Lo que necesitas para preparar tu visita.</p>
          </div>
          <div className={styles.questions}>
            <details>
              <summary>¿Cuánto cuesta la entrada?</summary>
              <p>La entrada al DevFest Santiago de Compostela 2026 es gratuita.</p>
            </details>
            <details>
              <summary>¿Tengo que inscribirme?</summary>
              <p>Sí, es necesario inscribirse. <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">Reserva tu entrada en la página del evento</a>.</p>
            </details>
            <details>
              <summary>¿Dónde se celebra?</summary>
              <p>En la Escuela Técnica Superior de Ingeniería de la Universidade de Santiago de Compostela. <a href="https://maps.app.goo.gl/GFdS8heX79PLecbj6" target="_blank" rel="noopener noreferrer">Ver ubicación en Google Maps</a>.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
