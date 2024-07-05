import Link from 'next/link'
import styles from '../styles/UnderscoreLink.module.css';

const UnderscoreLink = (props) => {
  /*
    props.href = link target
    props.text = text in the "button"
    props.encoded = unused, to be used as a flag to encode links server side and decode client side
  */

  if (props !== undefined) {}

  return (
    <Link href={props.href} className={styles.link}>
      {props.text}
  	</Link>
  )
}

export default UnderscoreLink;