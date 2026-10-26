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

import type { ReactNode } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import Page from '@components/page';
import Layout from '@components/layout';
import LinkButton from '@components/hms/LinkButton';
import PageHero from '@components/page-hero';

import { AgendaBloque, AgendaDia, AgendaPonente, AgendaSesion, getAgenda } from '@lib/agenda';
import { getSessionizeData, SessionizeTalk } from '@lib/sessionize';
import { EVENT_DAYS, META_DESCRIPTION, SITE_NAME } from '@lib/constants';

// Con agenda se pinta el horario; sin ella (aún sin colocar o sin conexión), el listado de charlas.
type Props = {
  agenda: AgendaDia[] | null;
  talks: SessionizeTalk[];
};

export default function SchedulePage({ agenda, talks }: Props) {
  const meta = {
    title: 'Agenda - ' + SITE_NAME,
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <PageHero
          title="Agenda"
          description={
            agenda
              ? 'El horario del DevFest Santiago 2026: qué charla hay a cada hora y en qué sala.'
              : 'Las charlas confirmadas del DevFest Santiago 2026 y el horario previsto de cada día.'
          }
        >
          <LinkButton href="/speakers" variant="secondary">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.3.63-1.42 1.37L1.5 16H4v6h4v-6h2v6h4v-6h2v6h4z"/>
            </svg>
            Ver speakers
          </LinkButton>
        </PageHero>

        <div className="rounded-t-[40px] bg-black/20 px-6 pt-10 pb-16 md:px-8 md:pt-14 md:pb-24">
          <div className="mx-auto max-w-5xl">
            {agenda ? <Horario agenda={agenda} /> : <ListadoCharlas talks={talks} />}
          </div>
        </div>
      </Layout>
    </Page>
  );
}

function Aviso({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#f9ab00]/30 bg-[#f9ab00]/10 px-5 py-4 md:px-6 md:py-5">
      <svg className="mt-[2px] h-5 w-5 flex-none text-[var(--brand-yellow)] md:mt-[3px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
      <p className="m-0 text-sm leading-relaxed text-amber-100 md:text-base">{children}</p>
    </div>
  );
}

