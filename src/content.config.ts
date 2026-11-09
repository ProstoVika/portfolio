import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Every project is a Markdown file in src/content/projects/.
 * Add a file → a new case study appears. The schema below is validated at build time,
 * so a missing field or a typo fails the build instead of breaking the page.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** Short abbreviation, e.g. "Rc". Not shown at the moment. */
    symbol: z.string().min(1).max(2).optional(),
    /** Order on the page; also shown as the tile's "atomic number". */
    order: z.number().int().positive(),
    summary: z.string().max(160),
    role: z.string(),
    year: z.number().int().optional(),
    stack: z.array(z.string()).min(1),
    type: z.enum(['commercial', 'personal', 'nda', 'training']),
    links: z
      .object({
        live: z.url().optional(),
        code: z.url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
