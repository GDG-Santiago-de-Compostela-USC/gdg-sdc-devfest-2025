import { GetStaticProps } from 'next';

import Page from '@components/page';
import Layout from '@components/layout';
import LinkButton from '@components/hms/LinkButton';
import PageHero from '@components/page-hero';
import PhotoGallery from '@components/photo-gallery';

import { AlbumPhoto, getAlbum } from '@lib/google-photos';
import { FOTOS_URL, SITE_NAME } from '@lib/constants';

// null = no se ha podido leer el álbum; [] = aún no tiene fotos
type Props = { photos: AlbumPhoto[] | null };

const COLORS = ['#4285f4', '#ea4335', '#f9ab00', '#34a853'];

export default function FotosPage({ photos }: Props) {
  const meta = {
    title: 'Fotos - ' + SITE_NAME,
    description: 'Las fotos del DevFest Santiago 2026, subidas por quienes estuvieron allí.'
  };

  return (
    <Page meta={meta}>
      <Layout>
        <PageHero
          title="Fotos"
          description="El DevFest Santiago 2026 visto por quienes estáis aquí. Sube tus fotos al álbum compartido y aparecerán en esta página."
        />

        <div className="rounded-t-[40px] bg-black/20 px-4 pt-8 pb-16 sm:px-6 md:px-8 md:pt-12 md:pb-24">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:gap-14">
            <SubeTusFotos />

            {photos && photos.length > 0 ? (
              <section aria-labelledby="galeria" className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="galeria" className="text-2xl font-black text-white md:text-3xl">
                    Galería
                  </h2>
                  <p className="text-sm text-gray-300">
                    {photos.length} {photos.length === 1 ? 'foto' : 'fotos'} · toca una para verla en grande
                  </p>
                </div>
                <PhotoGallery photos={photos} />
              </section>
            ) : (
              <SinFotos error={photos === null} />
            )}
          </div>
        </div>
      </Layout>
    </Page>
  );
}

function SubeTusFotos() {
  return (
    <section className="grid items-center gap-8 rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:gap-12 md:p-10">
      <div className="relative mx-auto hidden h-[240px] w-[240px] md:block">
        <div
          aria-hidden="true"
          className="qr-card-back absolute inset-0 rounded-[28px]"
          style={{
            background: `linear-gradient(90deg, ${COLORS[0]} 0% 25%, ${COLORS[1]} 25% 50%, ${COLORS[2]} 50% 75%, ${COLORS[3]} 75%)`
          }}
        />
        <img
          src="/qr/qr-fotos.png"
          alt="Código QR del álbum de fotos del DevFest Santiago 2026"
          width={240}
          height={240}
          className="relative h-full w-full rounded-[28px] bg-white p-3"
        />
      </div>

      <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand-lighter)]">
          Álbum compartido
        </p>
        <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">
          Escanea el QR y sube tus fotos
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
          Charlas, pasillos, cañas… Todo vale. Cualquiera con el enlace puede añadir fotos al álbum de
          Google Fotos, y las verás aquí en un rato.
        </p>
        <LinkButton href={FOTOS_URL} target="_blank" rel="noopener noreferrer">
          Abrir el álbum
          <span aria-hidden="true">↗</span>
        </LinkButton>
      </div>
    </section>
  );
}

// Mosaico vacío con la forma del de verdad, para que la página no se vea rota antes de las primeras fotos
function SinFotos({ error }: { error: boolean }) {
  const spans = ['col-span-2 row-span-2', '', 'row-span-2', '', 'col-span-2', '', '', ''];
  return (
    <section className="relative">
      <div
        aria-hidden="true"
        className="grid grid-flow-dense auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[210px] lg:grid-cols-4 lg:gap-5"
      >
        {spans.map((span, i) => (
          <div
            key={i}
            className={`rounded-3xl border-2 border-dashed ${span}`}
            style={{
              borderColor: `${COLORS[i % COLORS.length]}55`,
              background: `${COLORS[i % COLORS.length]}0d`
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-md rounded-3xl border border-white/15 bg-[#1c1c20] px-6 py-8 text-center md:px-10">
          <p className="text-2xl font-black text-white md:text-3xl">
            {error ? 'No podemos cargar las fotos' : 'Aún no hay fotos'}
          </p>
          <p className="mt-3 text-base leading-relaxed text-gray-300">
            {error
              ? 'Ahora mismo no llegamos al álbum. Míralas directamente en Google Fotos.'
              : 'Sé la primera persona en subir una: escanea el QR o abre el álbum.'}
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton href={FOTOS_URL} target="_blank" rel="noopener noreferrer" variant="secondary">
              Ir al álbum
              <span aria-hidden="true">↗</span>
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// Se regenera cada 5 minutos: lo que se sube al álbum aparece aquí sin volver a desplegar
export const getStaticProps: GetStaticProps<Props> = async () => {
  const album = await getAlbum();
  return { props: { photos: album?.photos ?? null }, revalidate: 300 };
};
