import styles from '../styles/Copyright.module.css';

interface CopyrightProps {
  fixed?: boolean;
}

export default function Copyright({ fixed }: CopyrightProps) {
  return (
    <div className={fixed ? styles.fixed : styles.copyright}>
      &copy; {new Date().getFullYear()} Nathanial Fine
    </div>
  )
}