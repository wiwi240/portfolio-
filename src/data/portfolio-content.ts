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
  projects: { title: string }
  stack: { label: string; lead: string }
  journey: { label: string; title: string; intro: string }
  about: { titlePrefix: string; titleAccent: string; lead: string; portraitAlt: string; cards: Array<{ title: string; text: string }> }
  contact: { titleLineOne: string; titleLineTwo: string; lead: string }
  theme: { light: string; dark: string }
}

export const contactEmail = 'william.mahipro@gmail.com'
export const githubUrl = 'https://github.com/wiwi240'
export const linkedinUrl = 'https://www.linkedin.com/in/william-mahi-9727243a3/'

export const copy: Record<Language, Copy> = {
  fr: {
    projects: {
      title: 'Des projets réels, pensés pour être utiles et maintenables.',
    },
    stack: {
      label: 'Stack',
      lead:
        'J’utilise un écosystème de technologies sélectionnées pour leur performance, leur lisibilité et leur capacité à supporter une vraie évolution produit.',
    },
    journey: {
      label: 'Parcours',
      title: 'Mon parcours',
      intro:
        'De ma reconversion à la conception d’applications modernes, chaque étape a construit les compétences que j’utilise aujourd’hui.',
    },
    about: {
      titlePrefix: 'Passionné par le code, obsédé par la',
      titleAccent: 'qualité.',
      lead:
        'Je cherche à construire des projets que l’on comprend vite, que l’on reprend facilement et qui restent propres quand ils évoluent. Même exigence du front au back: interface nette, logique explicite, structure maintenable.',
      portraitAlt: 'Portrait de William Mahi, développeur full-stack',
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
      titleLineOne: 'Un projet en tête ?',
      titleLineTwo: 'Discutons-en.',
      lead:
        'Disponible pour échanger autour d’un besoin produit, d’un site sur mesure ou d’une collaboration technique.',
    },
    theme: {
      light: 'Activer le thème clair',
      dark: 'Activer le thème sombre',
    },
  },
  en: {
    projects: {
      title: 'Real projects designed to stay useful and maintainable.',
    },
    stack: {
      label: 'Stack',
      lead:
        'I work with a set of technologies chosen for performance, readability, and their ability to support real product growth.',
    },
    journey: {
      label: 'Journey',
      title: 'My journey',
      intro:
        'From my career transition to building modern applications, each step shaped the skills I rely on today.',
    },
    about: {
      titlePrefix: 'Passionate about code, obsessed with',
      titleAccent: 'quality.',
      lead:
        'I aim to build projects that are easy to understand, easy to pick up again, and still clean when they evolve. The same standard applies from front to back: sharp interface, explicit logic, maintainable structure.',
      portraitAlt: 'Portrait of William Mahi, full-stack developer',
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
      titleLineOne: 'Got a project in mind?',
      titleLineTwo: 'Let’s talk.',
      lead:
        'Available to discuss a product need, a custom site, or a technical collaboration.',
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
      image: '/projects/rubber-duck.webp',
      href: 'https://github.com/wiwi240/rubberduck_ai',
      technologies: ['Next.js', 'React', 'TypeScript', 'Turborepo'],
    },
    {
      id: 'sakura-line',
      title: 'Sakura Line Studio',
      summary:
        'Site conçu pour une tatoueuse avec une présentation claire de l’activité et une base permettant des mises à jour simples.',
      image: '/projects/sakura-line.webp',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Ruby on Rails', 'PostgreSQL'],
    },
    {
      id: 'questonnaut',
      title: 'Questonnaut',
      summary:
        'Application de création d’habitudes gamifiée, conçue pour rendre le suivi plus engageant et plus lisible au quotidien.',
      image: '/projects/questonnaut.webp',
      technologies: ['Ruby', 'JavaScript', 'SCSS', 'HTML'],
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      summary:
        'Portfolio personnel développé pour présenter mon approche, mes projets et ma manière de construire des interfaces lisibles.',
      image: '/projects/portfolio.webp',
      href: 'https://github.com/wiwi240/portfolio-',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Motion'],
    },
  ],
  en: [
    {
      id: 'rubber-duck',
      title: 'Rubber Duck',
      summary:
        'A pedagogical tool designed to support step-by-step reasoning with guided interactions and reusable context logic.',
      image: '/projects/rubber-duck.webp',
      href: 'https://github.com/wiwi240/rubberduck_ai',
      technologies: ['Next.js', 'React', 'TypeScript', 'Turborepo'],
    },
    {
      id: 'sakura-line',
      title: 'Sakura Line Studio',
      summary:
        'A website for a tattoo artist with a clean presentation and a foundation built for simple future updates.',
      image: '/projects/sakura-line.webp',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Ruby on Rails', 'PostgreSQL'],
    },
    {
      id: 'questonnaut',
      title: 'Questonnaut',
      summary:
        'A gamified habit-building app designed to make progress tracking more engaging and easier to read every day.',
      image: '/projects/questonnaut.webp',
      technologies: ['Ruby', 'JavaScript', 'SCSS', 'HTML'],
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      summary:
        'A personal portfolio built to present my approach, my projects, and the way I structure readable interfaces.',
      image: '/projects/portfolio.webp',
      href: 'https://github.com/wiwi240/portfolio-',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Motion'],
    },
  ],
}
