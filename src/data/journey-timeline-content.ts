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
      title: 'Reconversion professionnelle',
      description:
        'Décision de me réorienter vers le développement web et de construire un nouveau projet professionnel.',
      tags: ['Reconversion', 'Développement web'],
      icon: 'refresh',
    },
    {
      date: 'Septembre 2025 - Janvier 2026',
      dateTime: '2025-09',
      title: 'Découverte de l’environnement informatique',
      description:
        'Exploration de Linux, Python et du terminal pendant les premiers mois de reconversion.',
      tags: ['Linux', 'Python', 'Terminal'],
      icon: 'terminal',
    },
    {
      date: 'Novembre 2025',
      dateTime: '2025-11',
      title: 'Première expérience professionnelle',
      description:
        'Stage de développement sur Odoo au sein d’une association à Paris et découverte d’un environnement professionnel.',
      tags: ['Odoo', 'Stage', 'Développement'],
      icon: 'briefcase',
    },
    {
      date: 'Janvier 2026',
      dateTime: '2026-01',
      title: 'Formation THP',
      description:
        'Début de la formation intensive The Hacking Project, avec une forte dimension pratique et collaborative.',
      tags: ['THP', 'Git', 'GitHub', 'Travail en équipe'],
      icon: 'users',
    },
    {
      date: 'Avril 2026',
      dateTime: '2026-04',
      title: 'Fondamentaux du développement web',
      description:
        'Conception de premières interfaces structurées, responsives et accessibles.',
      tags: ['HTML', 'CSS', 'Responsive Design', 'Accessibilité'],
      icon: 'layout',
    },
    {
      date: 'Mai 2026',
      dateTime: '2026-05',
      title: 'Développement JavaScript',
      description:
        'Création d’interfaces interactives et compréhension du DOM, de l’asynchrone et des échanges avec des API.',
      tags: ['JavaScript', 'DOM', 'Asynchrone', 'API'],
      icon: 'braces',
    },
    {
      date: 'Juin 2026',
      dateTime: '2026-06',
      title: 'Développement Front-End',
      description:
        'Conception d’interfaces modernes, typées et maintenables avec l’écosystème React.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand'],
      icon: 'monitor',
    },
    {
      date: 'Juillet 2026',
      dateTime: '2026-07',
      title: 'Développement Back-End',
      description:
        'Conception d’API, gestion de bases de données et mise en place de systèmes d’authentification.',
      tags: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
      icon: 'server',
    },
  ],
  en: [
    {
      date: 'September 2025',
      dateTime: '2025-09',
      title: 'Career transition',
      description:
        'Decision to move into web development and build a new professional direction.',
      tags: ['Career transition', 'Web development'],
      icon: 'refresh',
    },
    {
      date: 'September 2025 - January 2026',
      dateTime: '2025-09',
      title: 'Discovering the computing environment',
      description:
        'Exploration of Linux, Python, and the terminal during the first months of the career transition.',
      tags: ['Linux', 'Python', 'Terminal'],
      icon: 'terminal',
    },
    {
      date: 'November 2025',
      dateTime: '2025-11',
      title: 'First professional experience',
      description:
        'Development internship on Odoo within an association in Paris and discovery of a professional environment.',
      tags: ['Odoo', 'Internship', 'Development'],
      icon: 'briefcase',
    },
    {
      date: 'January 2026',
      dateTime: '2026-01',
      title: 'THP training',
      description:
        'Start of the intensive The Hacking Project training, with a strong practical and collaborative dimension.',
      tags: ['THP', 'Git', 'GitHub', 'Teamwork'],
      icon: 'users',
    },
    {
      date: 'April 2026',
      dateTime: '2026-04',
      title: 'Web development fundamentals',
      description:
        'Designing first structured, responsive, and accessible interfaces.',
      tags: ['HTML', 'CSS', 'Responsive Design', 'Accessibility'],
      icon: 'layout',
    },
    {
      date: 'May 2026',
      dateTime: '2026-05',
      title: 'JavaScript development',
      description:
        'Building interactive interfaces and understanding the DOM, async flows, and API exchanges.',
      tags: ['JavaScript', 'DOM', 'Async', 'API'],
      icon: 'braces',
    },
    {
      date: 'June 2026',
      dateTime: '2026-06',
      title: 'Front-end development',
      description:
        'Designing modern, typed, and maintainable interfaces with the React ecosystem.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand'],
      icon: 'monitor',
    },
    {
      date: 'July 2026',
      dateTime: '2026-07',
      title: 'Back-end development',
      description:
        'Designing APIs, managing databases, and setting up authentication systems.',
      tags: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
      icon: 'server',
    },
  ],
}
