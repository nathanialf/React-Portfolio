"use client";

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import styles from '../styles/Copyright.module.css';

export default function Copyright() {
  {/* 
    Copyright and Tooltip. 
    Used at the bottom of pages
    Hover over the copyright to display camera information
  */}
  return (
    <div>
      <a data-tooltip-id="copyright-tooltip" data-tooltip-content="Background shot on Fujifilm XT by Nathanial Fine" className={styles.copyright}>
        &copy; 2024 Nathanial Fine
      </a>

      <Tooltip id="copyright-tooltip" />
    </div>
  )
}