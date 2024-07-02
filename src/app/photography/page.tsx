import { Metadata } from 'next'
import Image from 'next/image';

import styles from '../../styles/Photography.module.css';

export const metadata: Metadata = {
  title: 'Photography'
}

const Photography = () => {

  return (
    <div className={styles.container}>
      <span className={styles.header}>DEFNF Photography</span>
      <span className={styles.subheader}>I am not a photographer</span>
      <span className={styles.subsubheader}>Photographed by Nathanial Fine</span>

    </div>
  )
}

export default Photography;