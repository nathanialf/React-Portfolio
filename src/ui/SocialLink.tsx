import Link from 'next/link'
import styles from '../styles/SocialLink.module.css';

const SocialLink = (props) => {
  /*
    props.href = link target
    props.icon = tabler component
    props.text = text in the "button"
    props.encoded = unused, to be used as a flag to encode links server side and decode client side
  */

  if (props !== undefined) {}

  return (
    <Link href={props.href} className={styles.link}>
      {props.icon}
      {props.text}
  	</Link>
  )
}

export default SocialLink;
