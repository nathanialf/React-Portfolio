import { Metadata } from 'next'
import Image from 'next/image'

import styles from '../../styles/Photography.module.css';

export const metadata: Metadata = {
  title: 'Photography'
}

const photos = [
  {
    source: '/photography/DSCF0126.jpg',
    title: 'Tower at Park Winters',
    year: '2023',
    camera: 'Fujifilm XT-5',
    fstop: '4',
    focal: '80',
    iso: '125',
  },
  {
    source: '/photography/DSCF0128.jpg',
    title: 'Pool Scene at Park Winters',
    year: '2023',
    camera: 'Fujifilm XT-5',
    fstop: '4',
    focal: '22',
    iso: '125',
  },
  {
    source: '/photography/_DSF0196.jpg',
    title: 'Chotto Matte in San Francisco',
    year: '2023',
    camera: 'Fujifilm XT-5',
    fstop: '4',
    focal: '54',
    iso: '3200',
  },
  {
    source: '/photography/_DSF0570.jpg',
    title: 'Pool at Park Winters',
    year: '2023',
    camera: 'Fujifilm XT-5',
    fstop: '8',
    focal: '80',
    iso: '1000',
  },
  {
    source: '/photography/_DSF0714.jpg',
    title: 'Wave Crashing into Rock near Glass Beach',
    year: '2024',
    camera: 'Fujifilm XT-5',
    fstop: '4',
    focal: '80',
    iso: '800',
  },
  {
    source: '/photography/_DSF0716.jpg',
    title: 'Wave near Glass Beach',
    year: '2024',
    camera: 'Fujifilm XT-5',
    fstop: '4',
    focal: '80',
    iso: '800',
  },
  {
    source: '/photography/_DSF0680.jpg',
    title: 'Wave in the Distance near Glass Beach',
    year: '2024',
    camera: 'Fujifilm XT-5',
    fstop: '5',
    focal: '80',
    iso: '800',
  },
  {
    source: '/photography/IMG_0670.jpg',
    title: 'South Park in San Francisco',
    year: '2024',
    camera: 'Apple iPhone 15 Pro Max',
    fstop: '2.8',
    focal: '15',
    iso: '50',
  },
  {
    source: '/photography/IMG_0685.jpg',
    title: 'Asana in San Francisco',
    year: '2024',
    camera: 'Apple iPhone 15 Pro Max',
    fstop: '2.8',
    focal: '15',
    iso: '100',
  },
  {
    source: '/photography/IMG_0676.jpg',
    title: 'MIRA in San Francisco',
    year: '2024',
    camera: 'Apple iPhone 15 Pro Max',
    fstop: '2.8',
    focal: '15',
    iso: '50',
  },
  {
    source: '/photography/IMG_0683.jpg',
    title: '2nd and Clementina in San Francisco',
    year: '2024',
    camera: 'Apple iPhone 15 Pro Max',
    fstop: '1.8',
    focal: '6',
    iso: '80',
  },
  {
    source: '/photography/_DSF0726.jpg',
    title: 'Glass Hut at Google Visitor Center',
    year: '2024',
    camera: 'Fujifilm XT-5',
    fstop: '4',
    focal: '80',
    iso: '200',
  },
  {
    source: '/photography/_DSF0737.jpg',
    title: 'White Sculpture at Google Visitor Center',
    year: '2024',
    camera: 'Fujifilm XT-5',
    fstop: '4',
    focal: '20',
    iso: '200',
  },
];

const Photography = () => {
  return (
    <div className={styles.container}>
      <span className={styles.header}>DEFNF Photography</span>
      <span className={styles.sub_header}>I am not a photographer</span>
      <span className={styles.sub_sub_header}>Photographed by Nathanial Fine</span>
      <div className={styles.flex_container}>
        {photos.map(function(data) {
          return (
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
                <span className={styles.image_details_text}>{data.camera} &ensp;&#183;&ensp; &fnof;/{data.fstop} &ensp;&#183;&ensp; {data.focal}mm &ensp;&#183;&ensp; ISO{data.iso}</span>
                <span className={styles.image_details_text}>{data.year} &ensp;&#183;&ensp; {data.title}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Photography;