import React from 'react';
import SocialLink from './SocialLink';
import EmailSocialLink from './EmailSocialLink';
import CompanyBadge from './CompanyBadge';
import DEFNFImage from './DEFNFImage';
import {
  IconBrandAmazon,
  IconBrandAws,
  IconBrandBluesky,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLetterboxd,
  IconBrandLinkedin,
  IconBrandSteam,
  IconBrandThreads,
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
        DevOps | TPM
      </span>
      <span className={styles.title}>
        <IconHeart stroke={2} width='1em' height='1em' />
        Husband
      </span>

      <br></br>

      <EmailSocialLink
        href='mailto:nathanial+website@defnf.com'
        icon={<IconMail stroke={2} width='1em' height='1em' />}
        text='nathanial@defnf.com'
        email='nathanial@defnf.com'
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

      <div className={styles.previously}>Previously</div>

      <CompanyBadge
        companyName="Amazon.com"
        startDate="2023"
        endDate="2025"
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" style={{width: '24px', height: '24px', objectFit: 'contain'}} />}
        tooltipId="amazon-tooltip"
      />
      <CompanyBadge
        companyName="AWS"
        startDate="2020"
        endDate="2023"
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" style={{width: '24px', height: '24px', objectFit: 'contain'}} />}
        tooltipId="aws-tooltip"
      />
      <CompanyBadge
        companyName="Infosys"
        startDate="2017"
        endDate="2020"
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" alt="Infosys" style={{width: '24px', height: '24px', objectFit: 'contain'}} />}
        tooltipId="infosys-tooltip"
      />
    </>
  );
};

export default CardContent;
