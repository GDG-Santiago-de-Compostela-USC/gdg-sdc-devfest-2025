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

import Page from '@components/page';
import SponsorsGrid from '@components/sponsors-grid';
import Layout from '@components/layout';
import LinkButton from '@components/hms/LinkButton';
import PageHero from '@components/page-hero';

import { getAllSponsors } from '@lib/cms-api';
import { Sponsor } from '@lib/types';
import { META_DESCRIPTION, SITE_NAME } from '@lib/constants';

// Sponsors confirmados para DevFest Santiago 2026
const REAL_SPONSORS: Sponsor[] = [
  // Silver Tier
  {
    name: 'Raiola Networks',
    description: 'Empresa gallega especializada en hosting web, servidores dedicados y soluciones de infraestructura cloud.',
    slug: 'raiola-networks',
    website: 'https://raiolanetworks.es',
    callToAction: 'Ver servicios',
    callToActionLink: 'https://raiolanetworks.es',
    links: [],
    discord: '',
    tier: 'Silver',
    cardImage: { url: '/logo-Raiola-Networks-Plata.jpg' },
    logo: { url: '/logo-Raiola-Networks-Plata.jpg' },
    youtubeSlug: ''
  },
  {
    name: 'dinahosting',
    description: 'Proveedor líder de servicios de hosting y dominios en España, ofreciendo soluciones confiables para empresas y desarrolladores.',
    slug: 'dinahosting',
    website: 'https://dinahosting.com',
    callToAction: 'Descubre servicios',
    callToActionLink: 'https://dinahosting.com',
    links: [],
    discord: '',
    tier: 'Silver',
    cardImage: { url: '/dinahosting.png' },
    logo: { url: '/dinahosting.png' },
    youtubeSlug: ''
  }
];

type Props = {
  sponsors: Sponsor[];
};

export default function PartnersPage({ sponsors }: Props) {
  const meta = {
    title: 'Patrocinadores - ' + SITE_NAME,
    description: 'Conoce a las empresas que hacen posible DevFest Santiago 2026. Únete a nosotros y forma parte del futuro de la tecnología.'
  };

  const allSponsors = REAL_SPONSORS;

  return (
    <Page meta={meta}>
      <Layout>
        <PageHero
          title="Patrocinadores"
          description="Las empresas que hacen posible el DevFest Santiago 2026."
        >
          <LinkButton href="mailto:devfest@gdg-sdc.org">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            Patrocina el DevFest
          </LinkButton>
        </PageHero>

        <div className="bg-white">
          <SponsorsGrid sponsors={allSponsors} />
        </div>
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const sponsors = await getAllSponsors().catch(() => []);

  return {
    props: {
      sponsors
    },
    revalidate: 60
  };
};