function Horario({ agenda }: { agenda: AgendaDia[] }) {
  return (
    <>
      <nav aria-label="Días" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {agenda.map(day => (
          <a
            key={day.date}
            href={`#dia-${day.date}`}
            className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center transition-colors duration-200 hover:border-[#4285f4]/60 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-lighter)] md:py-10"
          >
            <span className="block text-sm font-semibold uppercase tracking-widest text-[var(--brand-lighter)]">
              {day.label}
            </span>
            <span className="mt-3 block text-4xl font-black tabular-nums text-white md:text-5xl">
              {day.start} – {day.end}
            </span>
          </a>
        ))}
      </nav>

      <div className="mt-4">
        <Aviso>
          <strong className="font-semibold text-white">Horario provisional.</strong> Puede haber cambios hasta el
          día del evento: esta página se actualiza sola con la agenda más reciente.
        </Aviso>
      </div>

      {agenda.map(day => (
        <section key={day.date} id={`dia-${day.date}`} className="mt-16 scroll-mt-24 md:mt-20">
          <h2 className="mb-6 text-2xl font-black text-white md:text-3xl">{day.label}</h2>
          <ol className="flex flex-col gap-4">
            {day.franjas.map(franja => (
              <li key={franja.inicio + ('bloque' in franja ? franja.bloque.titulo : '')} className="grid grid-cols-1 gap-2 md:grid-cols-[96px_1fr] md:gap-6">
                <p className="m-0 flex items-baseline gap-2 tabular-nums md:flex-col md:gap-0.5 md:pt-5">
                  <time className="text-lg font-black text-white">{franja.inicio}</time>
                  <time className="text-sm text-gray-400">{franja.fin}</time>
                </p>
                {'bloque' in franja ? (
                  <Bloque bloque={franja.bloque} />
                ) : (
                  <div className={franja.sesiones.length > 1 ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : ''}>
                    {franja.sesiones.map(sesion => (
                      <Sesion key={sesion.id} sesion={sesion} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}

function Bloque({ bloque }: { bloque: AgendaBloque }) {
  if (bloque.tipo === 'Plenaria') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-3xl border border-[#4285f4]/30 bg-[#4285f4]/10 px-6 py-5">
        <p className="m-0 text-lg font-bold text-white md:text-xl">{bloque.titulo}</p>
        {bloque.sala && <p className="m-0 text-sm text-[var(--brand-lighter)]">{bloque.sala}</p>}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-3xl border border-dashed border-white/15 px-6 py-4 md:mt-3">
      <svg className="h-5 w-5 flex-none text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2a2 2 0 0 0 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
      </svg>
      <p className="m-0 font-semibold text-gray-200">{bloque.titulo}</p>
      {bloque.sala && <p className="m-0 text-sm text-gray-400">{bloque.sala}</p>}
    </div>
  );
}

function Sesion({ sesion }: { sesion: AgendaSesion }) {
  const contenido = (
    <>
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-white px-3 py-1 text-gray-900">{sesion.sala}</span>
        {sesion.nivel && (
          <span className="rounded-full bg-[#4285f4]/15 px-3 py-1 text-[var(--brand-lighter)]">{sesion.nivel}</span>
        )}
        <span className="rounded-full bg-white/10 px-3 py-1 text-gray-200">{sesion.duracion} min</span>
      </div>
      <h3 className={`mt-4 text-lg font-bold leading-snug text-white transition-colors group-hover:text-[var(--brand-lighter)] md:text-xl ${sesion.ponentes.length ? 'mb-6' : ''}`}>
        {sesion.titulo}
      </h3>
      {sesion.ponentes.length > 0 && (
        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5">
          {sesion.ponentes.map(ponente => (
            <Ponente key={ponente.nombre} ponente={ponente} />
          ))}
        </div>
      )}
    </>
  );
  const clases = 'group flex h-full min-w-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7';

  return sesion.sessionize ? (
    <Link
      href={`/sessions/${sesion.sessionize}`}
      className={`${clases} transition-colors duration-200 hover:border-[#4285f4]/60 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-lighter)]`}
    >
      {contenido}
    </Link>
  ) : (
    <div className={clases}>{contenido}</div>
  );
}

function Ponente({ ponente }: { ponente: AgendaPonente }) {
  return (
    <div className="flex items-center gap-3">
      {ponente.foto ? (
        <Image src={ponente.foto} alt="" width={40} height={40} className="h-10 w-10 flex-none rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
          {ponente.nombre.charAt(0)}
        </span>
      )}
      <div className="min-w-0">
        <p className="m-0 text-sm font-semibold text-white">{ponente.nombre}</p>
        {ponente.cargo && <p className="m-0 mt-0.5 truncate text-xs text-gray-300">{ponente.cargo}</p>}
      </div>
    </div>
  );
}

function ListadoCharlas({ talks }: { talks: SessionizeTalk[] }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {EVENT_DAYS.map(day => (
          <div
            key={day.date}
            className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center md:py-10"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand-lighter)]">
              {day.label}
            </p>
            <p className="mt-3 text-4xl font-black tabular-nums text-white md:text-5xl">
              {day.start} – {day.end}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Aviso>
          <strong className="font-semibold text-white">Horarios provisionales.</strong> Estas son las horas
          aproximadas del evento, pero aún no son definitivas. En los próximos días publicaremos la
          agenda detallada con el horario y la sala de cada charla.
        </Aviso>
      </div>

      <div className="mt-16 mb-6 flex items-baseline justify-between gap-4 md:mt-20">
        <h2 className="text-2xl font-black text-white md:text-3xl">Charlas confirmadas</h2>
        <p className="text-sm text-gray-300">{talks.length} charlas</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {talks.map(talk => (
          <Link
            key={talk.slug}
            href={`/sessions/${talk.slug}`}
            className="group flex min-w-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors duration-200 hover:border-[#4285f4]/60 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-lighter)] md:p-7"
          >
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {talk.level && (
                <span className="rounded-full bg-[#4285f4]/15 px-3 py-1 text-[var(--brand-lighter)]">
                  {talk.level}
                </span>
              )}
              {talk.duration && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-gray-200">
                  {talk.duration} min
                </span>
              )}
            </div>
            <h3 className="mt-4 mb-6 text-lg font-bold leading-snug text-white transition-colors group-hover:text-[var(--brand-lighter)] md:text-xl">
              {talk.title}
            </h3>
            <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5">
              {talk.speakers.map(speaker => (
                <div key={speaker.slug} className="flex items-center gap-3">
                  <Image
                    src={speaker.image.url}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 flex-none rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{speaker.name}</p>
                    <p className="truncate text-xs text-gray-300">{speaker.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const agenda = await getAgenda();
  const talks = agenda ? [] : (await getSessionizeData()).talks;

  return {
    props: {
      agenda,
      talks
    },
    // Cada minuto: así los cambios del panel de gestión llegan solos a la web.
    revalidate: 60
  };
};
