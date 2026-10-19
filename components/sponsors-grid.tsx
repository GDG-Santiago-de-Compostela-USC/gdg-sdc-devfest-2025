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

import Image from 'next/image';
import cn from 'classnames';
import { Sponsor } from '@lib/types';
import styles from './sponsors-grid.module.css';

type Props = {
  sponsors: Sponsor[];
};

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const CardContent = (
    <div className={styles.card}>
      <div className={styles.logoSection}>
        {sponsor.logo?.url ? (
          <div className={styles.logoWrapper}>
            <Image
              alt={sponsor.name}
              src={sponsor.logo.url}
              className={cn(styles.logo, {
                [styles.uscLogo]: sponsor.slug === 'usc' || sponsor.slug === 'etse',
              })}
              fill
              sizes="280px"
            />
          </div>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderText}>
              {sponsor.name}
            </span>
          </div>
        )}
      </div>
      <div className={styles.cardInfo}>
        <div>
          <h3 className={styles.name}>{sponsor.name}</h3>
          {sponsor.description && (
            <p className={styles.description}>
              {sponsor.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (sponsor.website) {
    return (
      <a
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cardLink}
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
}

const TierSection = ({ 
  tier, 
  sponsors, 
  title 
}: { 
  tier: string;
  sponsors: Sponsor[];
  title: string;
}) => {
  if (sponsors.length === 0) return null;

  return (
    <div className={styles.tierSection}>
      <div className={styles.tierHeader}>
        <h2 className={styles.tierTitle}>{title}</h2>
      </div>
      
      <div className={cn(styles.grid, styles[`${tier.toLowerCase()}Grid`])}>
        {sponsors.map(sponsor => (
          <SponsorCard 
            key={sponsor.slug || sponsor.name} 
            sponsor={sponsor} 
          />
        ))}
      </div>
    </div>
  );
};

export default function SponsorsGrid({ sponsors }: Props) {
  const platinumSponsors = sponsors.filter(s => s.tier === 'Platinum');
  const goldSponsors = sponsors.filter(s => s.tier === 'Gold');
  const silverSponsors = sponsors.filter(s => s.tier === 'Silver');
  const bronzeSponsors = sponsors.filter(s => s.tier === 'Bronze');
  const collaborators = sponsors.filter(s => s.tier === 'Colaborador');

  return (
    <div className={styles.container}>
      <TierSection
        tier="Platinum"
        sponsors={platinumSponsors}
        title="Platino"
      />

      <TierSection
        tier="Gold"
        sponsors={goldSponsors}
        title="Oro"
      />

      <TierSection
        tier="Silver"
        sponsors={silverSponsors}
        title="Plata"
      />

      <TierSection
        tier="Bronze"
        sponsors={bronzeSponsors}
        title="Bronce"
      />

      <TierSection
        tier="Colaborador"
        sponsors={collaborators}
        title="Colaboradores"
      />
    </div>
  );
}