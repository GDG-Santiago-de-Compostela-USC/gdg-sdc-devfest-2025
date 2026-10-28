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
import cn from 'classnames';
import GithubIcon from '@components/icons/icon-github';
import { Speaker, Talk, TeamMember } from '@lib/types';
import styles from './talk-section.module.css';
import { LinkedInIcon, MailIcon, SpeakerIcon } from '@100mslive/react-icons';
import IconAvatar from './icons/icon-avatar';
import IconCheck from './icons/icon-check';
import IconTwitter from './icons/icon-twitter';
import React from 'react';

type Props = {
  talk: Talk;
};

export default function TalkSection({ talk }: Props) {
  const dayFormatted = React.useMemo(() => {
    if (!talk.start) return '';
    const time = new Date(talk.start);
    const dateInLowercase =  time.toLocaleDateString(new Intl.Locale('es-ES'), {dateStyle: 'full', timeZone: 'Europe/Madrid'});
    const dateInSentenceCase = dateInLowercase.charAt(0).toUpperCase() + dateInLowercase.slice(1);
    return dateInSentenceCase;
  }
  , [talk.start]);

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
        {/*
        <div style={{ minWidth: '300px', position: 'relative' }}>
          <Image
            alt={teamMember.name}
            title={teamMember.name}
            src={teamMember.image.url}
            className={styles.image}
            loading="lazy"
            content='cover'
            layout='fill'
          />
        </div>
  */}
        <div className={styles['speaker-details']}>
          <div>
            <h1 className={styles.name}>{talk.title}</h1>
            {talk.start ? (
              <>
                <p className={styles.date}>
                  <span className={styles.company}>{dayFormatted}</span>
                </p>
                <p className={styles.hours}>
                  <span className={styles.company}>{`${new Date(talk.start).toLocaleTimeString(new Intl.Locale('es-ES'), {timeStyle: 'short', timeZone: 'Europe/Madrid'})} - ${new Date(talk.end).toLocaleTimeString(new Intl.Locale('es-ES'), {timeStyle: 'short', timeZone: 'Europe/Madrid'})}${talk.stage?.name ? ` · ${talk.stage.name}` : ''}`}</span>
                </p>
              </>
            ) : null}
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
                <p className={styles.speaker_name} >
                  {s.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
