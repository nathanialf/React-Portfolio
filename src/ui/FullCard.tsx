import React from 'react';
import CardContent from './CardContent';
import styles from '../styles/FullCard.module.css';

const FullCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <CardContent />
    </div>
  );
};

export default FullCard;
