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

import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Sponsor } from '@lib/types';
import styles from './sponsors-grid.module.css';

type Props = {
  sponsors: Sponsor[];
};

function SponsorCard({ sponsor, tier }: { sponsor: Sponsor; tier: string }) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return '#fbbf24'; // Gold
      case 'Gold':
        return '#f59e0b'; // Orange-Gold
      case 'Silver':
        return '#94a3b8'; // Slate
      case 'Bronze':
        return '#fb923c'; // Orange
      case 'Colaborador':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

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
              width={300}
              height={120}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80px',
                objectFit: 'contain'
              }}
            />
          </div>
        ) : (
          <div
            className={styles.placeholder}
            style={{ backgroundColor: getTierColor(tier) }}
          >
            <span className={styles.placeholderText}>
              {sponsor.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
            </span>
          </div>
        )}
      </div>
      <div className={styles.cardInfo}>
        <div>
          <h2 className={styles.name}>{sponsor.name}</h2>
          <p className={styles.tier}>
            {tier === 'Colaborador' ? 'Partner' : `${tier} Sponsor`}
          </p>
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
        style={{ textDecoration: 'none', color: 'inherit' }}
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
      
      <div className={cn(styles.grid, styles[`${tier.toLowerCase()}Grid`], sponsors.length === 1 && styles.solo)}>
        {sponsors.map(sponsor => (
          <SponsorCard 
            key={sponsor.slug || sponsor.name} 
            sponsor={sponsor} 
            tier={tier}
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
        title="PLATINUM"
      />

      <TierSection
        tier="Gold"
        sponsors={goldSponsors}
        title="GOLD"
      />

      <TierSection
        tier="Silver"
        sponsors={silverSponsors}
        title="SILVER"
      />

      <TierSection
        tier="Bronze"
        sponsors={bronzeSponsors}
        title="BRONZE"
      />

      <TierSection
        tier="Colaborador"
        sponsors={collaborators}
        title="PARTNERS & COLLABORATORS"
      />
    </div>
  );
}