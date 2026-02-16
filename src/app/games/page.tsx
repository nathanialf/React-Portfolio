'use client';

import VerticalSidebar from '../../ui/VerticalSidebar';
import Copyright from '../../ui/Copyright';
import ScrambleText from '../../ui/ScrambleText';
import styles from '../../styles/Games.module.css';

const games = [
  'Destiny',
  'Halo: Reach',
  'Hyper Light Drifter',
  'The Legend of Zelda: Majora\'s Mask',
  'FEZ',
  'Death Stranding',
  'The Last Guardian',
  'Halo 3: ODST',
  'Destiny 2',
  'Star Wars - Jedi Knight: Jedi Academy',
  'Metal Gear Solid',
  'Shadow of the Colossus',
  'Halo 2 [Anniversary]',
  'Banjo-Kazooie',
  'The Legend of Zelda: Tears of the Kingdom',
  'Grim Fandango',
  'Signalis',
  'Pokemon Legends: Arceus',
  'Donkey Kong 64',
  'NieR Replicant ver.1.22474487139...',
  'ICO',
  'Final Fantasy VI',
  'Marathon 2 Durandal',
];

export default function GamesPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>
                <ScrambleText duration={600}>Favorite Video Games</ScrambleText>
              </h1>
              <p className={styles.subtitle}>
                <ScrambleText delay={100} duration={500}>Ranked</ScrambleText>
              </p>
            </div>
          </header>
          <ol className={styles.list}>
            {games.map((game, i) => (
              <li key={i} className={styles.item}>
                <span className={styles.rank}>{i + 1}.</span>
                <span className={styles.name}>{game}</span>
              </li>
            ))}
          </ol>
          <div className={styles.mobileFooter}>
            <Copyright />
          </div>
        </div>
      </div>
      <div className={styles.desktopFooter}>
        <Copyright fixed />
      </div>
    </div>
  );
}
