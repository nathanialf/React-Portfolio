import { readdir } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import styles from '../../styles/PrivacyPolicy.module.css';

async function getAllPolicies() {
  try {
    const policiesDir = join(process.cwd(), 'src', 'data', 'privacy-policies');
    const files = await readdir(policiesDir);
    
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace('.md', '');
        const name = slug.charAt(0).toUpperCase() + slug.slice(1);
        return { slug, name };
      });
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Privacy Policies',
  description: 'Privacy policies for all applications developed by defnf.com',
};

export default async function PrivacyPoliciesPage() {
  const policies = await getAllPolicies();
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policies</h1>
          <p className={styles.subtitle}>Privacy policies for all applications</p>
        </header>
        
        <main className={styles.policyList}>
          {policies.length === 0 ? (
            <p className={styles.noPolicies}>No privacy policies available yet.</p>
          ) : (
            <div className={styles.policyGrid}>
              {policies.map(({ slug, name }) => (
                <Link 
                  key={slug}
                  href={`/privacy-policy/${slug}`}
                  className={styles.policyCard}
                >
                  <h2 className={styles.policyName}>{name}</h2>
                  <p className={styles.policyDescription}>
                    View privacy policy for {name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}