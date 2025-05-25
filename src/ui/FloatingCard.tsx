import React from 'react';
import CardContent from './CardContent';
import styles from '../styles/FloatingCard.module.css';

const FloatingCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <CardContent />
    </div>
  );
};

export default FloatingCard;
