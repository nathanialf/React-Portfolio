'use client';

import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import styles from '../styles/EmployerStub.module.css';

interface EmployerStubProps {
  companyName: string;
  startDate: string;
  endDate: string;
  icon: React.ReactNode;
  tooltipId: string;
}

const EmployerStub: React.FC<EmployerStubProps> = ({
  companyName,
  startDate,
  endDate,
  icon,
  tooltipId
}) => {
  const tooltipContent = `${companyName}, ${startDate} - ${endDate}`;

  return (
    <div>
      <div
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipContent}
        className={styles.stub}
      >
        {icon}
      </div>
      <Tooltip id={tooltipId} />
    </div>
  );
};

export default EmployerStub;