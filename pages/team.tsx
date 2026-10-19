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
import SpeakersGrid from '@components/speakers-grid';
import Layout from '@components/layout';
import Header from '@components/header';
import LinkButton from '@components/hms/LinkButton';
import PageHero from '@components/page-hero';
import styles from '@components/contact.module.css';
import cn from 'classnames';

import { getAllSpeakers } from '@lib/cms-api';
import { Speaker, TeamMember } from '@lib/types';
import { META_DESCRIPTION, SITE_NAME } from '@lib/constants';
import TeamGrid from '@components/team-grid';
import { getAllTeamMembers } from '@lib/cms-providers/storyblok';

type Props = {
  teamMembers: TeamMember[];
};

export default function Team({ teamMembers }: Props) {
  const meta = {
    title: 'Equipo - ' + SITE_NAME,
    description: META_DESCRIPTION
  };
  return (
    <Page meta={meta}>
      <Layout>
        <PageHero
          title="Equipo"
          description="Las personas de GDG Santiago de Compostela que organizan el DevFest 2026."
        >
          <LinkButton href="mailto:devfest@gdg-sdc.org">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            Escríbenos
          </LinkButton>
          <LinkButton href="https://calendar.app.google/6a9udHPABjrCgmQP9" variant="secondary" target="_blank" rel="noopener noreferrer">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            Agenda una reunión
          </LinkButton>
        </PageHero>

        <div className="bg-white">
          <TeamGrid teamMembers={teamMembers} />
        </div>
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const teamMembers = await getAllTeamMembers().catch((e) => {
    console.error(e);
    return [];
  });

  return {
    props: {
      teamMembers
    },
    revalidate: 600
  };
};
