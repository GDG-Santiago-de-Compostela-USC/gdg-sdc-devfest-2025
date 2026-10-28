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

module.exports = {
  images: {
    domains: [
      'www.datocms-assets.com',
      'a.storyblok.com',
      'images.ctfassets.net',
      'images.prismic.io',
      'cdn.aglty.io',
      'localhost', // For Strapi
      'sessionize.com',
      'cdn.sessionize.com',
      'devfest.gdg-sdc.org', // fotos de ponentes que no están en Sessionize (public/speakers)
      'upload.wikimedia.org',
      'images.unsplash.com',
      'github.githubassets.com',
      'assets.vercel.com',
      'webassets.mongodb.com'
    ],
    imageSizes: [24, 64, 300]
  },
  // Archivo estático de la edición 2025 (public/2025, generado con `next export` del commit 843ddd6)
  async rewrites() {
    return [
      { source: '/2025', destination: '/2025/index.html' },
      { source: '/2025/:path+', destination: '/2025/:path+/index.html' }
    ];
  },
  async redirects() {
    return [
      {
        source: '/live',
        destination: 'https://sessionize.com/gdg-devfest-2025/',
        permanent: true,
        basePath: false
      },
    ]
  },
};
