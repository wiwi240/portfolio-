'use client'

import {
  memo,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useReducedMotion } from 'motion/react'

import './orbiting-skills.css'

type IconType =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'git'
  | 'github'
  | 'vscode'
  | 'pnpm'
  | 'docker'
  | 'turborepo'
  | 'prisma'
  | 'react'
  | 'nextjs'
  | 'tailwind'
  | 'bootstrap'
  | 'graphql'
  | 'ruby'
  | 'rails'

type SkillCategory =
  | 'Language'
  | 'Framework'
  | 'Styling'
  | 'Backend'
  | 'Tool'
  | 'Platform'

type OrbitingSkillsVariant = 'languages' | 'frameworks' | 'all'

type OrbitingSkillsProps = {
  defaultVariant?: OrbitingSkillsVariant | null
  onSkillHoverChange?: ((
    skill: { label: string; category: SkillCategory; purpose: string } | null,
  ) => void) | null
}

type SkillDefinition = {
  id: string
  label: string
  category: SkillCategory
  iconType: IconType
  purpose: string
}

type OrbitConfig = {
  id: 'ring-1' | 'ring-2' | 'ring-3' | 'ring-4'
  ratio: number
  startAngle: number
  durationSeconds: number
  direction: 'normal' | 'reverse'
  itemSize: 'lg' | 'md' | 'sm'
  labelWidth: string
  skills: SkillDefinition[]
}

type SkillBadgeProps = {
  type: IconType
  label: string
}

type OrbitItemProps = {
  skill: SkillDefinition
  x: number
  y: number
  itemSize: OrbitConfig['itemSize']
  labelWidth: string
  durationSeconds: number
  direction: OrbitConfig['direction']
  reducedMotion: boolean
  onHoverChange?: ((
    skill: { label: string; category: SkillCategory; purpose: string } | null,
  ) => void) | null
}

const badgeMap: Record<
  IconType,
  {
    color: string
    background: string
    border: string
    logoUrl?: string
    logoSvg?: ReactNode
  }
