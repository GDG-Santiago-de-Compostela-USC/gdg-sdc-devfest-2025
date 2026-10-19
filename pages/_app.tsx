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

import { OverlayProvider } from 'react-aria';
import '@styles/global.css';
import '@styles/nprogress.css';
import '@styles/chrome-bug.css';
import { AppProps } from 'next/app';
import NProgress from '@components/nprogress';
import ResizeHandler from '@components/resize-handler';
import { useEffect } from 'react';
import localFont from 'next/font/local';
import { GoogleAnalytics } from 'nextjs-google-analytics';

const googleSans = localFont({
  src: [
    {
      path: '../public/GoogleSansDisplay-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/GoogleSansDisplay-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);
  return (
    <OverlayProvider className={googleSans.className}>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
      <ResizeHandler />
      <NProgress />
    </OverlayProvider>
  );
}
