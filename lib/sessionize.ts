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

import { EVENT_TIME_ZONE, SESSIONIZE_ID } from '@lib/constants';

// Map public fields explicitly. Sessionize also includes private speaker answers;
// never return its raw response or include its contents in error messages.
export type SessionizeSpeaker = {
  name: string;
  title: string;
  bio: string;
  image: { url: string };
  slug: string;
  isTopSpeaker: boolean;
};

export type SessionizeTalk = {
  slug: string;
  title: string;
  description: string;
  level: string | null;
  duration: number | null;
  start: string | null;
  end: string | null;
  room: string | null;
  speakers: SessionizeSpeaker[];
};

const DURATION_QUESTION = 'Duration';
const LEVEL_CATEGORY = 'Technical level';
const REQUEST_TIMEOUT_MS = 10000;

type RecordValue = Record<string, unknown>;

function record(value: unknown, field: string): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid Sessionize field: ${field}`);
  }
  return value as RecordValue;
}

function array(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Invalid Sessionize field: ${field}`);
  return value;
}

function requiredText(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid Sessionize field: ${field}`);
  }
  return value.trim();
}

function optionalText(value: unknown, field: string): string {
  if (value == null) return '';
  if (typeof value !== 'string') throw new Error(`Invalid Sessionize field: ${field}`);
  return value;
}

function identifier(value: unknown, field: string): string {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return requiredText(value, field);
}

// Sessionize may publish local wall times without an offset. Resolve those in the
// event's zone on the server so visitors and builds in other zones see the same time.
function publishedTime(value: unknown, field: string): string | null {
  if (value == null || value === '') return null;
  const input = requiredText(value, field);
  const calendar = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(input);
  if (
    !calendar ||
    +calendar[2] < 1 ||
    +calendar[2] > 12 ||
    +calendar[3] < 1 ||
    +calendar[3] > new Date(Date.UTC(+calendar[1], +calendar[2], 0)).getUTCDate() ||
    +calendar[4] > 23 ||
    +calendar[5] > 59 ||
    +(calendar[6] || 0) > 59
  ) {
    throw new Error(`Invalid Sessionize field: ${field}`);
  }
  const local = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/.exec(input);
  let date: Date;
  if (local) {
    const wallTime = Date.UTC(
      +local[1],
      +local[2] - 1,
      +local[3],
      +local[4],
      +local[5],
      +(local[6] || 0)
    );
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: EVENT_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });
    let instant = wallTime;
    for (let attempt = 0; attempt < 2; attempt++) {
      const parts = formatter.formatToParts(new Date(instant));
      const part = (type: Intl.DateTimeFormatPartTypes) =>
        Number(parts.find(p => p.type === type)?.value);
      const localAsUtc = Date.UTC(
        part('year'),
        part('month') - 1,
        part('day'),
        part('hour'),
        part('minute'),
        part('second')
      );
      instant = wallTime - (localAsUtc - instant);
    }
    const resolved = formatter.formatToParts(new Date(instant));
    const expected = [local[1], local[2], local[3], local[4], local[5], local[6] || '00'];
    const fields: Intl.DateTimeFormatPartTypes[] = [
      'year',
      'month',
      'day',
      'hour',
      'minute',
      'second'
    ];
    if (
      fields.some(
        (field, index) =>
          Number(resolved.find(part => part.type === field)?.value) !== Number(expected[index])
      )
    ) {
      throw new Error(`Invalid Sessionize field: ${field}`);
    }
    date = new Date(instant + Number((local[7] || '').padEnd(3, '0').slice(0, 3)));
  } else {
    // Reject locale-dependent date strings rather than guessing the server's zone.
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(input)) {
      throw new Error(`Invalid Sessionize field: ${field}`);
    }
    date = new Date(input);
  }
  if (!Number.isFinite(date.getTime())) throw new Error(`Invalid Sessionize field: ${field}`);
  return date.toISOString();
}

export function formatSessionSchedule(
  start: string,
  end?: string | null
): { day: string; hours: string } {
  const date = new Date(start);
  const day = new Intl.DateTimeFormat('es-ES', {
    timeZone: EVENT_TIME_ZONE,
    dateStyle: 'full'
  }).format(date);
  const time = new Intl.DateTimeFormat('es-ES', { timeZone: EVENT_TIME_ZONE, timeStyle: 'short' });
  return {
    day: day.charAt(0).toUpperCase() + day.slice(1),
    hours: end ? `${time.format(date)} – ${time.format(new Date(end))}` : time.format(date)
  };
}

export async function getSessionizeData(): Promise<{
  speakers: SessionizeSpeaker[];
  talks: SessionizeTalk[];
}> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`https://sessionize.com/api/v2/${SESSIONIZE_ID}/view/All`, {
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`Sessionize responded ${res.status}`);
    const data = record(await res.json(), 'response');
    const questions = array(data.questions, 'questions').map(q => record(q, 'question'));
    const durationId = questions.find(q => q.question === DURATION_QUESTION)?.id;
    const levels = new Map<string, string>();
    array(data.categories, 'categories').forEach(value => {
      const category = record(value, 'category');
      if (category.title === LEVEL_CATEGORY) {
        array(category.items, 'category.items').forEach(value => {
          const item = record(value, 'category.item');
          levels.set(
            identifier(item.id, 'category.item.id'),
            requiredText(item.name, 'category.item.name')
          );
        });
      }
    });
    const rooms = new Map<string, string>();
    array(data.rooms, 'rooms').forEach(value => {
      const room = record(value, 'room');
      rooms.set(identifier(room.id, 'room.id'), requiredText(room.name, 'room.name'));
    });
    const speakerIds = new Set<string>();
    const speakers: SessionizeSpeaker[] = array(data.speakers, 'speakers')
      .map(value => {
        const speaker = record(value, 'speaker');
        const slug = identifier(speaker.id, 'speaker.id');
        if (speakerIds.has(slug)) throw new Error('Duplicate Sessionize speaker');
        speakerIds.add(slug);
        return {
          name: requiredText(speaker.fullName, 'speaker.fullName'),
          title: optionalText(speaker.tagLine, 'speaker.tagLine'),
          bio: optionalText(speaker.bio, 'speaker.bio'),
          image: { url: requiredText(speaker.profilePicture, 'speaker.profilePicture') },
          slug,
          isTopSpeaker: speaker.isTopSpeaker === true
        };
      })
      .sort(
        (a, b) =>
          Number(b.isTopSpeaker) - Number(a.isTopSpeaker) || a.name.localeCompare(b.name, 'es')
      );
    const speakersById = new Map(speakers.map(speaker => [speaker.slug, speaker]));
    const talkIds = new Set<string>();
    const talks: SessionizeTalk[] = array(data.sessions, 'sessions')
      .map(value => record(value, 'session'))
      .filter(session => {
        if (typeof session.isServiceSession !== 'boolean' || typeof session.status !== 'string') {
          throw new Error('Invalid Sessionize session status');
        }
        return !session.isServiceSession && session.status === 'Accepted';
      })
      .map(session => {
        const slug = identifier(session.id, 'session.id');
        if (talkIds.has(slug)) throw new Error('Duplicate Sessionize session');
        talkIds.add(slug);
        const answers = array(session.questionAnswers, 'session.questionAnswers').map(value =>
          record(value, 'session.answer')
        );
        const durationAnswer =
          durationId == null
            ? undefined
            : answers.find(answer => answer.questionId === durationId)?.answerValue;
        const duration = durationAnswer == null ? NaN : parseInt(String(durationAnswer), 10);
        const start = publishedTime(session.startsAt, 'session.startsAt');
        const end = publishedTime(session.endsAt, 'session.endsAt');
        if ((end && !start) || (start && end && end <= start))
          throw new Error('Invalid Sessionize session interval');
        const roomId = session.roomId == null ? null : identifier(session.roomId, 'session.roomId');
        if (roomId && !rooms.has(roomId)) throw new Error('Unknown Sessionize room');
        const sessionSpeakers = array(session.speakers, 'session.speakers').map(value => {
          const speaker = speakersById.get(identifier(value, 'session.speakerId'));
          if (!speaker) throw new Error('Unknown Sessionize speaker');
          return speaker;
        });
        if (!sessionSpeakers.length) throw new Error('Sessionize talk has no speaker');
        return {
          slug,
          title: requiredText(session.title, 'session.title'),
          description: optionalText(session.description, 'session.description'),
          level:
            array(session.categoryItems, 'session.categoryItems')
              .map(value => levels.get(identifier(value, 'session.categoryItem')))
              .find(Boolean) ?? null,
          duration: Number.isFinite(duration) && duration > 0 ? duration : null,
          start,
          end,
          room: roomId ? rooms.get(roomId)! : null,
          speakers: sessionSpeakers
        };
      })
      .sort((a, b) => {
        if (a.start && b.start && a.start !== b.start) return a.start.localeCompare(b.start);
        if (a.start && !b.start) return -1;
        if (!a.start && b.start) return 1;
        return a.title.localeCompare(b.title, 'es');
      });
    return { speakers, talks };
  } finally {
    // Let transport/schema errors reach Next.js: ISR retains the last valid page
    // instead of replacing it with an empty agenda or transient notFound result.
    clearTimeout(timeout);
  }
}
