import { Metadata } from 'next'
import { promises as fs } from 'fs';
import DEFNFImage from '../../ui/DEFNFImage';
import Image from 'next/image'

import styles from '../../styles/Photography.module.css';

export const metadata: Metadata = {
  title: 'Photography'
}


export default async function Photography() {
  const file = await fs.readFile(process.cwd() + '/src/app/photography/photos.json', 'utf-8');
  const photos = JSON.parse(file);

  return (
    <div className={styles.container}>
      <span className={styles.header}><DEFNFImage /> Photography</span>
      <span className={styles.sub_header}>I am not a photographer</span>
      <span className={styles.sub_sub_header}>Photographed by Nathanial Fine</span>
      <div className={styles.flex_container}>
        {photos.map(function(data) {
          return (
            !data.hidden &&
            <div className={styles.image_container}>
              <Image
                src={data.source}
                width={0}
                height={0}
                layout='responsive'
                alt={data.title}
                style={{ width: '100%', height: 'auto' }}
              />
              <div className={styles.image_details}>
                <span className={styles.image_details_text}>{data.camera} {data.shutter && (<>&ensp;&#183;&ensp;{data.shutter}</>)} &ensp;&#183;&ensp; &fnof;/{data.fstop} &ensp;&#183;&ensp; {data.focal}mm &ensp;&#183;&ensp; ISO{data.iso}</span>
                <span className={styles.image_details_text}>{data.year} &ensp;&#183;&ensp; {data.title}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}