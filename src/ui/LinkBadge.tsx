'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconCopy } from '@tabler/icons-react';
import styles from '../styles/LinkBadge.module.css';

interface LinkBadgeProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  copyText?: string; // Optional - if provided, shows copy button
  encoded?: boolean; // For future server-side encoding
}

const LinkBadge: React.FC<LinkBadgeProps> = ({ href, icon, text, copyText }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = async () => {
    if (copyText && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(copyText);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const isClipboardAvailable = isClient && navigator.clipboard && copyText;

  // If no copy functionality, render as direct Link like ProjectBadge
  if (!isClipboardAvailable) {
    return (
      <Link href={href} className={styles.badge}>
        {icon}
        {text}
      </Link>
    );
  }

  // If copy functionality needed, use container pattern
  return (
    <div className={styles.badge}>
      <Link href={href} className={styles.link}>
        {icon}
        {text}
      </Link>
      <span className={styles.divider}></span>
      <button 
        onClick={copyToClipboard}
        className={styles.copyButton}
        title={`Copy ${copyText} to clipboard`}
        type="button"
      >
        <IconCopy stroke={2} width='1em' height='1em' />
      </button>
    </div>
  );
};

export default LinkBadge;