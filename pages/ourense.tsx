import type { ReactNode } from 'react';

import Page from '@components/page';
import Layout from '@components/layout';
import LinkButton from '@components/hms/LinkButton';

import { OURENSE_REGISTRO_URL, OURENSE_WEB_URL, SITE_NAME } from '@lib/constants';

const COLORS = ['#4285f4', '#ea4335', '#f9ab00', '#34a853'];

// Una sola pantalla en escritorio: el alto es el de la ventana menos la cabecera, sin pie.
export default function OurensePage() {
  const meta = {
    title: 'DevFest Ourense - ' + SITE_NAME,
    description:
      'Entrada gratuita al DevFest Ourense 2026 por venir al DevFest Santiago: sábado 7 de noviembre, desde las 9:00, en la ESEI.'
  };

  return (
    <Page meta={meta}>
      <Layout hideFooter>
        <div className="flex flex-1 items-center px-5 py-10 sm:px-8 lg:h-[calc(var(--100vh,100vh)-var(--header-height))] lg:py-6">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="flex min-w-0 flex-col gap-5 xl:gap-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ourense/logo-gdg-ourense.png"
                    alt=""
                    width={536}
                    height={193}
                    className="h-9 w-auto xl:h-11"
                  />
                  <p className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                    GDG Ourense
                  </p>
                </div>
                <p className="rounded-full bg-[var(--brand-yellow)] px-4 py-1.5 text-sm font-bold text-black">
                  Regalo por venir al DevFest Santiago
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl 2xl:text-6xl">
                  Entrada gratis al{' '}
                  <span className="whitespace-nowrap text-[var(--brand-yellow)]">DevFest Ourense</span>{' '}
                  2026
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-gray-300 xl:text-lg">
                  El GDG Ourense te invita a su DevFest. Escanea el QR, regístrate con el código ya
                  aplicado y la entrada te sale a 0&nbsp;€.
                </p>
                {/* En el móvil el QR no sirve de mucho: el botón va arriba */}
                <div className="lg:hidden">
                  <LinkButton href={OURENSE_REGISTRO_URL} target="_blank" rel="noopener noreferrer">
                    Apuntarme gratis
                    <span aria-hidden="true">↗</span>
                  </LinkButton>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Dato color={COLORS[0]} etiqueta="Cuándo">
                  Sábado 7 de noviembre
                </Dato>
                <Dato color={COLORS[3]} etiqueta="Hora">
                  Desde las 9:00
                </Dato>
                <Dato color={COLORS[1]} etiqueta="Dónde">
                  ESEI, Campus de Ourense
                </Dato>
              </div>

              <p className="text-sm leading-relaxed text-gray-400">
                Escola Superior de Enxeñaría Informática, Edificio Politécnico s/n, 32004 Ourense.
                <br />
                Promoción válida del miércoles 4 de noviembre a las 8:00 al jueves 5 a las 23:30.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <a
                href={OURENSE_REGISTRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Registrarte gratis en el DevFest Ourense 2026"
                className="qr-card relative block aspect-square w-[260px] rounded-[32px] sm:w-[300px] lg:w-[min(360px,calc(var(--100vh,100vh)-360px))]"
              >
                <span
                  aria-hidden="true"
                  className="qr-card-back absolute inset-0 rounded-[32px]"
                  style={{
                    background: `linear-gradient(90deg, ${COLORS[0]} 0% 25%, ${COLORS[1]} 25% 50%, ${COLORS[2]} 50% 75%, ${COLORS[3]} 75%)`
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/qr/qr-ourense.png"
                  alt="Código QR para registrarte gratis en el DevFest Ourense 2026"
                  width={360}
                  height={360}
                  className="relative h-full w-full rounded-[32px] bg-white p-4"
                />
              </a>
              <p className="flex items-center gap-2 text-base font-semibold text-white">
                <span aria-hidden="true" className="text-xl">
                  ↑
                </span>
                Escanéalo con el móvil
              </p>
              <div className="flex flex-col items-center gap-3">
                <LinkButton className="hidden lg:inline-flex" href={OURENSE_REGISTRO_URL} target="_blank" rel="noopener noreferrer">
                  Apuntarme gratis
                  <span aria-hidden="true">↗</span>
                </LinkButton>
                <a
                  href={OURENSE_WEB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 underline-offset-4 hover:text-white hover:underline"
                >
                  devfest.gdgourense.es
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Page>
  );
}

function Dato({ color, etiqueta, children }: { color: string; etiqueta: string; children: ReactNode }) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{etiqueta}</p>
      <p className="mt-1 text-base font-bold leading-snug text-white xl:text-lg">{children}</p>
    </div>
  );
}
