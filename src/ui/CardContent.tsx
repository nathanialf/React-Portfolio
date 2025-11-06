import React from 'react';
import Image from 'next/image';
import LinkBadge from './LinkBadge';
import CompanyBadge from './CompanyBadge';
import ProjectsSection from './ProjectsSection';
import DEFNFImage from './DEFNFImage';
import {
  IconBrandLinkedin,
  IconDeviceLaptop,
  IconHeart,
  IconMail,
  IconMapPin
} from '@tabler/icons-react';
import styles from '../styles/CardContent.module.css';

interface CardContentProps {
  onProjectSelect?: (projectId: string) => void;
}

const CardContent: React.FC<CardContentProps> = ({ onProjectSelect }) => {
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

      {/* <div className={styles.bio}>
        System Development Engineer with expertise in cloud infrastructure and games industry services. 3+ years enabling game developers to build more productively through Amazon&apos;s platform services. Proven track record in operational planning, team mentorship, and leading high-impact infrastructure initiatives.
      </div> */}

      {onProjectSelect && <ProjectsSection onProjectSelect={onProjectSelect} />}

      <div className={styles.previously}>Previously</div>

      <CompanyBadge
        companyName="Amazon.com"
        startDate="2023"
        endDate="2025"
        icon={<Image src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" width={24} height={24} style={{objectFit: 'contain'}} />}
        tooltipId="amazon-tooltip"
      />
      <CompanyBadge
        companyName="AWS"
        startDate="2020"
        endDate="2023"
        icon={<Image src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" width={24} height={24} style={{objectFit: 'contain'}} />}
        tooltipId="aws-tooltip"
      />
      <CompanyBadge
        companyName="Apple"
        startDate="2018"
        endDate="2020"
        icon={<Image src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" width={20} height={20} style={{objectFit: 'contain'}} />}
        tooltipId="apple-tooltip"
      />
      <CompanyBadge
        companyName="Infosys"
        startDate="2017"
        endDate="2020"
        icon={<Image src="https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" alt="Infosys" width={24} height={24} style={{objectFit: 'contain'}} />}
        tooltipId="infosys-tooltip"
      />

      <div className={styles.previously}>Contact</div>

      <div className={styles.badgeContainer}>
        <LinkBadge
          href='mailto:nathanial+website@defnf.com'
          icon={<IconMail stroke={2} width='1em' height='1em' />}
          text='nathanial@defnf.com'
        />
        <LinkBadge
          href='https://www.linkedin.com/in/nathanial-fine/'
          icon={<IconBrandLinkedin stroke={2.25} width='1em' height='1em' />}
          text='nathanial-fine'
        />
      </div>
    </>
  );
};

export default CardContent;
