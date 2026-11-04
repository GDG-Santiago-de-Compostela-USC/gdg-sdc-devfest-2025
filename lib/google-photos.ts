// Lee las fotos del álbum compartido de Google Fotos sin API oficial: la Library API ya no deja
// leer álbumes ajenos (marzo 2025), así que sacamos los datos del HTML de la página pública.
// Si Google cambia el formato, getAlbum devuelve null y /fotos enseña solo el QR y el enlace.

import { FOTOS_ALBUM_URL } from '@lib/constants';

export type AlbumPhoto = {
  id: string;
  // URL base de googleusercontent: se le añade "=w800" (o similar) para pedir un tamaño
  url: string;
  width: number;
  height: number;
  takenAt: number;
};

export type Album = { title: string; photos: AlbumPhoto[] };

const VIDEO_KEY = '76647426';

// Google responde 429 si la imagen se pide con Referer de otro sitio:
// las <img> llevan referrerPolicy="no-referrer".
export function photoSrc(photo: AlbumPhoto, width: number) {
  return `${photo.url}=w${width}-rw`;
}

// null = no se ha podido leer el álbum; photos vacío = el álbum existe pero aún no tiene fotos.
export async function getAlbum(): Promise<Album | null> {
  try {
    const res = await fetch(FOTOS_ALBUM_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36',
        'Accept-Language': 'es,gl;q=0.9',
        // Sin esto, desde servidores de la UE Google puede servir la página de consentimiento
        Cookie: 'SOCS=CAI'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    const match = html.match(
      /AF_initDataCallback\(\{key: 'ds:1'.*?data:([\s\S]*?), sideChannel: \{\}\}\);<\/script>/
    );
    if (!match) return null;
    const data = JSON.parse(match[1]);

    const photos: AlbumPhoto[] = [];
    for (const item of data?.[1] ?? []) {
      const extra = item?.[item.length - 1];
      if (extra && typeof extra === 'object' && VIDEO_KEY in extra) continue;
      const [url, width, height] = item?.[1] ?? [];
      if (typeof url !== 'string' || !width || !height) continue;
      photos.push({ id: item[0], url, width, height, takenAt: item[2] ?? 0 });
    }

    // Las más recientes primero: durante el evento, lo último que se sube es lo que interesa
    photos.sort((a, b) => b.takenAt - a.takenAt);
    return { title: data?.[3]?.[1] ?? 'Fotos', photos };
  } catch {
    return null;
  }
}
