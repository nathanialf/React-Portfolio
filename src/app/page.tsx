import Image from 'next/image';
import Copyright from '../ui/Copyright';
import Card from '../ui/Card';

import styles from '../styles/Homepage.module.css';

export default function Homepage() {
  return (
    <div className={styles.container}>
      <picture>
        <source
          srcSet='/images/darkmode/background.jpg'
          media='(prefers-color-scheme: dark)'
        />
        <Image
          src='/images/lightmode/background.jpg'
          alt='Background Photograph'
          quality={100}
          fill
          sizes='100vw'
          style={{ objectFit: 'cover' }}
          priority
        />
      </picture>
      <Card />
      <Copyright />
    </div>
  );
}
