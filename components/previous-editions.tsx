import { useEffect, useRef } from 'react';
import cn from 'classnames';
import { PREVIOUS_EDITIONS } from '@lib/constants';
import styles from './previous-editions.module.css';

type Props = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function PreviousEditions({ mobile = false, onNavigate }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (details && !details.contains(event.target as Node)) {
        details.open = false;
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);

  return (
    <details
      ref={detailsRef}
      className={cn(styles.editions, { [styles.mobile]: mobile })}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          event.currentTarget.open = false;
        }
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && event.currentTarget.open) {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.open = false;
          triggerRef.current?.focus();
        }
      }}
    >
      <summary ref={triggerRef} className={styles.trigger}>
        Otras ediciones
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <ul className={styles.list}>
        {PREVIOUS_EDITIONS.map(({ name, route }) => (
          <li key={route}>
            <a
              href={route}
              onClick={() => {
                if (detailsRef.current) detailsRef.current.open = false;
                onNavigate?.();
              }}
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
