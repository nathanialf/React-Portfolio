import styles from '../styles/Copyright.module.css';

export default function Copyright() {
  return (
    <div>
      <span className={styles.copyright}>
        &copy; {new Date().getFullYear()} Nathanial Fine
      </span>
    </div>
  )
}