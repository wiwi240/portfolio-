export type Language = 'fr' | 'en'

export type ProjectItem = {
  id: string
  title: string
  summary: string
  image: string
  href?: string
  technologies: string[]
}

type Copy = {
  meta: {
    title: string
    description: string
  }
  nav: {
    skipToContent: string
    sectionsLabel: string
    projects: string
    stack: string
    journey: string
    about: string
    contact: string
    menu: string
    closeMenu: string
  }
  hero: {
    label: string
    titleLines: [string, string, string]
    lead: string
    primaryCta: string
    secondaryCta: string
    scroll: string
  }
  projects: {
    label: string
    title: string
    description: string
    viewAll: string
    cardCta: string
    techPlaceholder: string
  }
  stack: {
    label: string
    title: string
    lead: string
    overviewTitle: string
    overview: Array<{ value: string; label: string }>
  }
  journey: {
    label: string
    title: string
    intro: string
  }
  about: {
    label: string
    eyebrow: string
    titlePrefix: string
    titleAccent: string
    lead: string
    portraitAlt: string
    cards: Array<{ title: string; text: string }>
  }
  contact: {
    label: string
    titleLineOne: string
    titleLineTwo: string
    lead: string
    email: string
    github: string
    linkedin: string
    emailHint: string
    githubHint: string
    linkedinHint: string
  }
  footer: {
    role: string
    legalLabel: string
    legal: string
    privacy: string
    terms: string
    rights: string
  }
  language: {
    label: string
  }
  actions: {
    copyEmail: string
    copiedEmail: string
    close: string
    openMail: string
  }
  theme: {
    light: string
    dark: string
  }
}

export const languageOptions = [
  { value: 'fr', shortLabel: 'FR', longLabel: 'Français' },
  { value: 'en', shortLabel: 'EN', longLabel: 'English' },
] as const

export const contactEmail = 'william.mahipro@gmail.com'
export const githubUrl = 'https://github.com/wiwi240'
export const linkedinUrl = 'https://www.linkedin.com/in/william-mahi-9727243a3/'

export const copy: Record<Language, Copy> = {
  fr: {
    meta: {
      title: 'William Mahi | Développeur full-stack',
      description:
        'Portfolio de William Mahi, développeur full-stack. Interfaces React soignées, back-end Node fiable et expériences web rapides.',
    },
    nav: {
      skipToContent: 'Aller au contenu',
      sectionsLabel: 'Sections du portfolio',
      projects: 'Projets',
      stack: 'Stack',
      journey: 'Parcours',
      about: 'À propos',
      contact: 'Contact',
      menu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    },
    hero: {
      label: 'Développeur fullstack',
      titleLines: ['Code.', 'Design.', 'Build.'],
      lead:
        'Je conçois et développe des interfaces lisibles, des bases solides et des expériences web pensées pour durer.',
      primaryCta: 'Voir mes projets',
      secondaryCta: 'Me contacter',
      scroll: 'Scroller',
    },
    projects: {
      label: 'Projets',
      title: 'Des projets réels, pensés pour être utiles et maintenables.',
      description:
        'Une sélection de produits et de sites conçus avec une attention particulière portée à la clarté, à l’interface et à la structure technique.',
      viewAll: 'Voir tous les projets',
      cardCta: 'Voir le projet',
      techPlaceholder: 'Stack à préciser',
    },
    stack: {
      label: 'Stack',
      title: 'Des outils modernes pour créer des solutions solides et évolutives.',
      lead:
        'J’utilise un écosystème de technologies sélectionnées pour leur performance, leur lisibilité et leur capacité à supporter une vraie évolution produit.',
      overviewTitle: 'Overview',
      overview: [
        { value: '19', label: 'technologies' },
        { value: '4', label: 'projets visibles' },
        { value: '2', label: 'langues du site' },
      ],
    },
    journey: {
      label: 'Parcours',
      title: 'Mon parcours',
      intro:
        'De ma reconversion à la conception d’applications modernes, chaque étape a construit les compétences que j’utilise aujourd’hui.',
    },
    about: {
      label: 'À propos',
      eyebrow: 'Développeur fullstack',
      titlePrefix: 'Passionné par le code, obsédé par la',
      titleAccent: 'qualité.',
      lead:
        'Je cherche à construire des projets que l’on comprend vite, que l’on reprend facilement et qui restent propres quand ils évoluent. Même exigence du front au back: interface nette, logique explicite, structure maintenable.',
      portraitAlt: 'Mon portrait',
      cards: [
        {
          title: 'Focus',
          text: 'Des solutions utiles, centrées sur la lisibilité, la performance et le besoin réel.',
        },
        {
          title: 'Exigence',
          text: 'Une base propre, des choix techniques compréhensibles et une maintenance durable.',
        },
        {
          title: 'Évolution',
          text: 'Un apprentissage continu pour progresser sans ajouter de complexité inutile.',
        },
      ],
    },
    contact: {
      label: 'Contact',
      titleLineOne: 'Un projet en tête ?',
      titleLineTwo: 'Discutons-en.',
      lead:
        'Disponible pour échanger autour d’un besoin produit, d’un site sur mesure ou d’une collaboration technique.',
      email: 'Email',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      emailHint: 'Me contacter directement',
      githubHint: 'Voir mon profil',
      linkedinHint: 'Me retrouver ici',
    },
    footer: {
      role: 'Développeur Fullstack',
      legalLabel: 'Informations légales',
      legal: 'Mentions légales',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d’utilisation',
      rights: 'Tous droits réservés.',
    },
    language: {
      label: 'Sélection de la langue',
    },
    actions: {
      copyEmail: 'Copier le mail',
      copiedEmail: 'Mail copié',
      close: 'Fermer',
      openMail: 'Ouvrir le contact par email',
    },
    theme: {
      light: 'Activer le thème clair',
      dark: 'Activer le thème sombre',
    },
  },
  en: {
    meta: {
      title: 'William Mahi | Full-stack developer',
      description:
        'Portfolio of William Mahi, full-stack developer. Thoughtful React interfaces, reliable Node back-end, and fast web experiences.',
    },
    nav: {
      skipToContent: 'Skip to content',
      sectionsLabel: 'Portfolio sections',
      projects: 'Projects',
      stack: 'Stack',
      journey: 'Journey',
      about: 'About',
      contact: 'Contact',
      menu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      label: 'Full-stack developer',
      titleLines: ['Code.', 'Design.', 'Build.'],
      lead:
        'I design and build readable interfaces, durable foundations, and web experiences meant to stay maintainable over time.',
      primaryCta: 'View my projects',
      secondaryCta: 'Contact me',
      scroll: 'Scroll',
    },
    projects: {
      label: 'Projects',
      title: 'Real projects designed to stay useful and maintainable.',
      description:
        'A selection of products and websites built with a strong focus on clarity, interface quality, and technical structure.',
      viewAll: 'View all projects',
      cardCta: 'View project',
      techPlaceholder: 'Stack to confirm',
    },
    stack: {
      label: 'Stack',
      title: 'Modern tools to build solid and scalable solutions.',
      lead:
        'I work with a set of technologies chosen for performance, readability, and their ability to support real product growth.',
      overviewTitle: 'Overview',
      overview: [
        { value: '19', label: 'technologies' },
        { value: '4', label: 'visible projects' },
        { value: '2', label: 'site languages' },
      ],
    },
    journey: {
      label: 'Journey',
      title: 'My journey',
      intro:
        'From my career transition to building modern applications, each step shaped the skills I rely on today.',
    },
    about: {
      label: 'About',
      eyebrow: 'Full-stack developer',
      titlePrefix: 'Passionate about code, obsessed with',
      titleAccent: 'quality.',
      lead:
        'I aim to build projects that are easy to understand, easy to pick up again, and still clean when they evolve. The same standard applies from front to back: sharp interface, explicit logic, maintainable structure.',
      portraitAlt: 'My portrait',
      cards: [
        {
          title: 'Focus',
          text: 'Useful solutions built around readability, performance, and the actual user need.',
        },
        {
          title: 'Standards',
          text: 'Clean foundations, understandable technical choices, and durable maintenance.',
        },
        {
          title: 'Growth',
          text: 'Continuous learning to improve without adding unnecessary complexity.',
        },
      ],
    },
    contact: {
      label: 'Contact',
      titleLineOne: 'Got a project in mind?',
      titleLineTwo: 'Let’s talk.',
      lead:
        'Available to discuss a product need, a custom site, or a technical collaboration.',
      email: 'Email',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      emailHint: 'Contact me directly',
      githubHint: 'View my profile',
      linkedinHint: 'Find me here',
    },
    footer: {
      role: 'Full-stack developer',
      legalLabel: 'Legal information',
      legal: 'Legal notice',
      privacy: 'Privacy policy',
      terms: 'Terms of use',
      rights: 'All rights reserved.',
    },
    language: {
      label: 'Language selection',
    },
    actions: {
      copyEmail: 'Copy email',
      copiedEmail: 'Email copied',
      close: 'Close',
      openMail: 'Open contact by email',
    },
    theme: {
      light: 'Enable light theme',
      dark: 'Enable dark theme',
    },
  },
}

