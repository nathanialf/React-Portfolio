import Head from 'next/head';

import { Tooltip } from 'react-tooltip'
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

import styles from '../styles/Home.module.css';

import 'react-tooltip/dist/react-tooltip.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nathanial Fine</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#9fc2c2"/>
      </Head>

      {/* Copyright and Tooltip. 
            Used at the bottom of main
            This is how I learned about react comments, they suck. */}
      <a data-tooltip-id="copyright-tooltip" data-tooltip-content="Background shot on Fujifilm XT-5" className={styles.copyright}>
        &copy; 2024 Nathanial Fine
      </a>

      <main>
        <div className={styles.card}>
          <div className={styles.name}>
            <span>Nathanial Fine</span>
            <picture>
              <source
                srcset="/images/darkmode/defnf.png"
                media="(prefers-color-scheme: dark)"
              />
              <img
                src="/images/lightmode/defnf.png"
                height={80}
                width={80}
              />
            </picture>
          </div>

          <span className={styles.title}>
            <IconMapPin stroke={2} width="1em" height="1em"/>
            San Francisco
          </span>
          <span className={styles.title}>
            <IconBrandAmazon stroke={2} width="1em" height="1em"/>
            SysDev Engineer II @ Amazon
          </span>

          <a href="mailto:nathanial+website@defnf.com">
            <span className={styles.link} id="email">
              <IconMail stroke={2} width="1em" height="1em"/>
              nathanial@defnf.com
            </span>
          </a>
          <a href="https://www.linkedin.com/in/nathanial-fine/">
            <span className={styles.link} id="linkedin">
              <IconBrandLinkedin stroke={2.25} width="1em" height="1em"/>
              nathanial-fine
            </span>
          </a>
          <a href="https://github.com/nathanialf">
            <span className={styles.link} id="github">
              <IconBrandGithub stroke={2} width="1em" height="1em"/>
              nathanialf
            </span>
          </a>
          <a href="https://www.threads.net/@nathanialfine">
            <span className={styles.link} id="threads">
              <IconBrandThreads stroke={2} width="1em" height="1em"/>
              nathanialfine
            </span>
          </a>
          <a href="https://www.instagram.com/nathanialfine">
            <span className={styles.link} id="instagram">
              <IconBrandInstagram stroke={2} width="1em" height="1em"/>
              nathanialfine
            </span>
          </a>
          <a href="https://steamcommunity.com/id/nathanialf/">
            <span className={styles.link} id="steam">
              <IconBrandSteam stroke={2} width="1em" height="1em"/>
              nathanialf
            </span>
          </a>
          <span className={styles.link} id="discord">
            <IconBrandDiscord stroke={2} width="1em" height="1em"/>
            nathanialf
          </span>
          <a href="https://letterboxd.com/nathanialfine/">
            <span className={styles.link} id="letterboxd">
              <IconBrandLetterboxd stroke={2} width="1em" height="1em"/>
              nathanialfine
            </span>
          </a>
        
          <p>Upgrading to Husband in 2025.</p>
          <p>Enthusiast.</p>
        </div>

        
        <Tooltip id="copyright-tooltip" />
      </main>
    </div>
  );
}
