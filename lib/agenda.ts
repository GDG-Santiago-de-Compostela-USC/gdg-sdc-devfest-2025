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

import { AGENDA_SUPABASE_KEY, AGENDA_SUPABASE_URL, EVENT_DAYS } from '@lib/constants';

// La agenda se edita en el panel de gestión (Supabase) y la web la lee con agenda_publica(),
// que solo devuelve campos públicos y las sesiones ya colocadas.

export type AgendaPonente = {
  nombre: string;
  cargo: string | null;
  foto: string | null;
  sessionize: string | null;
};

export type AgendaSesion = {
  id: string;
  titulo: string;
  nivel: string | null;
  duracion: number;
  inicio: string;
  fin: string;
  sala: string;
  sessionize: string | null;
  ponentes: AgendaPonente[];
};

export type AgendaBloque = {
  titulo: string;
  tipo: 'Plenaria' | 'Pausa';
  inicio: string;
  fin: string;
  sala: string | null;
};

// Una franja es lo que empieza a la misma hora: un bloque fijo o una o varias sesiones en paralelo.
export type AgendaFranja =
  | { inicio: string; fin: string; bloque: AgendaBloque }
  | { inicio: string; fin: string; sesiones: AgendaSesion[] };

export type AgendaDia = {
  date: string;
  label: string;
  start: string;
  end: string;
  franjas: AgendaFranja[];
};

type Respuesta = {
  salas: { id: string; nombre: string }[];
  bloques: (Omit<AgendaBloque, 'sala'> & { dia: string; sala: string | null })[];
  sesiones: (Omit<AgendaSesion, 'sala'> & { dia: string; sala: string })[];
};

/** null si no se puede leer o aún no hay ninguna sesión colocada: la página enseña entonces el listado de charlas. */
export async function getAgenda(): Promise<AgendaDia[] | null> {
  try {
    const res = await fetch(`${AGENDA_SUPABASE_URL}/rest/v1/rpc/agenda_publica`, {
      method: 'POST',
      headers: { apikey: AGENDA_SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: '{}'
    });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    const data: Respuesta = await res.json();
    if (!data.sesiones.length) return null;

    const sala = new Map(data.salas.map(s => [s.id, s.nombre]));
    const orden = data.salas.map(s => s.nombre);

    return EVENT_DAYS.map(day => {
      const franjas: AgendaFranja[] = data.bloques
        .filter(b => b.dia === day.date)
        .map(b => ({
          inicio: b.inicio,
          fin: b.fin,
          bloque: { titulo: b.titulo, tipo: b.tipo, inicio: b.inicio, fin: b.fin, sala: b.sala ? sala.get(b.sala) ?? null : null }
        }));

      const porHora = new Map<string, AgendaSesion[]>();
      for (const { dia, ...s } of data.sesiones) {
        if (dia !== day.date) continue;
        porHora.set(s.inicio, [...(porHora.get(s.inicio) ?? []), { ...s, sala: sala.get(s.sala) ?? '' }]);
      }
      porHora.forEach((sesiones, inicio) => {
        sesiones.sort((a, b) => orden.indexOf(a.sala) - orden.indexOf(b.sala));
        franjas.push({ inicio, fin: sesiones.map(s => s.fin).sort().pop()!, sesiones });
      });

      franjas.sort((a, b) => a.inicio.localeCompare(b.inicio));
      return { ...day, franjas };
    });
  } catch (error) {
    console.error('Error fetching the agenda:', error);
    return null;
  }
}
