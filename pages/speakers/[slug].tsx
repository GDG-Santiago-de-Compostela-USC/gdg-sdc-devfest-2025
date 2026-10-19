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

import { GetStaticProps, GetStaticPaths } from 'next';

import Page from '@components/page';
import SpeakerSection from '@components/speaker-section';
import Layout from '@components/layout';

import { getSessionizeData } from '@lib/sessionize';
import { Speaker } from '@lib/types';
import { META_DESCRIPTION, SITE_NAME } from '@lib/constants';

type Props = {
  speaker: Speaker;
  talks: { slug: string; title: string }[];
};

export default function SpeakerPage({ speaker, talks }: Props) {
  const meta = {
    title: speaker.name + ' - ' + SITE_NAME,
    description:
      (speaker.bio || speaker.title).replace(/\s+/g, ' ').trim().slice(0, 160) || META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <SpeakerSection speaker={speaker} talks={talks} />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { speakers, talks } = await getSessionizeData();
  const speaker = speakers.find(s => s.slug === params?.slug);

  if (!speaker) {
    return {
      notFound: true,
      revalidate: 60
    };
  }

  return {
    props: {
      speaker: speaker as unknown as Speaker,
      talks: talks
        .filter(t => t.speakers.some(s => s.slug === speaker.slug))
        .map(t => ({ slug: t.slug, title: t.title }))
    },
    revalidate: 60
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { speakers } = await getSessionizeData();

  return {
    paths: speakers.map(s => ({ params: { slug: s.slug } })),
    fallback: 'blocking'
  };
};
