'use client';

import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import styles from '../styles/CompanyBadge.module.css';

interface CompanyBadgeProps {
  companyName: string;
  startDate: string;
  endDate: string;
  icon: React.ReactNode;
  tooltipId: string;
}

const CompanyBadge: React.FC<CompanyBadgeProps> = ({ companyName, startDate, endDate, icon, tooltipId }) => {
  const tooltipContent = `${companyName}, ${startDate} - ${endDate}`;
  
  return (
    <>
      <div 
        data-tooltip-id={tooltipId} 
        data-tooltip-content={tooltipContent}
        data-tooltip-place="bottom"
        className={styles.badge}
      >
        {icon}
      </div>
      <Tooltip id={tooltipId} />
    </>
  );
};

export default CompanyBadge;