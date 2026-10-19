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
import styles from './footer.module.css';
import { COPYRIGHT_HOLDER, CODE_OF_CONDUCT, BRAND_NAME } from '@lib/constants';

export default function Footer() {
  return (
    <footer className={cn(styles.footer)}>
      <div className={styles['footer-legal']}>
        <div className={styles['footer-hostedby']}>
          <div className={styles['footer-separator']} />
        </div>
        <div className={styles['footer-copyright']}>
          Copyright © {`${new Date().getFullYear()} `} {COPYRIGHT_HOLDER || `${BRAND_NAME}.`} Todos
          los derechos reservados.
        </div>
        <div className={styles['footer-center-group']}>
          <p className={styles['footer-paragraph']}>
            <a
              href="https://www.instagram.com/GDGSantiagoES"
              className={styles['footer-link']}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </p>
          <div className={styles['footer-separator']}></div>
          <p className={styles['footer-paragraph']}>
            <a
              href="https://www.linkedin.com/company/11843951"
              className={styles['footer-link']}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </p>
          <div className={styles['footer-separator']}></div>
          <p className={styles['footer-paragraph']}>
            <a
              href="https://twitter.com/GDGSantiagoES"
              className={styles['footer-link']}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </p>
          <div className={styles['footer-separator']}></div>
          <p className={styles['footer-paragraph']}>
            <a
              href={CODE_OF_CONDUCT}
              className={styles['footer-link']}
              target="_blank"
              rel="noopener noreferrer"
            >
              Código de Conducta
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
