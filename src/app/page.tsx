import Image from 'next/image';
import SocialLink from '../ui/SocialLink';
import UnderscoreLink from '../ui/UnderscoreLink';
import DEFNFImage from '../ui/DEFNFImage';
import Copyright from '../ui/Copyright';
import {
  IconBrandAmazon,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLetterboxd,
  IconBrandLinkedin,
  IconBrandSteam,
  IconBrandThreads,
  IconBrandTwitch,
  IconMail,
  IconMapPin
} from '@tabler/icons-react';

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
      <div className={styles.card}>

        <div className={styles.name}>
          Nathanial Fine
          <DEFNFImage />
        </div>

        <span className={styles.title}>
          <IconMapPin stroke={2} width='1em' height='1em' />
          San Francisco
        </span>
        <span className={styles.title}>
          <IconBrandAmazon stroke={2} width='1em' height='1em' />
          SysDev Engineer II @ Amazon
        </span>


        <SocialLink
          encoded
          href='mailto:nathanial+website@defnf.com'
          icon={<IconMail stroke={2} width='1em' height='1em' />}
          text='nathanial@defnf.com'
        />
        <SocialLink
          encoded
          href='https://www.linkedin.com/in/nathanial-fine/'
          icon={<IconBrandLinkedin stroke={2.25} width='1em' height='1em' />}
          text='nathanial-fine'
        />
        <SocialLink
          encoded
          href='https://github.com/nathanialf'
          icon={<IconBrandGithub stroke={2} width='1em' height='1em' />}
          text='nathanialf'
        />
        <SocialLink
          encoded
          href='https://www.threads.net/@nathanialfine'
          icon={<IconBrandThreads stroke={2} width='1em' height='1em' />}
          text='nathanialfine'
        />
        <SocialLink
          encoded
          href='https://www.instagram.com/nathanialfine'
          icon={<IconBrandInstagram stroke={2} width='1em' height='1em' />}
          text='nathanialfine'
        />
        <SocialLink
          encoded
          href='https://steamcommunity.com/id/nathanialf/'
          icon={<IconBrandSteam stroke={2} width='1em' height='1em' />}
          text='nathanialf'
        />
        <SocialLink
          encoded
          href=''
          icon={<IconBrandDiscord stroke={2} width='1em' height='1em' />}
          text='nathanialf'
        />
        <SocialLink
          encoded
          href='https://www.twitch.tv/nathanialfine'
          icon={<IconBrandTwitch stroke={2} width='1em' height='1em' />}
          text='nathanialfine'
        />
        <SocialLink
          encoded
          href='https://letterboxd.com/nathanialfine/'
          icon={<IconBrandLetterboxd stroke={2} width='1em' height='1em' />}
          text='nathanialfine'
        />

        <p>Upgrading to Husband in 2025.</p>
        <p>Enthusiast.&nbsp;"
          <UnderscoreLink
            encoded
            href='/photography/'
            text='Photographer'
          />."
        </p>
      </div>

      <Copyright />
    </div>
  );
}
