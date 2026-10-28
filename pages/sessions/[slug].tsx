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
import Layout from '@components/layout';

import { getCharlas } from '@lib/charlas';
import { Speaker, Talk } from '@lib/types';
import { META_DESCRIPTION, SITE_NAME } from '@lib/constants';
import TalkSection from '@components/talk-section';

type Props = {
  talk: Talk;
};

export default function SpeakerPage({ talk }: Props) {
  const meta = {
    title: 'Sesión - ' + SITE_NAME,
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <TalkSection talk={talk} />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { talks } = await getCharlas();
  const talk = talks.find(t => t.slug === params?.slug);

  if (!talk) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      talk: {
        title: talk.title,
        description: talk.description,
        // Noviembre en Santiago es UTC+1; sin día la charla aún no está en la agenda
        start: talk.dia && talk.inicio ? `${talk.dia}T${talk.inicio}:00+01:00` : '',
        end: talk.dia && talk.fin ? `${talk.dia}T${talk.fin}:00+01:00` : '',
        ...(talk.sala ? { stage: { name: talk.sala } } : {}),
        slug: talk.slug,
        speaker: talk.speakers as unknown as Speaker[]
      }
    },
    revalidate: 60
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { talks } = await getCharlas();

  return {
    paths: talks.map(t => ({ params: { slug: t.slug } })),
    fallback: 'blocking'
  };
};
