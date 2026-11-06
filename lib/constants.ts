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

export const SITE_URL = 'https://devfest.gdg-sdc.org';
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = 'GDGSantiagoES';
export const BRAND_NAME = 'GDG Santiago de Compostela';
export const SITE_NAME_MULTILINE = ['DevFest', 'Santiago de Compostela'];
export const SITE_NAME = 'DevFest Santiago de Compostela 2027';
export const META_DESCRIPTION =
  'DevFest Santiago de Compostela es una conferencia tecnológica organizada por Google Developers Group Santiago de Compostela. Los GDG son una red local de grupos sin ánimo de lucro ofrecen charlas, demostraciones prácticas, talleres y laboratorios de código sobre las últimas tecnologías de Google. En 2022, se celebraron más de 550 DevFests, que ayudaron a más de 320.000 desarrolladores. DevFest es el principal evento local para que los desarrolladores conozcan las últimas tecnologías de Google de la mano de Googlers, Google Developer Experts y ponentes del sector.';
export const SITE_DESCRIPTION =
  'Tecnología, innovación y networking. ¡No te lo pierdas!';
export const DATE = '4 y 5 de Noviembre 2026';
export const SHORT_DATE = '4-5 Nov';
export const FULL_DATE = '4-5 Nov';

// La web principal anuncia ya la edición 2027; la de 2026 está archivada en /2026.
export const NEXT_EDITION_DATE = 'Próximamente';

// Charlas, ponentes y agenda salen del panel de gestión del equipo (devfest-gestion.vercel.app).
// La clave es la publicable: solo da acceso a web_publica() y agenda_publica(); las tablas están cerradas.
export const AGENDA_SUPABASE_URL = 'https://tzinuhrvdwovjvwztpla.supabase.co';
export const AGENDA_SUPABASE_KEY = 'sb_publishable_gkHyCsYhIKtQ2eiTiKD6dg_NFqgwJWd';

export const EVENT_DAYS = [
  { date: '2026-11-04', label: 'Miércoles 4 de noviembre', start: '16:00', end: '20:15' },
  { date: '2026-11-05', label: 'Jueves 5 de noviembre', start: '12:00', end: '20:15' }
];
// Álbum compartido de Google Fotos del DevFest 2026. La corta es la que se enseña (QR y enlace);
// la larga es la que lee /fotos, porque la corta pasa por una página intermedia si la pide un servidor.
export const FOTOS_URL = 'https://photos.app.goo.gl/DT56SgxzYphGD16d8';
export const FOTOS_ALBUM_URL =
  process.env.FOTOS_ALBUM_URL ||
  'https://photos.google.com/share/AF1QipO4m6lvThNsWfrV7rvwrl0j8X6Rgt9WIvtKyH-WuIafPxuMZRUcMUQGJKIKYmImug?key=NGl3VHBfcFZ5OHR0MU9UWVFodjc2TEEzUm93cGtB';

// Entrada gratuita al DevFest Ourense para quien viene al de Santiago. El código va en el enlace.
export const OURENSE_REGISTRO_URL =
  'https://gdg.community.dev/events/details/google-gdg-ourense-presents-devfest-2026/?code=FREEGDGSCQ';
export const OURENSE_WEB_URL = 'https://devfest.gdgourense.es';

export const TWEET_TEXT = META_DESCRIPTION;
export const COOKIE = 'user-id';

// Remove process.env.NEXT_PUBLIC_... below and replace them with
// strings containing your own privacy policy URL and copyright holder name
export const LEGAL_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL;
export const COPYRIGHT_HOLDER = process.env.NEXT_PUBLIC_COPYRIGHT_HOLDER;

export const CODE_OF_CONDUCT =
  'https://ubuntu.com/community/ethos/code-of-conduct';
export const REPO = 'https://github.com/ACMCMC/gdg-sdc-devfest-2025';
export const SAMPLE_TICKET_NUMBER = 1234;
export const NAVIGATION = [
  {
    name: 'Equipo',
    route: '/team'
  },
  {
    name: 'Fotos 2026',
    route: '/fotos'
  },
  {
    name: 'DevFest Ourense',
    route: '/ourense'
  },
  /*{
    name: 'Live Stage',
    route: '/stage/a'
  },
  {
    name: 'Vercel Stage',
    route: '/stage/c'
  },
  {
    name: '100ms Stage',
    route: '/stage/m'
  },
  {
    name: 'Schedule',
    route: '/schedule'
  },
  {
    name: 'Speakers',
    route: '/speakers'
  },
  {
    name: 'Expo',
    route: '/expo'
  },
  {
    name: 'Jobs',
    route: '/jobs'
  }*/
];

export type TicketGenerationState = 'default' | 'loading';
