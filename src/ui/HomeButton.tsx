import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

import styles from '../styles/HomeButton.module.css';
 
export default function HomeButton() {
  return (
    <Link className={styles.home_button} href='/'>
      <IconArrowLeft stroke={2}/><span>Home</span>
    </Link>
  )
}