import Link from 'next/link';
import { DATE, REGISTRATION_URL, SITE_DESCRIPTION } from '@lib/constants';
import IconLogo from './icons/icon-logo';
import Magnet from './react-bits/Magnet';
import styles from './hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="event-title">
      <div className={styles.content}>
        <h1 id="event-title">DevFest Santiago de Compostela 2026</h1>
        <p className={styles.description}>{SITE_DESCRIPTION}</p>
        <div className={styles.details}>
          <p>{DATE}</p>
          <a
            href="https://maps.app.goo.gl/GFdS8heX79PLecbj6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Escuela Técnica Superior de Ingeniería, USC
          </a>
        </div>
        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Reservar entrada gratuita
          </a>
          <Link className={styles.secondary} href="/agenda">
            Ver agenda
          </Link>
        </div>
        <p className={styles.note}>Entrada gratuita con inscripción previa.</p>
      </div>
      <figure className={styles.visual}>
        <Magnet
          wrapperClassName={styles.magnet}
          innerClassName={styles.symbol}
          padding={40}
          magnetStrength={8}
          maxOffset={18}
          tilt={5}
          scale={1.02}
        >
          <IconLogo aria-hidden="true" />
        </Magnet>
        <figcaption>
          Google Developer Groups<span>Santiago de Compostela</span>
        </figcaption>
      </figure>
    </section>
  );
}
