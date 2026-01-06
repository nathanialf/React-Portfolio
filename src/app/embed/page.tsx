import Image from 'next/image';
import FullCard from '../../ui/FullCard';

import styles from '../../styles/Homepage.module.css';

export default function Embed() {
  return (
    <div className={styles.container}>
      <Image
        src='/images/darkmode/background.jpg'
        alt='Background Photograph'
        quality={100}
        fill
        sizes='100vw'
        style={{ objectFit: 'cover' }}
        priority
      />
      <FullCard />
    </div>
  );
}
