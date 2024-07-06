import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

import styles from '../styles/BackButton.module.css';
 
export default function BackButton() {
  return (
    <Link className={styles.back_button} href='/'>
      <IconArrowLeft stroke={2} /><span>Back</span>
    </Link>
  )
}