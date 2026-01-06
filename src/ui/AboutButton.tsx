import React from 'react';
import styles from '../styles/AboutButton.module.css';

interface AboutButtonProps {
  onClick: () => void;
  label: string;
}

const AboutButton: React.FC<AboutButtonProps> = ({ onClick, label }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default AboutButton;
