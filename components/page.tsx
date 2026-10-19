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

import cn from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { SITE_NAME, SITE_URL, TWITTER_USER_NAME } from '@lib/constants';

type Meta = {
  title: string | null;
  description: string | null;
  image?: string | null;
  url?: string | null;
};

type Props = {
  meta: Meta;
  children: React.ReactNode;
  fullViewport?: boolean;
};

export default function Page({ meta, children, fullViewport = false }: Props) {
  const router = useRouter();
  const image = meta.image || '/open-graph-image.png';
  const title = meta.title || SITE_NAME;
  const url = new URL(meta.url || router.asPath.split(/[?#]/)[0], SITE_URL).href;
  const imageUrl = image ? new URL(image, SITE_URL).href : null;
  const description = meta.description || SITE_NAME;

  return (
    <div className={cn('page-container', { full: fullViewport })}>
      <Head>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:site" content={`@${TWITTER_USER_NAME}`} />
        <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {imageUrl && (
          <meta
            property="og:image"
            content={imageUrl}
          />
        )}
      </Head>
      {children}
    </div>
  );
}