> = {
  html: {
    color: '#E34F26',
    background: 'rgba(227, 79, 38, 0.1)',
    border: 'rgba(227, 79, 38, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/html5/E34F26?viewbox=auto&size=32',
  },
  css: {
    color: '#1572B6',
    background: 'rgba(21, 114, 182, 0.1)',
    border: 'rgba(21, 114, 182, 0.2)',
    logoSvg: (
      <svg viewBox="0 0 24 24" className="orbiting-skills__logo-svg" aria-hidden="true">
        <path
          fill="#1572B6"
          d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.751L12 19.351l5.379-1.443.744-8.157z"
        />
      </svg>
    ),
  },
  javascript: {
    color: '#F7DF1E',
    background: 'rgba(247, 223, 30, 0.1)',
    border: 'rgba(247, 223, 30, 0.22)',
    logoUrl: 'https://cdn.simpleicons.org/javascript/F7DF1E?viewbox=auto&size=32',
  },
  typescript: {
    color: '#3178C6',
    background: 'rgba(49, 120, 198, 0.1)',
    border: 'rgba(49, 120, 198, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/typescript/3178C6?viewbox=auto&size=32',
  },
  python: {
    color: '#3776AB',
    background: 'rgba(55, 118, 171, 0.1)',
    border: 'rgba(55, 118, 171, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/python/3776AB?viewbox=auto&size=32',
  },
  git: {
    color: '#F05032',
    background: 'rgba(240, 80, 50, 0.1)',
    border: 'rgba(240, 80, 50, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/git/F05032?viewbox=auto&size=32',
  },
  github: {
    color: '#FFFFFF',
    background: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.14)',
    logoUrl: 'https://cdn.simpleicons.org/github/FFFFFF?viewbox=auto&size=32',
  },
  vscode: {
    color: '#007ACC',
    background: 'rgba(0, 122, 204, 0.1)',
    border: 'rgba(0, 122, 204, 0.2)',
    logoSvg: (
      <svg viewBox="0 0 100 100" className="orbiting-skills__logo-svg" aria-hidden="true">
        <path
          fill="#0065A9"
          d="M96.461 10.796 75.857.876a6.23 6.23 0 0 0-7.107 1.207l-67.451 61.5a4.167 4.167 0 0 0 .004 6.162l5.51 5.009a4.167 4.167 0 0 0 5.32.236l81.228-61.62c2.725-2.067 6.639-.124 6.639 3.297v-.24a6.25 6.25 0 0 0-3.539-5.63Z"
        />
        <path
          fill="#007ACC"
          d="m96.461 89.204-20.604 9.92a6.229 6.229 0 0 1-7.107-1.207l-67.451-61.5a4.167 4.167 0 0 1 .004-6.162l5.51-5.009a4.167 4.167 0 0 1 5.32-.236l81.228 61.62c2.725 2.067 6.639.124 6.639-3.297v.24a6.25 6.25 0 0 1-3.539 5.63Z"
        />
        <path
          fill="#1F9CF0"
          d="M75.858 99.126a6.232 6.232 0 0 1-7.108-1.21c2.306 2.307 6.25.674 6.25-2.588V4.672c0-3.262-3.944-4.895-6.25-2.589a6.232 6.232 0 0 1 7.108-1.21l20.6 9.908A6.25 6.25 0 0 1 100 16.413v67.174a6.25 6.25 0 0 1-3.541 5.633l-20.601 9.906Z"
        />
      </svg>
    ),
  },
  pnpm: {
    color: '#F69220',
    background: 'rgba(246, 146, 32, 0.1)',
    border: 'rgba(246, 146, 32, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/pnpm/F69220?viewbox=auto&size=32',
  },
  docker: {
    color: '#2496ED',
    background: 'rgba(36, 150, 237, 0.1)',
    border: 'rgba(36, 150, 237, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/docker/2496ED?viewbox=auto&size=32',
  },
  turborepo: {
    color: '#EF4444',
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/turborepo/EF4444?viewbox=auto&size=32',
  },
  prisma: {
    color: '#94A3B8',
    background: 'rgba(148, 163, 184, 0.1)',
    border: 'rgba(148, 163, 184, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/prisma/94A3B8?viewbox=auto&size=32',
  },
  react: {
    color: '#61DAFB',
    background: 'rgba(97, 218, 251, 0.1)',
    border: 'rgba(97, 218, 251, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/react/61DAFB?viewbox=auto&size=32',
  },
  nextjs: {
    color: '#FFFFFF',
    background: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.14)',
    logoUrl: 'https://cdn.simpleicons.org/nextdotjs/FFFFFF?viewbox=auto&size=32',
  },
  tailwind: {
    color: '#06B6D4',
    background: 'rgba(6, 182, 212, 0.1)',
    border: 'rgba(6, 182, 212, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/tailwindcss/06B6D4?viewbox=auto&size=32',
  },
  bootstrap: {
    color: '#7952B3',
    background: 'rgba(121, 82, 179, 0.1)',
    border: 'rgba(121, 82, 179, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/bootstrap/7952B3?viewbox=auto&size=32',
  },
  graphql: {
    color: '#E10098',
    background: 'rgba(225, 0, 152, 0.1)',
    border: 'rgba(225, 0, 152, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/graphql/E10098?viewbox=auto&size=32',
  },
  ruby: {
    color: '#CC342D',
    background: 'rgba(204, 52, 45, 0.1)',
    border: 'rgba(204, 52, 45, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/ruby/CC342D?viewbox=auto&size=32',
  },
  rails: {
    color: '#D30001',
    background: 'rgba(211, 0, 1, 0.1)',
    border: 'rgba(211, 0, 1, 0.2)',
    logoUrl: 'https://cdn.simpleicons.org/rubyonrails/D30001?viewbox=auto&size=32',
  },
}

