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

import { AGENDA_SUPABASE_KEY, AGENDA_SUPABASE_URL } from '@lib/constants';

// Charlas y ponentes salen del panel de gestión con web_publica(), que solo devuelve campos públicos.
// Sessionize no se lee: su endpoint expone las respuestas privadas de los ponentes, y las
// descripciones se revisan en el panel antes de publicarse.

export type PublicSpeaker = {
  name: string;
  title: string;
  bio: string;
  image: { url: string };
  slug: string;
  isTopSpeaker: boolean;
};

export type PublicTalk = {
  slug: string;
  title: string;
  description: string;
  level: string | null;
  duration: number | null;
  // Día (YYYY-MM-DD), horas (HH:MM, hora de Santiago) y sala; null mientras la charla no esté colocada
  dia: string | null;
  inicio: string | null;
  fin: string | null;
  sala: string | null;
  speakers: PublicSpeaker[];
};

type Respuesta = {
  ponentes: { slug: string; nombre: string; cargo: string | null; bio: string | null; foto: string | null }[];
  sesiones: {
    slug: string;
    titulo: string;
    descripcion: string | null;
    nivel: string | null;
    duracion: number;
    dia: string | null;
    inicio: string | null;
    fin: string | null;
    sala: string | null;
    ponentes: string[];
  }[];
};

export async function getCharlas(): Promise<{
  speakers: PublicSpeaker[];
  talks: PublicTalk[];
}> {
  try {
    const res = await fetch(`${AGENDA_SUPABASE_URL}/rest/v1/rpc/web_publica`, {
      method: 'POST',
      headers: { apikey: AGENDA_SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: '{}'
    });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    const data: Respuesta = await res.json();

    // Sin foto no hay tarjeta que pintar: ese ponente sale en su charla pero no en el listado
    const speakers: PublicSpeaker[] = data.ponentes
      .filter(p => p.foto)
      .map(p => ({
        name: p.nombre,
        title: p.cargo ?? '',
        bio: p.bio ?? '',
        image: { url: p.foto! },
        slug: p.slug,
        isTopSpeaker: false
      }));

    const talks: PublicTalk[] = data.sesiones.map(s => ({
      slug: s.slug,
      title: s.titulo,
      description: s.descripcion ?? '',
      level: s.nivel,
      duration: s.duracion,
      dia: s.dia,
      inicio: s.inicio,
      fin: s.fin,
      sala: s.sala,
      speakers: s.ponentes
        .map(slug => speakers.find(sp => sp.slug === slug))
        .filter((sp): sp is PublicSpeaker => Boolean(sp))
    }));

    return { speakers, talks };
  } catch (error) {
    console.error('Error fetching talks and speakers:', error);
    return { speakers: [], talks: [] };
  }
}
