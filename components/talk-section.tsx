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

import Link from 'next/link';
import Image from 'next/image';
import { Talk } from '@lib/types';
import { EVENT_TIME_ZONE } from '@lib/constants';
import { formatSessionSchedule } from '@lib/sessionize';
import styles from './talk-section.module.css';

type Props = {
  talk: Talk;
};

export default function TalkSection({ talk }: Props) {
  const schedule = talk.start ? formatSessionSchedule(talk.start, talk.end) : null;

  return (
    <>
      <Link href="/agenda" className={styles.backlink}>
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Agenda
      </Link>
      <div key={talk.title} className={styles.container}>
        <div className={styles['speaker-details']}>
          <div>
            <h1 className={styles.name}>{talk.title}</h1>
            {schedule ? (
              <>
                <p className={styles.date}>
                  <span className={styles.company}>{schedule.day}</span>
                </p>
                <p className={styles.hours}>
                  <span className={styles.company}>
                    {schedule.hours} ({EVENT_TIME_ZONE})
                  </span>
                </p>
              </>
            ) : (
              <p className={styles.date}>
                <span className={styles.company}>Horario por confirmar</span>
              </p>
            )}
            {(schedule || talk.stage?.name) && (
              <p className={styles.date}>
                <span className={styles.company}>{talk.stage?.name || 'Sala por confirmar'}</span>
              </p>
            )}
            <h2 className={styles['bio-header']}>Descripción</h2>
            <p className={styles.bio}>{talk.description}</p>
            <h2 className={styles['speakers-header']}>Speaker{talk.speaker?.length > 1 && 's'}</h2>
            {talk.speaker?.map(s => (
              <Link key={s.name} href={`/speakers/${s.slug}`} className={styles['avatar-group']}>
                <div className={styles['avatar-wrapper']}>
                  <Image
                    loading="lazy"
                    alt={s.name}
                    className={styles.avatar}
                    src={s.image?.url}
                    title={s.name}
                    width={48}
                    height={48}
                  />
                </div>
                <p className={styles.speaker_name}>{s.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
