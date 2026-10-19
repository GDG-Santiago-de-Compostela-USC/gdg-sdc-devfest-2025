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
export const SITE_NAME = 'DevFest Santiago de Compostela 2026';
export const META_DESCRIPTION =
  'DevFest Santiago de Compostela 2026: charlas y talleres sobre inteligencia artificial y desarrollo web. 4 y 5 de noviembre en la ETSE, USC. Entrada gratuita con inscripción.';
export const SITE_DESCRIPTION =
  'Charlas y talleres sobre inteligencia artificial y desarrollo web. Conecta con la comunidad.';
export const DATE = '4 y 5 de noviembre de 2026';
export const SHORT_DATE = '4-5 Nov';
export const FULL_DATE = '4-5 Nov';
export const REGISTRATION_URL =
  'https://gdg.community.dev/events/details/google-gdg-santiago-de-compostela-presents-devfest-santiago-de-compostela-2026/';
export const EVENT_TIME_ZONE = 'Europe/Madrid';

// Endpoint de la API de Sessionize del evento (solo lectura)
export const SESSIONIZE_ID = '6irtnp29';

// Horario aproximado: aún no hay agenda cerrada en Sessionize
export const EVENT_DAYS = [
  { date: '2026-11-04', label: 'Miércoles 4 de noviembre', start: '16:30', end: '20:15' },
  { date: '2026-11-05', label: 'Jueves 5 de noviembre', start: '11:00', end: '20:30' }
];
export const TWEET_TEXT = META_DESCRIPTION;
export const COOKIE = 'user-id';

// Remove process.env.NEXT_PUBLIC_... below and replace them with
// strings containing your own privacy policy URL and copyright holder name
export const LEGAL_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL;
export const COPYRIGHT_HOLDER = process.env.NEXT_PUBLIC_COPYRIGHT_HOLDER;

export const CODE_OF_CONDUCT =
  'https://developers.google.com/community-guidelines';
export const REPO = 'https://github.com/ACMCMC/gdg-sdc-devfest-2025';
export const SAMPLE_TICKET_NUMBER = 1234;
export const NAVIGATION = [
  /*{
    name: 'En directo',
    route: 'https://gdg-devfest-2025.sessionize.com/'
  },*/
  {
    name: 'Agenda',
    route: '/agenda'
  },
  {
    name: 'Patrocinadores',
    route: '/partners'
  },
  {
    name: 'Ponentes',
    route: '/speakers'
  },
  {
    name: 'Equipo',
    route: '/team'
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

export const PREVIOUS_EDITIONS = [
  { name: 'DevFest 2025', route: '/2025' },
  { name: 'DevFest 2024', route: 'https://devfest24.gdg-sdc.org/' },
  { name: 'DevFest 2023', route: 'https://devfest23.gdg-sdc.org/' }
];

export type TicketGenerationState = 'default' | 'loading';
