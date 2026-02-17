'use client';

import ToolPageLayout from '../../ui/ToolPageLayout';
import styles from '../../styles/Games.module.css';
import blogStyles from '../../styles/Blog.module.css';

const games = [
  { name: 'Destiny', platforms: ['PS4', 'Xbox One', 'PS3', 'Xbox 360'], year: 2014, dev: 'Bungie', publisher: 'Activision' },
  { name: 'Halo: Reach', platforms: ['Xbox 360'], year: 2010, dev: 'Bungie', publisher: 'Microsoft' },
  { name: 'Hyper Light Drifter', platforms: ['PC', 'PS4', 'Switch'], year: 2016, dev: 'Heart Machine', publisher: 'Heart Machine' },
  { name: 'The Legend of Zelda: Majora\'s Mask', platforms: ['N64'], year: 2000, dev: 'Nintendo EAD', publisher: 'Nintendo' },
  { name: 'FEZ', platforms: ['PC', 'Xbox 360', 'PS4'], year: 2012, dev: 'Polytron', publisher: 'Trapdoor' },
  { name: 'Death Stranding', platforms: ['PS4', 'PC', 'PS5'], year: 2019, dev: 'Kojima Productions', publisher: 'Sony' },
  { name: 'The Last Guardian', platforms: ['PS4'], year: 2016, dev: 'genDESIGN / SIE Japan', publisher: 'Sony' },
  { name: 'Halo 3: ODST', platforms: ['Xbox 360'], year: 2009, dev: 'Bungie', publisher: 'Microsoft' },
  { name: 'Destiny 2', platforms: ['PC', 'PS4', 'Xbox One', 'PS5'], year: 2017, dev: 'Bungie', publisher: 'Bungie' },
  { name: 'Star Wars - Jedi Knight: Jedi Academy', platforms: ['PC', 'Xbox', 'PS4', 'Switch'], year: 2003, dev: 'Raven Software', publisher: 'LucasArts' },
  { name: 'Metal Gear Solid', platforms: ['PS1', 'PC'], year: 1998, dev: 'Konami', publisher: 'Konami' },
  { name: 'Shadow of the Colossus', platforms: ['PS2', 'PS3', 'PS4'], year: 2005, dev: 'Team Ico', publisher: 'Sony' },
  { name: 'Halo 2 [Anniversary]', platforms: ['Xbox', 'PC'], year: 2004, dev: 'Bungie', publisher: 'Microsoft' },
  { name: 'Banjo-Kazooie', platforms: ['N64', 'Xbox 360'], year: 1998, dev: 'Rare', publisher: 'Nintendo' },
  { name: 'The Legend of Zelda: Tears of the Kingdom', platforms: ['Switch'], year: 2023, dev: 'Nintendo EPD', publisher: 'Nintendo' },
  { name: 'Grim Fandango', platforms: ['PC', 'PS4', 'Switch'], year: 1998, dev: 'LucasArts', publisher: 'LucasArts' },
  { name: 'Signalis', platforms: ['PC', 'PS4', 'Switch', 'Xbox One'], year: 2022, dev: 'rose-engine', publisher: 'Humble Games' },
  { name: 'Pokemon Legends: Arceus', platforms: ['Switch'], year: 2022, dev: 'Game Freak', publisher: 'Nintendo' },
  { name: 'Donkey Kong 64', platforms: ['N64'], year: 1999, dev: 'Rare', publisher: 'Nintendo' },
  { name: 'NieR Replicant ver.1.22474487139...', platforms: ['PS4', 'PC', 'Xbox One'], year: 2021, dev: 'Toylogic', publisher: 'Square Enix' },
  { name: 'ICO', platforms: ['PS2', 'PS3'], year: 2001, dev: 'Team Ico', publisher: 'Sony' },
  { name: 'Final Fantasy VI', platforms: ['SNES', 'GBA', 'PC'], year: 1994, dev: 'Square', publisher: 'Square' },
  { name: 'Marathon 2 Durandal', platforms: ['Mac', 'PC', 'Xbox 360'], year: 1995, dev: 'Bungie', publisher: 'Bungie' },
];

export default function GamesPage() {
  return (
    <ToolPageLayout
      title="Favorite Video Games"
      subtitle="Personal Catalogue"
      version="Ranked Jan 2026"
      containerClassName={styles.container}
    >
      <ol className={styles.list}>
        {games.map((game, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.rank}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.itemContent}>
              <div className={styles.nameRow}>
                <span className={styles.name}>{game.name}</span>
                <span className={styles.year}>{game.year}</span>
              </div>
              <div className={styles.meta}>
                {game.platforms.map((p) => (
                  <span key={p} className={blogStyles.tag}>{p}</span>
                ))}
              </div>
            </div>
            <div className={styles.credits}>
              <span className={styles.dev}>
                <span className={styles.devLabel}>Dev</span> {game.dev}
              </span>
              {game.dev !== game.publisher && (
                <span className={styles.dev}>
                  <span className={styles.devLabel}>Pub</span> {game.publisher}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </ToolPageLayout>
  );
}
