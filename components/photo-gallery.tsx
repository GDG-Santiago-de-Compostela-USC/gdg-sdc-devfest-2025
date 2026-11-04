import { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { type AlbumPhoto, photoSrc } from '@lib/google-photos';

// Cada tesela se lleva un color de Google en el borde al pasar por encima, por turnos
const COLORS = ['#4285f4', '#ea4335', '#f9ab00', '#34a853'];

// Tamaño de cada tesela en el mosaico: unas destacadas, las verticales altas y algunas horizontales anchas
function tileSpan(photo: AlbumPhoto, i: number) {
  if (i % 9 === 0) return 'col-span-2 row-span-2';
  if (photo.height > photo.width * 1.1) return 'row-span-2';
  if (photo.width > photo.height * 1.1 && i % 4 === 2) return 'col-span-2';
  return '';
}

export default function PhotoGallery({ photos }: { photos: AlbumPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (step: number) =>
      setOpen(i => (i === null ? i : (i + step + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  // Precarga la siguiente y la anterior para que pasar fotos sea instantáneo
  useEffect(() => {
    if (open === null) return;
    for (const step of [1, -1]) {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.src = photoSrc(photos[(open + step + photos.length) % photos.length], 1800);
    }
  }, [open, photos]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <div className="grid grid-flow-dense auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[210px] lg:grid-cols-4 lg:gap-5">
        {photos.map((photo, i) => {
          const big = i % 9 === 0;
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Abrir foto ${i + 1} de ${photos.length}`}
              className={`foto-rise foto-tile relative overflow-hidden rounded-3xl border-2 border-white/10 bg-white/5 ${tileSpan(photo, i)}`}
              style={
                {
                  '--tile': COLORS[i % COLORS.length],
                  animationDelay: `${Math.min(i, 12) * 45}ms`
                } as React.CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc(photo, big ? 1200 : 700)}
                alt=""
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>

      <Dialog.Root open={open !== null} onOpenChange={o => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="foto-fade fixed inset-0 z-50 bg-[#0b0b0f]/95" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none sm:p-8"
            onTouchStart={e => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={e => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <Dialog.Title className="sr-only">
              Foto {open !== null ? open + 1 : ''} de {photos.length}
            </Dialog.Title>

            <div className="flex w-full max-w-[1400px] items-center justify-between text-sm font-semibold text-white">
              <span className="tabular-nums">
                {open !== null ? open + 1 : ''} / {photos.length}
              </span>
              <Dialog.Close className="foto-close grid h-11 w-11 place-items-center rounded-full border border-white/30 text-lg text-white transition-colors hover:bg-white hover:text-black">
                <span aria-hidden="true">✕</span>
                <span className="sr-only">Cerrar</span>
              </Dialog.Close>
            </div>

            <div className="relative flex min-h-0 w-full max-w-[1400px] flex-1 items-center justify-center">
              {current && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={current.id}
                  src={photoSrc(current, 1800)}
                  referrerPolicy="no-referrer"
                  alt={`Foto ${open! + 1} del DevFest Santiago 2026`}
                  className="foto-zoom max-h-full max-w-full rounded-2xl object-contain"
                />
              )}
              <NavButton side="left" onClick={() => go(-1)} />
              <NavButton side="right" onClick={() => go(1)} />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Foto anterior' : 'Foto siguiente'}
      className={`foto-nav absolute hidden h-14 w-14 place-items-center rounded-full bg-white text-black shadow-lg sm:grid ${
        side === 'left' ? 'left-2' : 'right-2'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width={24}
        height={24}
        aria-hidden="true"
        style={side === 'left' ? { transform: 'rotate(180deg)' } : undefined}
      >
        <path
          d="M4 12h14M13 6l6 6-6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