const orbitConfigs: OrbitConfig[] = [
  {
    id: 'ring-1',
    ratio: 0.17,
    startAngle: -Math.PI / 2,
    durationSeconds: 28,
    direction: 'normal',
    itemSize: 'lg',
    labelWidth: '6.6rem',
    skills: [
      {
        id: 'react',
        label: 'React',
        category: 'Framework',
        iconType: 'react',
        purpose: 'Construction d interfaces utilisateur en composants reutilisables.',
      },
      {
        id: 'nextjs',
        label: 'Next.js',
        category: 'Framework',
        iconType: 'nextjs',
        purpose: 'Framework React pour routing, rendu serveur et applications web completes.',
      },
      {
        id: 'typescript',
        label: 'TypeScript',
        category: 'Language',
        iconType: 'typescript',
        purpose: 'Typage statique pour securiser et structurer le JavaScript.',
      },
    ],
  },
  {
    id: 'ring-2',
    ratio: 0.265,
    startAngle: -Math.PI / 2 + Math.PI / 10,
    durationSeconds: 36,
    direction: 'reverse',
    itemSize: 'md',
    labelWidth: '6rem',
    skills: [
      {
        id: 'javascript',
        label: 'JavaScript',
        category: 'Language',
        iconType: 'javascript',
        purpose: 'Langage principal pour la logique web cote client et serveur.',
      },
      {
        id: 'tailwind',
        label: 'Tailwind',
        category: 'Styling',
        iconType: 'tailwind',
        purpose: 'Style utilitaire rapide pour construire des interfaces coherentes.',
      },
      {
        id: 'prisma',
        label: 'Prisma',
        category: 'Backend',
        iconType: 'prisma',
        purpose: 'ORM type-safe pour modeliser et interroger la base de donnees.',
      },
      {
        id: 'graphql',
        label: 'GraphQL',
        category: 'Backend',
        iconType: 'graphql',
        purpose: 'API de requetes flexible pour exposer et consommer des donnees.',
      },
      {
        id: 'docker',
        label: 'Docker',
        category: 'Tool',
        iconType: 'docker',
        purpose: 'Conteneurisation pour des environnements coherents entre dev et prod.',
      },
    ],
  },
  {
    id: 'ring-3',
    ratio: 0.36,
    startAngle: -Math.PI / 2,
    durationSeconds: 44,
    direction: 'normal',
    itemSize: 'sm',
    labelWidth: '5.6rem',
    skills: [
      {
        id: 'html',
        label: 'HTML',
        category: 'Language',
        iconType: 'html',
        purpose: 'Structure semantique du contenu des pages web.',
      },
      {
        id: 'css',
        label: 'CSS',
        category: 'Language',
        iconType: 'css',
        purpose: 'Mise en forme visuelle, layout et responsive design.',
      },
      {
        id: 'bootstrap',
        label: 'Bootstrap',
        category: 'Styling',
        iconType: 'bootstrap',
        purpose: 'Bibliotheque CSS de composants et grille responsive predefinie.',
      },
      {
        id: 'python',
        label: 'Python',
        category: 'Language',
        iconType: 'python',
        purpose: 'Scripts, automatisation et logique back-end polyvalente.',
      },
      {
        id: 'ruby',
        label: 'Ruby',
        category: 'Language',
        iconType: 'ruby',
        purpose: 'Langage expressif souvent utilise pour le back-end avec Rails.',
      },
      {
        id: 'rails',
        label: 'Rails',
        category: 'Backend',
        iconType: 'rails',
        purpose: 'Framework back-end Ruby pour construire rapidement des applications web.',
      },
    ],
  },
  {
    id: 'ring-4',
    ratio: 0.455,
    startAngle: -Math.PI / 2,
    durationSeconds: 52,
    direction: 'reverse',
    itemSize: 'sm',
    labelWidth: '5.2rem',
    skills: [
      {
        id: 'vscode',
        label: 'VS Code',
        category: 'Tool',
        iconType: 'vscode',
        purpose: 'Editeur de code pour developpement, debug et extensions.',
      },
      {
        id: 'git',
        label: 'Git',
        category: 'Tool',
        iconType: 'git',
        purpose: 'Versionnement du code et gestion de l historique du projet.',
      },
      {
        id: 'github',
        label: 'GitHub',
        category: 'Platform',
        iconType: 'github',
        purpose: 'Hebergement du code, revues et collaboration autour du projet.',
      },
      {
        id: 'pnpm',
        label: 'pnpm',
        category: 'Tool',
        iconType: 'pnpm',
        purpose: 'Gestionnaire de paquets Node rapide et econome en espace disque.',
      },
      {
        id: 'turborepo',
        label: 'Turborepo',
        category: 'Tool',
        iconType: 'turborepo',
        purpose: 'Orchestration de monorepo avec cache et pipelines de build.',
      },
    ],
  },
]

const variantFilters: Record<OrbitingSkillsVariant, (skill: SkillDefinition) => boolean> = {
  languages: (skill) =>
    ['typescript', 'javascript', 'python', 'ruby', 'html', 'css'].includes(skill.id),
  frameworks: (skill) =>
    ['react', 'nextjs', 'tailwind', 'bootstrap', 'graphql', 'rails', 'prisma'].includes(skill.id),
  all: () => true,
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, size }
}

