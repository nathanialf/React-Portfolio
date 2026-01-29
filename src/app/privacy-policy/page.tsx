import { readdir } from 'fs/promises';
import { join } from 'path';
import VerticalSidebar from '../../ui/VerticalSidebar';
import Copyright from '../../ui/Copyright';
import PrivacyPolicyHeader from '../../ui/PrivacyPolicyHeader';
import PrivacyPolicyList from '../../ui/PrivacyPolicyList';
import styles from '../../styles/PrivacyPolicy.module.css';

// Custom display names for policies (slug -> display name)
const policyNames: Record<string, string> = {
  'myseatmap': 'MySeatMap',
};

async function getAllPolicies() {
  try {
    const policiesDir = join(process.cwd(), 'src', 'data', 'privacy-policies');
    const files = await readdir(policiesDir);

    return files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace('.md', '');
        const name = policyNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
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
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <PrivacyPolicyHeader />

          <main className={styles.policyList}>
            <PrivacyPolicyList policies={policies} />
          </main>
          <Copyright />
        </div>
      </div>
    </div>
  );
}