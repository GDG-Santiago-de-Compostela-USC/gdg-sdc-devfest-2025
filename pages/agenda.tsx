/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import Page from '@components/page';
import Layout from '@components/layout';
import LinkButton from '@components/hms/LinkButton';
import PageHero from '@components/page-hero';
import styles from '@components/agenda.module.css';

import { formatSessionSchedule, getSessionizeData, SessionizeTalk } from '@lib/sessionize';
import {
  EVENT_DAYS,
  EVENT_TIME_ZONE,
  META_DESCRIPTION,
  REGISTRATION_URL,
  SITE_NAME
} from '@lib/constants';

type Props = {
  talks: SessionizeTalk[];
};

export default function SchedulePage({ talks }: Props) {
  const hasSchedule = talks.some(talk => talk.start);
  const meta = {
    title: 'Agenda - ' + SITE_NAME,
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <PageHero
          title="Agenda"
          description="Las charlas confirmadas del DevFest Santiago 2026 y el horario previsto de cada día."
        >
          <LinkButton href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
            Reservar entrada gratuita
          </LinkButton>
          <LinkButton href="/speakers" variant="secondary">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.3.63-1.42 1.37L1.5 16H4v6h4v-6h2v6h4v-6h2v6h4z" />
            </svg>
            Ver speakers
          </LinkButton>
        </PageHero>

        <div className={styles.content}>
          <section className={styles.eventDays} aria-label="Horario previsto del evento">
            {EVENT_DAYS.map(day => (
              <div key={day.date} className={styles.eventDay}>
                <p className={styles.dayLabel}>
                  <time dateTime={day.date}>{day.label}</time>
                </p>
                <p className={styles.dayHours}>
                  {day.start} – {day.end}
                </p>
              </div>
            ))}
          </section>

          <div className={styles.notice}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M12 10.5v6M12 7.5v.1"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <p>
              <strong>Horarios provisionales.</strong>{' '}
              {hasSchedule
                ? 'Las sesiones sin hora asignada siguen pendientes de confirmación.'
                : 'Las charlas están confirmadas. Publicaremos su hora y sala cuando la programación esté cerrada.'}{' '}
              Hora peninsular ({EVENT_TIME_ZONE}).
            </p>
          </div>

          <section aria-labelledby="confirmed-talks">
            <div className={styles.sectionHeading}>
              <h2 id="confirmed-talks">Charlas confirmadas</h2>
              <p>
                {talks.length} {talks.length === 1 ? 'charla' : 'charlas'}
              </p>
            </div>
            {talks.length === 0 ? (
              <p className={styles.empty}>
                Publicaremos las charlas confirmadas en esta página. Vuelve pronto para consultar la
                agenda.
              </p>
            ) : (
              <ul className={styles.talkList}>
                {talks.map(talk => {
                  const schedule = talk.start ? formatSessionSchedule(talk.start, talk.end) : null;
                  return (
                    <li key={talk.slug}>
                      <Link href={`/sessions/${talk.slug}`} className={styles.talkRow}>
                        <div className={styles.talkInfo}>
                          {schedule && (
                            <p className={styles.schedule}>
                              <time dateTime={talk.start!}>
                                {schedule.day}, {schedule.hours}
                              </time>
                              {talk.room && <span>{talk.room}</span>}
                            </p>
                          )}
                          {!schedule && talk.room && <p className={styles.schedule}>{talk.room}</p>}
                          <h3 className={styles.talkTitle}>{talk.title}</h3>
                        </div>
                        <div className={styles.speakers}>
                          {talk.speakers.map(speaker => (
                            <div key={speaker.slug} className={styles.speaker}>
                              <Image
                                src={speaker.image.url}
                                alt=""
                                width={36}
                                height={36}
                                className={styles.avatar}
                              />
                              <span>{speaker.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className={styles.metadata}>
                          {talk.level && <span className={styles.level}>{talk.level}</span>}
                          {talk.duration != null && (
                            <span className={styles.duration}>{talk.duration} min</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { talks } = await getSessionizeData();

  return {
    props: {
      talks
    },
    revalidate: 360
  };
};
