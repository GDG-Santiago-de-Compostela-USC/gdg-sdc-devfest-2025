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

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import { NAVIGATION, REGISTRATION_URL } from '@lib/constants';
import { usePreventScroll, OverlayContainer } from '@react-aria/overlays';
import styles from './mobile-menu.module.css';
import PreviousEditions from './previous-editions';

type ModalDialogProps = {
  id: string;
  onClose: () => void;
};

function ModalDialog({ id, onClose }: ModalDialogProps) {
  const router = useRouter();
  const activeRoute = router.asPath;
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  usePreventScroll();
  const requestClose = () => {
    ref.current?.close();
    onClose();
  };

  return (
    <dialog
      className={styles['nav-overlay']}
      aria-label="Menú principal"
      onCancel={event => {
        event.preventDefault();
        requestClose();
      }}
      id={id}
      ref={ref}
    >
      <button
        type="button"
        className={cn(styles.button, styles['close-button'])}
        aria-label="Cerrar menú"
        onClick={requestClose}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={styles.icon}
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <nav className={styles.nav} aria-label="Navegación principal">
        <Link
          href="/"
          className={cn(styles['nav-item'], styles['current-edition'], {
            [styles['nav-active']]: activeRoute === '/'
          })}
          aria-current={activeRoute === '/' ? 'page' : undefined}
          onClick={requestClose}
        >
          DevFest 2026
        </Link>
        {NAVIGATION.map(({ name, route }) => (
          <Link
            key={name}
            href={route}
            className={cn(styles['nav-item'], {
              [styles['nav-active']]: activeRoute.startsWith(route)
            })}
            aria-current={activeRoute.startsWith(route) ? 'page' : undefined}
            onClick={requestClose}
          >
            {name}
          </Link>
        ))}
        <PreviousEditions mobile onNavigate={requestClose} />
        <a
          className={styles.registration}
          href={REGISTRATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={requestClose}
        >
          Reserva tu entrada
        </a>
      </nav>
    </dialog>
  );
}

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  const dialogId = useId();

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1120px)');
    const closeOnDesktop = () => {
      if (desktop.matches) close();
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, [close]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        type="button"
        className={styles.button}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          className={styles.icon}
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
      {isOpen && (
        <OverlayContainer>
          <ModalDialog id={dialogId} onClose={close} />
        </OverlayContainer>
      )}
    </>
  );
}
