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
import PageHero from '@components/page-hero';
import LinkButton from '@components/hms/LinkButton';

import { getSessionizeData } from '@lib/sessionize';
import { Speaker } from '@lib/types';
import { META_DESCRIPTION, SITE_NAME } from '@lib/constants';

type Props = {
  speakers: Speaker[];
};

export default function Speakers({ speakers }: Props) {
  const meta = {
    title: 'Ponentes - ' + SITE_NAME,
    description: META_DESCRIPTION
  };
  return (
    <Page meta={meta}>
      <Layout>
        <PageHero
          title="Ponentes"
          description="Quién sube al escenario en el DevFest Santiago 2026. Conoce a cada ponente y descubre sus charlas."
        >
          <LinkButton href="/agenda" variant="secondary">
            Ver agenda
          </LinkButton>
        </PageHero>

        <div className="bg-white">
          <SpeakersGrid speakers={speakers} />
        </div>
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { speakers } = await getSessionizeData();

  return {
    props: {
      speakers: speakers as unknown as Speaker[]
    },
    revalidate: 360
  };
};
