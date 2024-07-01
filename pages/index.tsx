import Head from 'next/head';
import React from 'react';
import SocialLink from '../components/SocialLink';
import DEFNFImage from '../components/DEFNFImage';
import { 
  IconBrandAmazon,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandInstagram, 
  IconBrandLetterboxd,
  IconBrandLinkedin,
  IconBrandSteam,
  IconBrandThreads,
  IconMail,
  IconMapPin
} from '@tabler/icons-react';

import styles from '../styles/Homepage.module.css';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function Homepage () {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nathanial Fine</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#9fc2c2"/>
      </Head>

      {/* 
        Copyright and Tooltip. 
        Used at the bottom of main
        Hover over the copyright to display camera information
      */}

      <a data-tooltip-id="copyright-tooltip" data-tooltip-content="Background shot on Fujifilm XT by Nathanial Fine" className={styles.copyright}>
        &copy; 2024 Nathanial Fine
      </a>

      <main>
        <div className={styles.card}>

          <div className={styles.name}>
            Nathanial Fine
            <DEFNFImage />
          </div>

          <span className={styles.title}>
            <IconMapPin stroke={2} width="1em" height="1em"/>
            San Francisco
          </span>
          <span className={styles.title}>
            <IconBrandAmazon stroke={2} width="1em" height="1em"/>
            SysDev Engineer II @ Amazon
          </span>


          <SocialLink 
            encoded
            href="mailto:nathanial+website@defnf.com"
            icon={<IconMail stroke={2} width="1em" height="1em"/>}
            text="nathanial@defnf.com"
          />
          <SocialLink 
            encoded
            href="https://www.linkedin.com/in/nathanial-fine/"
            icon={<IconBrandLinkedin stroke={2.25} width="1em" height="1em"/>}
            text="nathanial-fine"
          />
          <SocialLink 
            encoded
            href="https://github.com/nathanialf"
            icon={<IconBrandGithub stroke={2} width="1em" height="1em"/>}
            text="nathanialf"
          />
          <SocialLink 
            encoded
            href="https://www.threads.net/@nathanialfine"
            icon={<IconBrandThreads stroke={2} width="1em" height="1em"/>}
            text="nathanialfine"
          />
          <SocialLink 
            encoded
            href="https://www.instagram.com/nathanialfine"
            icon={<IconBrandInstagram stroke={2} width="1em" height="1em"/>}
            text="nathanialfine"
          />
          <SocialLink 
            encoded
            href="https://steamcommunity.com/id/nathanialf/"
            icon={<IconBrandSteam stroke={2} width="1em" height="1em"/>}
            text="nathanialf"
          />
          <SocialLink 
            encoded
            href=""
            icon={<IconBrandDiscord stroke={2} width="1em" height="1em"/>}
            text="nathanialf"
          />
          <SocialLink 
            encoded
            href="https://letterboxd.com/nathanialfine/"
            icon={<IconBrandLetterboxd stroke={2} width="1em" height="1em"/>}
            text="nathanialfine"
          />
        
          <p>Upgrading to Husband in 2025.</p>
          <p>Enthusiast.</p>
        </div>

        
        <Tooltip id="copyright-tooltip" />
      </main>
    </div>
  );
}
