import type { Language } from '@/data/portfolio-content'

export type JourneyTimelineItem = {
  date: string
  dateTime: string
  title: string
  description: string
  tags: string[]
  icon: 'refresh' | 'terminal' | 'book' | 'briefcase' | 'users' | 'layout' | 'braces' | 'monitor' | 'server'
}

export const journeyTimelineContent: Record<Language, JourneyTimelineItem[]> = {
  fr: [
    {
      date: 'Septembre 2025',
      dateTime: '2025-09',
      title: 'Découverte de Linux & Python',
      description:
        'Premiers repères dans l’environnement technique avec Linux, Python et les bases du terminal.',
      tags: ['Linux', 'Python', 'Terminal'],
      icon: 'terminal',
    },
    {
      date: 'Octobre 2025',
      dateTime: '2025-10',
      title: 'Autoformation OpenClassrooms',
      description:
        'Progression en autonomie avec OpenClassrooms pour structurer les bases et le rythme de travail.',
      tags: ['OpenClassrooms', 'Autonomie', 'Méthode'],
      icon: 'book',
    },
    {
      date: 'Novembre 2025',
      dateTime: '2025-11',
      title: 'Fondamentaux du Web',
      description:
        'Apprentissage des bases du web avec HTML, CSS et JavaScript.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      icon: 'layout',
    },
    {
      date: 'Décembre 2025',
      dateTime: '2025-12',
      title: 'Stage Développeur sur Odoo',
      description:
        'Première expérience concrète en stage sur Odoo dans un cadre de développement professionnel.',
      tags: ['Odoo', 'Stage', 'Développement'],
      icon: 'briefcase',
    },
    {
      date: 'Janvier 2026',
      dateTime: '2026-01',
      title: 'Début de la formation THP',
      description:
        'Entrée dans The Hacking Project avec Git, GitHub et une logique de peer learning.',
      tags: ['THP', 'Git', 'GitHub', 'Peer learning'],
      icon: 'users',
    },
    {
      date: 'Février 2026',
      dateTime: '2026-02',
      title: 'Développement Front-End moderne',
      description:
        'Construction d’interfaces modernes avec React, TypeScript et Tailwind.',
      tags: ['React', 'TypeScript', 'Tailwind'],
      icon: 'monitor',
    },
    {
      date: 'Mars 2026',
      dateTime: '2026-03',
      title: 'Architecture d’applications',
      description:
        'Structuration d’applications front avec Zustand, React Router et Zod.',
      tags: ['Zustand', 'React Router', 'Zod'],
      icon: 'monitor',
    },
    {
      date: 'Avril 2026',
      dateTime: '2026-04',
      title: 'Développement Back-End',
      description:
        'Conception de la couche serveur et de la donnée avec Node.js, Prisma et PostgreSQL.',
      tags: ['Node.js', 'Prisma', 'PostgreSQL'],
      icon: 'server',
    },
    {
      date: 'Mai 2026',
      dateTime: '2026-05',
      title: 'Applications Desktop avec Tauri',
      description:
        'Ouverture vers les applications desktop avec Tauri et une logique cross-platform.',
      tags: ['Tauri', 'Desktop', 'Cross-platform'],
      icon: 'monitor',
    },
    {
      date: 'Juin 2026',
      dateTime: '2026-06',
      title: 'Architecture IA & Agents',
      description:
        'Exploration des architectures IA avec RAG, MCP et des logiques d’automatisation.',
      tags: ['RAG', 'MCP', 'Automatisation'],
      icon: 'server',
    },
    {
      date: 'Juillet 2026',
      dateTime: '2026-07',
      title: 'Conception de projets Full Stack',
      description:
        'Mise en pratique sur des projets complets comme Portfolio, Sokwak et DevisGenerate.',
      tags: ['Portfolio', 'Sokwak', 'DevisGenerate'],
      icon: 'server',
    },
  ],
  en: [
    {
      date: 'September 2025',
      dateTime: '2025-09',
      title: 'Discovering Linux & Python',
      description:
        'First technical foundations with Linux, Python, and basic terminal usage.',
      tags: ['Linux', 'Python', 'Terminal'],
      icon: 'terminal',
    },
    {
      date: 'October 2025',
      dateTime: '2025-10',
      title: 'OpenClassrooms self-training',
      description:
        'Self-paced learning through OpenClassrooms to build foundations and working discipline.',
      tags: ['OpenClassrooms', 'Self-training', 'Method'],
      icon: 'book',
    },
    {
      date: 'November 2025',
      dateTime: '2025-11',
      title: 'Web fundamentals',
      description:
        'Learning the core web stack with HTML, CSS, and JavaScript.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      icon: 'layout',
    },
    {
      date: 'December 2025',
      dateTime: '2025-12',
      title: 'Developer internship on Odoo',
      description:
        'First concrete development internship experience working on Odoo in a professional setting.',
      tags: ['Odoo', 'Internship', 'Development'],
      icon: 'briefcase',
    },
    {
      date: 'January 2026',
      dateTime: '2026-01',
      title: 'Start of THP training',
      description:
        'Beginning The Hacking Project with Git, GitHub, and peer learning.',
      tags: ['THP', 'Git', 'GitHub', 'Peer learning'],
      icon: 'users',
    },
    {
      date: 'February 2026',
      dateTime: '2026-02',
      title: 'Modern front-end development',
      description:
        'Building modern interfaces with React, TypeScript, and Tailwind.',
      tags: ['React', 'TypeScript', 'Tailwind'],
      icon: 'monitor',
    },
    {
      date: 'March 2026',
      dateTime: '2026-03',
      title: 'Application architecture',
      description:
        'Structuring front-end applications with Zustand, React Router, and Zod.',
      tags: ['Zustand', 'React Router', 'Zod'],
      icon: 'monitor',
    },
    {
      date: 'April 2026',
      dateTime: '2026-04',
      title: 'Back-end development',
      description:
        'Designing the server and data layer with Node.js, Prisma, and PostgreSQL.',
      tags: ['Node.js', 'Prisma', 'PostgreSQL'],
      icon: 'server',
    },
    {
      date: 'May 2026',
      dateTime: '2026-05',
      title: 'Desktop applications with Tauri',
      description:
        'Expanding into desktop applications with Tauri and a cross-platform approach.',
      tags: ['Tauri', 'Desktop', 'Cross-platform'],
      icon: 'monitor',
    },
    {
      date: 'June 2026',
      dateTime: '2026-06',
      title: 'AI architecture & agents',
      description:
        'Exploring AI architectures with RAG, MCP, and automation patterns.',
      tags: ['RAG', 'MCP', 'Automation'],
      icon: 'server',
    },
    {
      date: 'July 2026',
      dateTime: '2026-07',
      title: 'Full-stack project design',
      description:
        'Applying these skills on complete projects such as Portfolio, Sokwak, and DevisGenerate.',
      tags: ['Portfolio', 'Sokwak', 'DevisGenerate'],
      icon: 'server',
    },
  ],
}
