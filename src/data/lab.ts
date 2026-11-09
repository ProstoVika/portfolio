/**
 * Training projects from Foxminded — the Lab: where I learned the fundamentals.
 * They are not case studies, so they live here as plain data, not in the content collection.
 */
import type { ImageMetadata } from 'astro';
import angularStore from '@/assets/lab/angular-store.jpg';
import onlineStore from '@/assets/lab/online-store.jpg';
import countries from '@/assets/lab/countries.jpg';
import weather from '@/assets/lab/weather.jpg';
import menu from '@/assets/lab/menu.jpg';
import form from '@/assets/lab/form.jpg';
import lists from '@/assets/lab/lists.jpg';
import quiz from '@/assets/lab/quiz.jpg';
import bicycles from '@/assets/lab/bicycles.jpg';
import carousel from '@/assets/lab/carousel.jpg';

export interface LabItem {
  title: string;
  note: string;
  stack: string[];
  image?: ImageMetadata;
  live: string;
  code: string;
}

export const labItems: LabItem[] = [
  {
    title: 'Angular store',
    note: 'Single-page shop: routing, reactive forms, RxJS and Firebase.',
    stack: ['Angular', 'TypeScript', 'RxJS', 'Firebase'],
    image: angularStore,
    live: 'https://next-189fb.web.app/main-page',
    code: 'https://github.com/ProstoVika/angular',
  },
  {
    title: 'Online store',
    note: 'Product search and filtering by category and price.',
    stack: ['TypeScript', 'SCSS'],
    image: onlineStore,
    live: 'https://prostovika.netlify.app',
    code: 'https://github.com/ProstoVika/online-store',
  },
  {
    title: 'Countries list',
    note: 'REST Countries API, filtering by region, light/dark theme.',
    stack: ['TypeScript', 'SCSS', 'REST API'],
    image: countries,
    live: 'https://prostovika.github.io/list-page/',
    code: 'https://github.com/ProstoVika/list-page',
  },
  {
    title: 'Weather widget',
    note: 'City search with live data from the OpenWeatherMap API.',
    stack: ['TypeScript', 'SCSS', 'REST API'],
    image: weather,
    live: 'https://prostovika.github.io/Weather-widget/',
    code: 'https://github.com/ProstoVika/Weather-widget',
  },
  {
    title: 'Restaurant menu',
    note: 'Category buttons generated from data, client-side filtering.',
    stack: ['TypeScript', 'SCSS'],
    image: menu,
    live: 'https://prostovika.github.io/menu/',
    code: 'https://github.com/ProstoVika/menu',
  },
  {
    title: 'Form validator',
    note: 'Validator class with regex rules for every field.',
    stack: ['TypeScript', 'SCSS'],
    image: form,
    live: 'https://prostovika.github.io/form/',
    code: 'https://github.com/ProstoVika/form',
  },
  {
    title: 'To-do list',
    note: 'Pixel-matched layout with cookie-based persistence.',
    stack: ['TypeScript', 'SCSS'],
    image: lists,
    live: 'https://prostovika.github.io/Lists/',
    code: 'https://github.com/ProstoVika/Lists',
  },
  {
    title: 'Console quiz',
    note: 'Questions loaded from JSON, three options, a timer.',
    stack: ['JavaScript'],
    image: quiz,
    live: 'https://prostovika.github.io/game/',
    code: 'https://github.com/ProstoVika/game',
  },
  {
    title: 'Bicycle shop layout',
    note: 'Responsive page built from a design mock-up.',
    stack: ['SCSS'],
    image: bicycles,
    live: 'https://prostovika.github.io/page-of-bicycles/',
    code: 'https://github.com/ProstoVika/page-of-bicycles',
  },
  {
    title: 'CSS carousel',
    note: 'Image slider with no JavaScript at all.',
    stack: ['CSS'],
    image: carousel,
    live: 'https://prostovika.github.io/Carousel/',
    code: 'https://github.com/ProstoVika/Carousel',
  },
  {
    title: 'Flex & Grid layouts',
    note: 'Two responsive pages using different layout techniques.',
    stack: ['CSS'],
    live: 'https://prostovika.github.io/Flex-Grid/',
    code: 'https://github.com/ProstoVika/Flex-Grid',
  },
];