export const projects: Record<Language, ProjectItem[]> = {
  fr: [
    {
      id: 'rubber-duck',
      title: 'Rubber Duck',
      summary:
        'Outil pédagogique pensé pour accompagner le raisonnement par étapes avec une interface de guidage et une logique de contexte réutilisable.',
      image: '/projects/rubber-duck.png',
      technologies: ['Stack à préciser'],
    },
    {
      id: 'sakura-line',
      title: 'Sakura Line Studio',
      summary:
        'Site conçu pour une tatoueuse avec une présentation claire de l’activité et une base permettant des mises à jour simples.',
      image: '/projects/sakura-line.png',
      technologies: ['Stack à préciser'],
    },
    {
      id: 'questonnaut',
      title: 'Questonnaut',
      summary:
        'Application de création d’habitudes gamifiée, conçue pour rendre le suivi plus engageant et plus lisible au quotidien.',
      image: '/projects/questonnaut.png',
      technologies: ['Stack à préciser'],
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      summary:
        'Portfolio personnel développé pour présenter mon approche, mes projets et ma manière de construire des interfaces lisibles.',
      image: '/projects/portfolio.png',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    },
  ],
  en: [
    {
      id: 'rubber-duck',
      title: 'Rubber Duck',
      summary:
        'A pedagogical tool designed to support step-by-step reasoning with guided interactions and reusable context logic.',
      image: '/projects/rubber-duck.png',
      technologies: ['Stack to confirm'],
    },
    {
      id: 'sakura-line',
      title: 'Sakura Line Studio',
      summary:
        'A website for a tattoo artist with a clean presentation and a foundation built for simple future updates.',
      image: '/projects/sakura-line.png',
      technologies: ['Stack to confirm'],
    },
    {
      id: 'questonnaut',
      title: 'Questonnaut',
      summary:
        'A gamified habit-building app designed to make progress tracking more engaging and easier to read every day.',
      image: '/projects/questonnaut.png',
      technologies: ['Stack to confirm'],
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      summary:
        'A personal portfolio built to present my approach, my projects, and the way I structure readable interfaces.',
      image: '/projects/portfolio.png',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    },
  ],
}
