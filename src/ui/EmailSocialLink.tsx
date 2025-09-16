'use client';

import Link from 'next/link'
import { IconCopy } from '@tabler/icons-react';
import styles from '../styles/EmailSocialLink.module.css';

interface EmailSocialLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  email: string;
}

const EmailSocialLink: React.FC<EmailSocialLinkProps> = ({ href, icon, text, email }) => {
  const copyToClipboard = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    }
  };

  const isClipboardAvailable = typeof navigator !== 'undefined' && navigator.clipboard;

  return (
    <div className={styles.container}>
      <Link href={href} className={styles.emailLink}>
        {icon}
        {text}
      </Link>
      {isClipboardAvailable && (
        <>
          <span className={styles.divider}></span>
          <button 
            onClick={copyToClipboard}
            className={styles.copyButton}
            title="Copy email to clipboard"
            type="button"
          >
            <IconCopy stroke={2} width='1em' height='1em' />
          </button>
        </>
      )}
    </div>
  );
};

export default EmailSocialLink;