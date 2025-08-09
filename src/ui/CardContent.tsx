import React from 'react';
import SocialLink from './SocialLink';
import DEFNFImage from './DEFNFImage';
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLetterboxd,
  IconBrandLinkedin,
  IconBrandSteam,
  IconBrandThreads,
  IconBrandBluesky,
  IconDeviceLaptop,
  IconHeart,
  IconMail,
  IconMapPin
} from '@tabler/icons-react';
import styles from '../styles/CardContent.module.css';

const CardContent: React.FC = () => {
  return (
    <>
      <div className={styles.name}>
        Nathanial Fine
        <DEFNFImage />
      </div>

      <span className={styles.title}>
        <IconMapPin stroke={2} width='1em' height='1em' />
        San Francisco Bay Area
      </span>
      <span className={styles.title}>
        <IconDeviceLaptop stroke={2} width='1em' height='1em' />
        DevOps | Site Reliability Engineer
      </span>
      <span className={styles.title}>
        <IconHeart stroke={2} width='1em' height='1em' />
        Husband
      </span>

      <br></br>

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
        href='https://bsky.app/profile/defnf.com'
        icon={<IconBrandBluesky stroke={2} width='1em' height='1em' />}
        text='defnf.com'
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
        href='' // Discord link was empty
        icon={<IconBrandDiscord stroke={2} width='1em' height='1em' />}
        text='nathanialf'
      />
      <SocialLink
        encoded
        href='https://letterboxd.com/nathanialfine/'
        icon={<IconBrandLetterboxd stroke={2} width='1em' height='1em' />}
        text='nathanialfine'
      />
    </>
  );
};

export default CardContent;
