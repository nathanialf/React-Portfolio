import React from 'react';
import CardContent from './CardContent';
import styles from '../styles/FloatingCard.module.css';

const FloatingCard: React.FC = () => { // Removed props and interface
  return (
    <div className={styles.card}>
      <CardContent /> {/* Removed props */}
    </div>
  );
};

export default FloatingCard;
