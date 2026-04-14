import ToolPageLayout from '../../ui/ToolPageLayout';
import styles from '../../styles/Games.module.css';
import blogStyles from '../../styles/Blog.module.css';
import freeStyles from '../../styles/Free.module.css';

type GameStatus = 'available' | 'exhausted' | 'expired';

interface Game {
  name: string;
  platform: string;
  storeUrl?: string;
  notes?: string;
  status?: GameStatus;
}

const games: Game[] = [
  { name: 'Age of Wonders III', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/226840/Age_of_Wonders_III/' },
  { name: 'Armello', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/290340/Armello/' },
  { name: 'Atlas Fallen: Reign of Sand', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1230530/Atlas_Fallen_Reign_Of_Sand/' },
  { name: 'Bloodstained: Ritual of the Night', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/692850/Bloodstained_Ritual_of_the_Night/' },
  { name: 'Broken Age', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/232790/Broken_Age/' },
  { name: 'Broken Age', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/232790/Broken_Age/' },
  { name: 'Brutal Legend', platform: 'Steam', storeUrl: 'https://store.steampowered.com/agecheck/app/225260/' },
  { name: 'Canabalt', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/358960/Canabalt/' },
  { name: 'Celeste', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/504230/Celeste/' },
  { name: 'Cortex Command', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/209670/Cortex_Command/' },
  { name: 'Crime Boss: Rockay City', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/2933080/Crime_Boss_Rockay_City/' },
  { name: 'Darkest Dungeon: The Shieldbreaker DLC', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/702540/Darkest_Dungeon_The_Shieldbreaker/' },
  { name: 'Dustforce DX', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/65300/Dustforce_DX/' },
  { name: 'FRAMED Collection', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/322450/FRAMED_Collection/' },
  { name: 'Garden Life', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1915380/Garden_Life_A_Cozy_Simulator/', notes: 'Keys exhausted', status: 'exhausted' },
  { name: 'I Am Fish', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1472560/I_Am_Fish/' },
  { name: 'KarmaZoo', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1661630/KarmaZoo/', notes: 'Keys exhausted', status: 'exhausted' },
  { name: 'Killing Floor 2 Digital Deluxe Edition', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/232090/Killing_Floor_2/' },
  { name: 'Kiln', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/631780/', notes: 'Double Fine Amnesia Fortnight prototype' },
  { name: 'Kiln', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/631780/', notes: 'Double Fine Amnesia Fortnight prototype' },
  { name: 'Kingdom Classic', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/368230/Kingdom_Classic/', notes: 'May be free on Steam' },
  { name: "Marvel's Guardians of the Galaxy", platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1088850/Marvels_Guardians_of_the_Galaxy/' },
  { name: 'Massive Chalice', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/246110/MASSIVE_CHALICE/' },
  { name: 'Moonstone Island', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1658150/Moonstone_Island/', notes: 'Keys exhausted', status: 'exhausted' },
  { name: 'Music Maker EMD Edition', platform: 'Magix' },
  { name: 'Persona 4 Golden', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1113000/Persona_4_Golden/' },
  { name: 'Psychonauts in the Rhombus of Ruin', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/788690/Psychonauts_in_the_Rhombus_of_Ruin/' },
  { name: 'Regular Human Basketball', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/661940/Regular_Human_Basketball/' },
  { name: 'Remnant II', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1282100/REMNANT_II/', notes: 'Key expired', status: 'expired' },
  { name: 'Risk of Rain 2', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/632360/Risk_of_Rain_2/' },
  { name: 'Samorost 2', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/40720/Samorost_2/' },
  { name: 'SEGA Bass Fishing', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/71240/SEGA_Bass_Fishing/', notes: 'Delisted — still redeemable' },
  { name: 'Sigma Theory: Global Cold War', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/716640/Sigma_Theory_Global_Cold_War/' },
  { name: 'Sonic Adventure 2', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/213610/Sonic_Adventure_2/' },
  { name: 'Star Wars Bounty Hunter', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/2419090/STAR_WARS_Bounty_Hunter/' },
  { name: 'Starfinder: Pact Worlds Campaign Setting', platform: 'Paizo' },
  { name: 'Super Time Force Ultra', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/250700/Super_Time_Force_Ultra/' },
  { name: 'The Haunted Island: A Frog Detective Game', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/963000/Frog_Detective_1_The_Haunted_Island/' },
  { name: 'The Jackbox Party Pack', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/331670/The_Jackbox_Party_Pack/' },
  { name: 'The Jackbox Party Pack 2', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/397460/The_Jackbox_Party_Pack_2/' },
  { name: 'The Jackbox Party Pack 3', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/434170/The_Jackbox_Party_Pack_3/' },
  { name: 'The Ship: Complete Pack', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/2400/The_Ship_Murder_Party/' },
  { name: 'Titan Quest Anniversary Edition', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/475150/Titan_Quest_Anniversary_Edition/' },
  { name: 'ToeJam & Earl: Back in the Groove!', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/516110/ToeJam__Earl_Back_in_the_Groove/' },
  { name: 'Warhammer: Vermintide 2', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/552500/Warhammer_Vermintide_2/' },
  { name: 'X: Beyond the Frontier, X-Tension, X2: The Threat & X3: Reunion', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/2840/X_Beyond_the_Frontier/' },
  { name: 'Yakuza 4 Remastered', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1105500/Yakuza_4_Remastered/' },
  { name: 'Yakuza: Like a Dragon', platform: 'Steam', storeUrl: 'https://store.steampowered.com/app/1235140/Yakuza_Like_a_Dragon/' },
];

export default function FreePage() {
  return (
    <ToolPageLayout
      title="Extra Games and Software"
      subtitle="Available if You're a Friend"
      containerClassName={styles.container}
    >
      <p className={freeStyles.notice}>
        Please DM me the games you want a code for on Discord. I reserve the right to ignore your requests for any reason I want.
      </p>
      <ol className={styles.list}>
        {games.map((game, i) => (
          <li
            key={i}
            className={`${styles.item} ${game.status && game.status !== 'available' ? freeStyles.unavailable : ''}`}
          >
            <div className={styles.itemContent}>
              <div className={styles.nameRow}>
                {game.storeUrl ? (
                  <a
                    href={game.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.name}
                    style={{ textDecoration: 'none', borderBottom: '1px solid #262626' }}
                  >
                    {game.name}
                  </a>
                ) : (
                  <span className={styles.name}>{game.name}</span>
                )}
              </div>
              {game.notes && (
                <div className={freeStyles.noteText}>{game.notes}</div>
              )}
            </div>
            <div className={styles.meta} style={{ flexShrink: 0 }}>
              <span className={blogStyles.tag}>{game.platform}</span>
            </div>
          </li>
        ))}
      </ol>
    </ToolPageLayout>
  );
}
