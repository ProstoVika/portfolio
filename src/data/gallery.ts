/**
 * Screenshots for the endless strip on the homepage.
 * ONLY commercial and other strong, real work goes here — training projects live in the Lab.
 * The strip hides itself until there are at least MIN_GALLERY items (one image cannot loop nicely).
 *
 * To add one: put the screenshot in src/assets/work/, import it, add an entry.
 * `href` is the case study page, or the live site (external: true) until the case study is written.
 */
import type { ImageMetadata } from 'astro';
import akashDesai from '@/assets/work/akash-desai.png';
import royalCut from '@/assets/work/royal-cut-hero.png';
import brandonGraham from '@/assets/work/brandon-graham.png';
import danielleHay from '@/assets/work/danielle-hay.png';

export interface GalleryItem {
  image: ImageMetadata;
  alt: string;
  href: string;
  external?: boolean;
}

export const MIN_GALLERY = 3;

export const gallery: GalleryItem[] = [
  {
    image: akashDesai,
    alt: 'Akash Desai, leadership and business consulting website, hero section',
    href: 'https://akashdesaileadership.com/',
    external: true,
  },
  {
    image: royalCut,
    alt: 'Royal Cut barbershop website, home page',
    href: '/work/royal-cut',
  },
  {
    image: brandonGraham,
    alt: 'Brandon Graham, personal brand website, hero section',
    href: 'https://brandon-graham.com/',
    external: true,
  },
  {
    image: danielleHay,
    alt: 'Danielle Hay, leadership and business website, hero section',
    href: 'https://daniellehay.com/',
    external: true,
  },
];
