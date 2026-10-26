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

import React from 'react';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { AgendaBloque, AgendaDia, AgendaPonente, AgendaSesion } from '@lib/agenda';
import styles from './schedule-grid.module.css';
import Button from './hms/Button';

// La rejilla de la agenda de 2025: una columna por sala y cada charla colocada según su hora.
// Los bloques comunes (apertura, pausas, clausura) van en la columna «General».

type Props = {
  agenda: AgendaDia[];
};

type Celda = {
  key: string;
  titulo: string;
  inicio: string;
  fin: string;
  sala: string | null;
  ponentes: AgendaPonente[];
  general: boolean;
  sessionize: string | null;
};

const PIXELS_PER_MINUTE = 3.5;

function minutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

function hora(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

function deSesion(sesion: AgendaSesion): Celda {
  return { ...sesion, key: sesion.id, general: false };
}

function deBloque(bloque: AgendaBloque): Celda {
  return { ...bloque, key: `${bloque.inicio}-${bloque.titulo}`, ponentes: [], general: true, sessionize: null };
}

function celdasDelDia(day: AgendaDia) {
  const general: Celda[] = [];
  const porSala = new Map<string, Celda[]>();
  for (const franja of day.franjas) {
    if ('bloque' in franja) {
      general.push(deBloque(franja.bloque));
      continue;
    }
    for (const sesion of franja.sesiones) {
      porSala.set(sesion.sala, [...(porSala.get(sesion.sala) ?? []), deSesion(sesion)]);
    }
  }
  const salas = Array.from(porSala, ([nombre, celdas]) => ({ nombre, celdas }));
  const todas = [...general, ...salas.flatMap(s => s.celdas)].sort((a, b) => minutos(a.inicio) - minutos(b.inicio));
  return { general, salas, todas };
}

function Enlace({ celda, className, children }: { celda: Celda; className: string; children: React.ReactNode }) {
  return celda.sessionize ? (
    <Link href={`/sessions/${celda.sessionize}`} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

function MobileTalkCard({ celda }: { celda: Celda }) {
  return (
    <Enlace
      celda={celda}
      className={cn(styles.mobileTalkCard, {
        [styles.mobileServiceSession]: celda.general
      })}
    >
      <div className={styles.mobileTimeHeader}>
        <span className={styles.mobileTime}>
          {celda.inicio} - {celda.fin}
        </span>
        {celda.sala && <span className={styles.mobileStage}>{celda.sala}</span>}
      </div>

      <div className={styles.mobileTalkContent}>
        <h3 className={styles.mobileTalkTitle}>{celda.titulo}</h3>

        {celda.ponentes.length > 0 && (
          <div className={styles.mobileSpeakers}>
            {celda.ponentes.map(ponente => (
              <div key={ponente.nombre} className={styles.mobileSpeakerItem}>
                {ponente.foto && (
                  <div className={styles.mobileSpeakerAvatar}>
                    <Image
                      src={ponente.foto}
                      alt={ponente.nombre}
                      width={40}
                      height={40}
                      className={styles.mobileSpeakerImage}
                    />
                  </div>
                )}
                <div className={styles.mobileSpeakerInfo}>
                  <span className={styles.mobileSpeakerName}>{ponente.nombre}</span>
                  {ponente.cargo && <span className={styles.mobileSpeakerTitle}>{ponente.cargo}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Enlace>
  );
}

function TalkCell({ celda, desde }: { celda: Celda; desde: number }) {
  return (
    <div
      className={styles.timelineSession}
      style={{
        top: `${(minutos(celda.inicio) - desde) * PIXELS_PER_MINUTE}px`,
        height: `${(minutos(celda.fin) - minutos(celda.inicio)) * PIXELS_PER_MINUTE}px`
      }}
    >
      <Enlace celda={celda} className={cn(styles.talkCell, { [styles.serviceSession]: celda.general })}>
        <div className={styles.talkContent}>
          <h4 className={styles.talkTitle}>{celda.titulo}</h4>
          {celda.ponentes.length > 0 && (
            <div className={styles.speakers}>
              {celda.ponentes.map(ponente => (
                <div key={ponente.nombre} className={styles.speakerItem}>
                  {ponente.foto && (
                    <div className={styles.speakerAvatar}>
                      <Image
                        src={ponente.foto}
                        alt={ponente.nombre}
                        width={24}
                        height={24}
                        className={styles.speakerImage}
                      />
                    </div>
                  )}
                  <span className={styles.speakerName}>{ponente.nombre}</span>
                </div>
              ))}
            </div>
          )}
          {/* En un bloque de un cuarto de hora no cabe más que el título */}
          {minutos(celda.fin) - minutos(celda.inicio) > 20 && (
            <div className={styles.talkTime}>
              {celda.inicio} - {celda.fin}
              {celda.general && celda.sala && ` · ${celda.sala}`}
            </div>
          )}
        </div>
      </Enlace>
    </div>
  );
}

export default function ScheduleGrid({ agenda }: Props) {
  const [currentDate, setCurrentDate] = React.useState(agenda[0].date);
  const currentDay = agenda.find(day => day.date === currentDate) ?? agenda[0];
  const { general, salas, todas } = React.useMemo(() => celdasDelDia(currentDay), [currentDay]);

  // De la hora en punto anterior a la primera sesión a la hora siguiente a la última.
  const desde = todas.length ? Math.floor(minutos(todas[0].inicio) / 60) * 60 : 0;
  const hasta = todas.length ? (Math.floor(Math.max(...todas.map(c => minutos(c.fin))) / 60) + 1) * 60 : 0;
  const timelineHeight = (hasta - desde) * PIXELS_PER_MINUTE;
  const hourMarkers: number[] = [];
  for (let min = desde; min <= hasta; min += 60) hourMarkers.push(min);

  return (
    <div className={styles.container}>
      {/* Day selector */}
      <div className={styles.daySelector}>
        {agenda.map(day => (
          <Button
            onClick={() => setCurrentDate(day.date)}
            key={day.date}
            type="button"
            className={cn(styles.dayButton, {
              [styles.dayButtonActive]: day.date === currentDay.date
            })}
          >
            {day.label}
          </Button>
        ))}
      </div>

      {/* Mobile layout */}
      <div className={styles.mobileSchedule}>
        {todas.map(celda => (
          <MobileTalkCard key={celda.key} celda={celda} />
        ))}
      </div>

      {/* Desktop continuous timeline layout */}
      <div className={styles.scheduleWrapper}>
        {!todas.length ? (
          <div>No hay sesiones este día</div>
        ) : (
          <div className={styles.timelineContainer}>
            {/* Headers row */}
            <div className={styles.headersRow}>
              <div className={styles.timeHeaderCell}></div>
              {general.length > 0 && (
                <div className={styles.stageHeader}>
                  <h3 className={styles.stageName}>General</h3>
                </div>
              )}
              {salas.map(sala => (
                <div key={sala.nombre} className={styles.stageHeader}>
                  <h3 className={styles.stageName}>{sala.nombre}</h3>
                </div>
              ))}
            </div>

            {/* Timeline content area */}
            <div className={styles.timelineContent}>
              {/* Time markers column */}
              <div className={styles.timeMarkersColumn} style={{ height: `${timelineHeight}px` }}>
                {hourMarkers.map(marker => (
                  <div
                    key={marker}
                    className={styles.timeMarker}
                    style={{ top: `${(marker - desde) * PIXELS_PER_MINUTE}px` }}
                  >
                    <span className={styles.timeLabel}>{hora(marker)}</span>
                    <div className={styles.timeMarkerLine} />
                  </div>
                ))}
              </div>

              {/* Tracks container */}
              <div className={styles.tracksContainer}>
                {general.length > 0 && (
                  <div className={styles.track} style={{ height: `${timelineHeight}px` }}>
                    {general.map(celda => (
                      <TalkCell key={celda.key} celda={celda} desde={desde} />
                    ))}
                  </div>
                )}

                {salas.map(sala => (
                  <div key={sala.nombre} className={styles.track} style={{ height: `${timelineHeight}px` }}>
                    {sala.celdas.map(celda => (
                      <TalkCell key={celda.key} celda={celda} desde={desde} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