const SkillBadge = memo(({ type, label }: SkillBadgeProps) => {
  const badge = badgeMap[type]

  return (
    <span
      className="orbiting-skills__logo"
      style={
        {
          '--skill-bg': badge.background,
          '--skill-border': badge.border,
        } as CSSProperties
      }
    >
      {badge.logoSvg ? (
        badge.logoSvg
      ) : (
        <img
          src={badge.logoUrl}
          alt={label}
          className="orbiting-skills__logo-image"
          loading="eager"
          draggable={false}
          referrerPolicy="no-referrer"
        />
      )}
    </span>
  )
})
SkillBadge.displayName = 'SkillBadge'

const OrbitItem = memo(
  ({
    skill,
    x,
    y,
    itemSize,
    labelWidth,
    durationSeconds,
    direction,
    reducedMotion,
    onHoverChange,
  }: OrbitItemProps) => {
    const itemStyle = {
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
      '--label-width': labelWidth,
    } as CSSProperties

    const counterStyle = (reducedMotion
      ? { animation: 'none' }
      : {
          '--spin-duration': `${durationSeconds}s`,
          '--spin-direction': direction === 'normal' ? 'reverse' : 'normal',
        }) as CSSProperties

    return (
      <div className="orbiting-skills__item-positioner" style={itemStyle}>
        <button
          type="button"
          className={`orbiting-skills__item-button orbiting-skills__item-button--${itemSize}`}
          aria-label={`${skill.label}, ${skill.category}`}
          onMouseEnter={() =>
            onHoverChange?.({ label: skill.label, category: skill.category, purpose: skill.purpose })
          }
          onMouseLeave={() => onHoverChange?.(null)}
          onFocus={() =>
            onHoverChange?.({ label: skill.label, category: skill.category, purpose: skill.purpose })
          }
          onBlur={() => onHoverChange?.(null)}
        >
          <span className="orbiting-skills__counter-rotation" style={counterStyle}>
            <SkillBadge type={skill.iconType} label={skill.label} />
            <span className="orbiting-skills__label">{skill.label}</span>
          </span>
        </button>
      </div>
    )
  },
)
OrbitItem.displayName = 'OrbitItem'

export default function OrbitingSkills({
  defaultVariant = null,
  onSkillHoverChange = null,
}: OrbitingSkillsProps) {
  const reducedMotion = useReducedMotion()
  const { ref, size } = useElementSize<HTMLDivElement>()
  const variant = defaultVariant ?? 'all'

  const visibleOrbits = useMemo(() => {
    const filter = variantFilters[variant]

    return orbitConfigs
      .map((orbit) => ({
        ...orbit,
        skills: orbit.skills.filter(filter),
      }))
      .filter((orbit) => orbit.skills.length > 0)
  }, [variant])

  const containerSize = Math.min(size.width, size.height)

  return (
    <div className="orbiting-skills">
      <div ref={ref} className="orbiting-skills__canvas" aria-label="Skill orbit visualization">
        <div className="orbiting-skills__center">
          <span>CORE EXPERTISE</span>
        </div>

        {visibleOrbits.map((orbit) => {
          const radius = containerSize > 0 ? containerSize * orbit.ratio : 0
          const diameter = radius * 2
          const ringStyle = {
            width: `${diameter}px`,
            height: `${diameter}px`,
          } as CSSProperties

          const rotationStyle = (reducedMotion
            ? { animation: 'none' }
            : {
                '--spin-duration': `${orbit.durationSeconds}s`,
                '--spin-direction': orbit.direction,
              }) as CSSProperties

          return (
            <div key={orbit.id} className="orbiting-skills__orbit-layer">
              <div className="orbiting-skills__ring-guide" style={ringStyle} />
              <div className="orbiting-skills__orbit-rotation" style={rotationStyle}>
                {orbit.skills.map((skill, index) => {
                  const step = (Math.PI * 2) / orbit.skills.length
                  const angle = orbit.startAngle + index * step
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius

                  return (
                    <OrbitItem
                      key={skill.id}
                      skill={skill}
                      x={x}
                      y={y}
                      itemSize={orbit.itemSize}
                      labelWidth={orbit.labelWidth}
                      durationSeconds={orbit.durationSeconds}
                      direction={orbit.direction}
                      reducedMotion={Boolean(reducedMotion)}
                      onHoverChange={onSkillHoverChange}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
