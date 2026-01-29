'use client';

import Link from 'next/link';
import ScrambleText from './ScrambleText';
import styles from '../styles/PrivacyPolicy.module.css';

interface Policy {
  slug: string;
  name: string;
}

interface PrivacyPolicyListProps {
  policies: Policy[];
}

export default function PrivacyPolicyList({ policies }: PrivacyPolicyListProps) {
  if (policies.length === 0) {
    return <p className={styles.noPolicies}>No privacy policies available yet.</p>;
  }

  return (
    <div className={styles.policyGrid}>
      {policies.map(({ slug, name }, index) => (
        <Link
          key={slug}
          href={`/privacy-policy/${slug}`}
          className={styles.policyCard}
        >
          <h2 className={styles.policyName}>
            <ScrambleText delay={index * 100} duration={600}>
              {name}
            </ScrambleText>
          </h2>
          <p className={styles.policyDescription}>
            <ScrambleText delay={index * 100 + 50} duration={500}>
              {`View privacy policy for ${name}`}
            </ScrambleText>
          </p>
        </Link>
      ))}
    </div>
  );
}
