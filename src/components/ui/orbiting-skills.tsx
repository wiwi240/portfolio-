"use client"

import { memo, useEffect, useState, type ReactNode } from 'react'

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

type GlowColor = 'cyan' | 'purple' | 'amber'

interface SkillBadgeProps {
  type: IconType
  label: string
}

interface SkillConfig {
  id: string
  orbitRadius: number
  size: number
  speed: number
  iconType: IconType
  phaseShift: number
  glowColor: GlowColor
  label: string
}

interface OrbitingSkillProps {
  config: SkillConfig
  angle: number
}

interface GlowingOrbitPathProps {
  radius: number
  glowColor?: GlowColor
  animationDelay?: number
}

type OrbitingSkillsVariant = 'languages' | 'frameworks' | 'all'

interface OrbitingSkillsProps {
  defaultVariant?: OrbitingSkillsVariant | null
}

const badgeMap: Record<
  IconType,
  {
    short: string
    color: string
    background: string
    border: string
    text: string
    logoUrl?: string
    logoSvg?: ReactNode
  }
> = {
  html: {
    short: 'H5',
    color: '#E34F26',
    background: 'rgba(227, 79, 38, 0.18)',
    border: 'rgba(227, 79, 38, 0.34)',
    text: '#FFF3EE',
    logoUrl: 'https://cdn.simpleicons.org/html5/E34F26?viewbox=auto&size=28',
  },
  css: {
    short: 'C3',
    color: '#1572B6',
    background: 'rgba(21, 114, 182, 0.18)',
    border: 'rgba(21, 114, 182, 0.34)',
    text: '#EEF8FF',
    logoSvg: (
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" aria-hidden="true">
        <path
          fill="#1572B6"
          d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.751L12 19.351l5.379-1.443.744-8.157z"
        />
      </svg>
    ),
  },
  javascript: {
    short: 'JS',
    color: '#F7DF1E',
    background: 'rgba(247, 223, 30, 0.18)',
    border: 'rgba(247, 223, 30, 0.34)',
    text: '#FFFDEB',
    logoUrl: 'https://cdn.simpleicons.org/javascript/F7DF1E?viewbox=auto&size=28',
  },
  typescript: {
    short: 'TS',
    color: '#3178C6',
    background: 'rgba(49, 120, 198, 0.18)',
    border: 'rgba(49, 120, 198, 0.34)',
    text: '#EFF7FF',
    logoUrl: 'https://cdn.simpleicons.org/typescript/3178C6?viewbox=auto&size=28',
  },
  python: {
    short: 'PY',
    color: '#3776AB',
    background: 'rgba(55, 118, 171, 0.18)',
    border: 'rgba(55, 118, 171, 0.34)',
    text: '#EEF7FF',
    logoUrl: 'https://cdn.simpleicons.org/python/3776AB?viewbox=auto&size=28',
  },
  git: {
    short: 'GT',
    color: '#F05032',
    background: 'rgba(240, 80, 50, 0.18)',
    border: 'rgba(240, 80, 50, 0.34)',
    text: '#FFF2EE',
    logoUrl: 'https://cdn.simpleicons.org/git/F05032?viewbox=auto&size=28',
  },
  github: {
    short: 'GH',
    color: '#FFFFFF',
    background: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.24)',
    text: '#FFFFFF',
    logoUrl: 'https://cdn.simpleicons.org/github/FFFFFF?viewbox=auto&size=28',
  },
  vscode: {
    short: 'VS',
    color: '#007ACC',
    background: 'rgba(0, 122, 204, 0.18)',
    border: 'rgba(0, 122, 204, 0.34)',
    text: '#EDF8FF',
    logoSvg: (
      <svg viewBox="0 0 100 100" className="h-[58%] w-[58%]" aria-hidden="true">
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
        <path
          fill="#fff"
          fillOpacity=".22"
          d="M70.851 99.317a6.224 6.224 0 0 0 4.96-.19L96.4 89.22a6.25 6.25 0 0 0 3.54-5.633V16.413a6.25 6.25 0 0 0-3.54-5.632L75.812.874a6.226 6.226 0 0 0-7.104 1.21L29.294 38.04 12.126 25.01a4.162 4.162 0 0 0-5.317.236l-5.507 5.009a4.168 4.168 0 0 0-.004 6.162L16.186 50 1.298 63.583a4.168 4.168 0 0 0 .004 6.162l5.507 5.009a4.162 4.162 0 0 0 5.317.236L29.294 61.96l39.414 35.958a6.218 6.218 0 0 0 2.143 1.4ZM74.954 27.3 45.048 50l29.906 22.701V27.3Z"
        />
      </svg>
    ),
  },
  pnpm: {
    short: 'PN',
    color: '#F69220',
    background: 'rgba(246, 146, 32, 0.18)',
    border: 'rgba(246, 146, 32, 0.34)',
    text: '#FFF6EE',
    logoUrl: 'https://cdn.simpleicons.org/pnpm/F69220?viewbox=auto&size=28',
  },
  docker: {
    short: 'DK',
    color: '#2496ED',
    background: 'rgba(36, 150, 237, 0.18)',
    border: 'rgba(36, 150, 237, 0.34)',
    text: '#EEF8FF',
    logoUrl: 'https://cdn.simpleicons.org/docker/2496ED?viewbox=auto&size=28',
  },
  turborepo: {
    short: 'TB',
    color: '#EF4444',
    background: 'rgba(239, 68, 68, 0.18)',
    border: 'rgba(239, 68, 68, 0.34)',
    text: '#FFF1F1',
    logoUrl: 'https://cdn.simpleicons.org/turborepo/EF4444?viewbox=auto&size=28',
  },
  prisma: {
    short: 'PR',
    color: '#2D3748',
    background: 'rgba(148, 163, 184, 0.18)',
    border: 'rgba(148, 163, 184, 0.34)',
    text: '#F8FAFC',
    logoUrl: 'https://cdn.simpleicons.org/prisma/94A3B8?viewbox=auto&size=28',
  },
  react: {
    short: 'R',
    color: '#61DAFB',
    background: 'rgba(97, 218, 251, 0.18)',
    border: 'rgba(97, 218, 251, 0.34)',
    text: '#ECFCFF',
    logoUrl: 'https://cdn.simpleicons.org/react/61DAFB?viewbox=auto&size=28',
  },
  nextjs: {
    short: 'N',
    color: '#E5E7EB',
    background: 'rgba(229, 231, 235, 0.16)',
    border: 'rgba(229, 231, 235, 0.26)',
    text: '#FFFFFF',
    logoUrl: 'https://cdn.simpleicons.org/nextdotjs/FFFFFF?viewbox=auto&size=28',
  },
  tailwind: {
    short: 'TW',
    color: '#06B6D4',
    background: 'rgba(6, 182, 212, 0.18)',
    border: 'rgba(6, 182, 212, 0.34)',
    text: '#ECFEFF',
    logoUrl: 'https://cdn.simpleicons.org/tailwindcss/06B6D4?viewbox=auto&size=28',
  },
  bootstrap: {
    short: 'BS',
    color: '#7952B3',
    background: 'rgba(121, 82, 179, 0.18)',
    border: 'rgba(121, 82, 179, 0.34)',
    text: '#F6F0FF',
    logoUrl: 'https://cdn.simpleicons.org/bootstrap/7952B3?viewbox=auto&size=28',
  },
  graphql: {
    short: 'GQ',
    color: '#E10098',
    background: 'rgba(225, 0, 152, 0.18)',
    border: 'rgba(225, 0, 152, 0.34)',
    text: '#FFF0FB',
    logoUrl: 'https://cdn.simpleicons.org/graphql/E10098?viewbox=auto&size=28',
  },
  ruby: {
    short: 'RB',
    color: '#CC342D',
    background: 'rgba(204, 52, 45, 0.18)',
    border: 'rgba(204, 52, 45, 0.34)',
    text: '#FFF1F0',
    logoUrl: 'https://cdn.simpleicons.org/ruby/CC342D?viewbox=auto&size=28',
  },
  rails: {
    short: 'RR',
    color: '#D30001',
    background: 'rgba(211, 0, 1, 0.18)',
    border: 'rgba(211, 0, 1, 0.34)',
    text: '#FFF3F3',
    logoUrl: 'https://cdn.simpleicons.org/rubyonrails/D30001?viewbox=auto&size=28',
  },
}

const SkillBadge = memo(({ type, label }: SkillBadgeProps) => {
  const badge = badgeMap[type]

  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.12em]"
      style={{
        background: badge.background,
        borderColor: badge.border,
        color: badge.text,
      }}
    >
      {badge.logoSvg ? (
        badge.logoSvg
      ) : (
        <img
          src={badge.logoUrl}
          alt={label}
          className="h-[58%] w-[58%] object-contain"
          draggable={false}
          loading="eager"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  )
})
SkillBadge.displayName = 'SkillBadge'

const orbitSets: Record<
  OrbitingSkillsVariant,
  {
    orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }>
    skills: SkillConfig[]
  }
> = {
  languages: {
    orbitConfigs: [
      { radius: 88, glowColor: 'cyan', delay: 0 },
      { radius: 146, glowColor: 'purple', delay: 1.2 },
      { radius: 205, glowColor: 'amber', delay: 2.2 },
    ],
    skills: [
      { id: 'html', orbitRadius: 88, size: 42, speed: 1.12, iconType: 'html', phaseShift: 0, glowColor: 'cyan', label: 'HTML5' },
      { id: 'css', orbitRadius: 88, size: 44, speed: 1.12, iconType: 'css', phaseShift: Math.PI / 2, glowColor: 'cyan', label: 'CSS3' },
      { id: 'javascript', orbitRadius: 88, size: 44, speed: 1.12, iconType: 'javascript', phaseShift: Math.PI, glowColor: 'cyan', label: 'JavaScript' },
      { id: 'typescript', orbitRadius: 88, size: 42, speed: 1.12, iconType: 'typescript', phaseShift: (3 * Math.PI) / 2, glowColor: 'cyan', label: 'TypeScript' },
      { id: 'python', orbitRadius: 146, size: 46, speed: -0.78, iconType: 'python', phaseShift: 0, glowColor: 'purple', label: 'Python' },
      { id: 'ruby', orbitRadius: 146, size: 44, speed: -0.78, iconType: 'ruby', phaseShift: (2 * Math.PI) / 3, glowColor: 'purple', label: 'Ruby' },
    ],
  },
  frameworks: {
    orbitConfigs: [
      { radius: 88, glowColor: 'cyan', delay: 0.2 },
      { radius: 146, glowColor: 'purple', delay: 1.4 },
      { radius: 205, glowColor: 'amber', delay: 2.4 },
    ],
    skills: [
      { id: 'react', orbitRadius: 88, size: 48, speed: 1.04, iconType: 'react', phaseShift: 0, glowColor: 'cyan', label: 'React' },
      { id: 'nextjs', orbitRadius: 88, size: 46, speed: 1.04, iconType: 'nextjs', phaseShift: (2 * Math.PI) / 3, glowColor: 'cyan', label: 'Next.js' },
      { id: 'tailwind', orbitRadius: 88, size: 48, speed: 1.04, iconType: 'tailwind', phaseShift: (4 * Math.PI) / 3, glowColor: 'cyan', label: 'Tailwind CSS' },
      { id: 'bootstrap', orbitRadius: 146, size: 46, speed: -0.7, iconType: 'bootstrap', phaseShift: 0, glowColor: 'purple', label: 'Bootstrap' },
      { id: 'graphql', orbitRadius: 146, size: 44, speed: -0.7, iconType: 'graphql', phaseShift: Math.PI, glowColor: 'purple', label: 'GraphQL' },
      { id: 'rails', orbitRadius: 205, size: 46, speed: 0.48, iconType: 'rails', phaseShift: 0, glowColor: 'amber', label: 'Ruby on Rails' },
    ],
  },
  all: {
    orbitConfigs: [
      { radius: 88, glowColor: 'cyan', delay: 0 },
      { radius: 146, glowColor: 'purple', delay: 1.1 },
      { radius: 205, glowColor: 'amber', delay: 2.1 },
      { radius: 264, glowColor: 'cyan', delay: 3.1 },
    ],
    skills: [
      { id: 'html', orbitRadius: 88, size: 40, speed: 1.18, iconType: 'html', phaseShift: 0, glowColor: 'cyan', label: 'HTML5' },
      { id: 'css', orbitRadius: 88, size: 42, speed: 1.18, iconType: 'css', phaseShift: Math.PI / 2, glowColor: 'cyan', label: 'CSS3' },
      { id: 'javascript', orbitRadius: 88, size: 42, speed: 1.18, iconType: 'javascript', phaseShift: Math.PI, glowColor: 'cyan', label: 'JavaScript' },
      { id: 'typescript', orbitRadius: 88, size: 40, speed: 1.18, iconType: 'typescript', phaseShift: (3 * Math.PI) / 2, glowColor: 'cyan', label: 'TypeScript' },
      { id: 'python', orbitRadius: 146, size: 44, speed: -0.82, iconType: 'python', phaseShift: 0, glowColor: 'purple', label: 'Python' },
      { id: 'ruby', orbitRadius: 146, size: 42, speed: -0.82, iconType: 'ruby', phaseShift: (2 * Math.PI) / 3, glowColor: 'purple', label: 'Ruby' },
      { id: 'react', orbitRadius: 146, size: 46, speed: -0.82, iconType: 'react', phaseShift: (4 * Math.PI) / 3, glowColor: 'purple', label: 'React' },
      { id: 'nextjs', orbitRadius: 205, size: 42, speed: 0.54, iconType: 'nextjs', phaseShift: 0, glowColor: 'amber', label: 'Next.js' },
      { id: 'tailwind', orbitRadius: 205, size: 46, speed: 0.54, iconType: 'tailwind', phaseShift: Math.PI / 3, glowColor: 'amber', label: 'Tailwind CSS' },
      { id: 'bootstrap', orbitRadius: 205, size: 42, speed: 0.54, iconType: 'bootstrap', phaseShift: (2 * Math.PI) / 3, glowColor: 'amber', label: 'Bootstrap' },
      { id: 'graphql', orbitRadius: 205, size: 40, speed: 0.54, iconType: 'graphql', phaseShift: Math.PI, glowColor: 'amber', label: 'GraphQL' },
      { id: 'rails', orbitRadius: 205, size: 44, speed: 0.54, iconType: 'rails', phaseShift: (5 * Math.PI) / 3, glowColor: 'amber', label: 'Ruby on Rails' },
      { id: 'git', orbitRadius: 264, size: 40, speed: -0.38, iconType: 'git', phaseShift: 0, glowColor: 'cyan', label: 'Git' },
      { id: 'github', orbitRadius: 264, size: 40, speed: -0.38, iconType: 'github', phaseShift: Math.PI / 3, glowColor: 'cyan', label: 'GitHub' },
      { id: 'vscode', orbitRadius: 264, size: 42, speed: -0.38, iconType: 'vscode', phaseShift: (2 * Math.PI) / 3, glowColor: 'cyan', label: 'VS Code' },
      { id: 'pnpm', orbitRadius: 264, size: 40, speed: -0.38, iconType: 'pnpm', phaseShift: Math.PI, glowColor: 'cyan', label: 'pnpm' },
      { id: 'docker', orbitRadius: 264, size: 42, speed: -0.38, iconType: 'docker', phaseShift: (4 * Math.PI) / 3, glowColor: 'cyan', label: 'Docker' },
      { id: 'turborepo', orbitRadius: 264, size: 40, speed: -0.38, iconType: 'turborepo', phaseShift: (5 * Math.PI) / 3, glowColor: 'cyan', label: 'Turborepo' },
      { id: 'prisma', orbitRadius: 264, size: 42, speed: -0.38, iconType: 'prisma', phaseShift: Math.PI / 6, glowColor: 'cyan', label: 'Prisma' },
    ],
  },
}

const OrbitingSkill = memo(({ config, angle }: OrbitingSkillProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { orbitRadius, size, iconType, label } = config

  const x = Math.cos(angle) * orbitRadius
  const y = Math.sin(angle) * orbitRadius
  const badge = badgeMap[iconType]

  return (
    <div
      className="absolute left-1/2 top-1/2 transition-all duration-300 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-900/88 p-1.5 backdrop-blur-sm transition-all duration-300 ${
          isHovered ? 'scale-125 shadow-2xl' : 'shadow-lg hover:shadow-xl'
        }`}
        style={{
          boxShadow: isHovered
            ? `0 0 30px ${badge.color}40, 0 0 60px ${badge.color}20`
            : undefined,
        }}
      >
        <SkillBadge type={iconType} label={label} />
        {isHovered ? (
          <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-950/95 px-2 py-1 text-[11px] text-white">
            {label}
          </div>
        ) : null}
      </div>
    </div>
  )
})
OrbitingSkill.displayName = 'OrbitingSkill'

const GlowingOrbitPath = memo(({ radius, glowColor = 'cyan', animationDelay = 0 }: GlowingOrbitPathProps) => {
  const glowColors = {
    cyan: {
      primary: 'rgba(57, 231, 255, 0.32)',
      secondary: 'rgba(57, 231, 255, 0.14)',
      border: 'rgba(57, 231, 255, 0.28)',
    },
    purple: {
      primary: 'rgba(138, 99, 255, 0.28)',
      secondary: 'rgba(138, 99, 255, 0.12)',
      border: 'rgba(138, 99, 255, 0.24)',
    },
    amber: {
      primary: 'rgba(24, 184, 255, 0.24)',
      secondary: 'rgba(24, 184, 255, 0.1)',
      border: 'rgba(24, 184, 255, 0.22)',
    },
  }

  const colors = glowColors[glowColor]

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        animationDelay: `${animationDelay}s`,
      }}
    >
      <div
        className="absolute inset-0 animate-pulse rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 42%, ${colors.secondary} 72%, ${colors.primary} 100%)`,
          boxShadow: `0 0 44px ${colors.primary}, inset 0 0 36px ${colors.secondary}`,
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: `${animationDelay}s`,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${colors.border}`,
          boxShadow: `inset 0 0 20px ${colors.secondary}`,
        }}
      />
    </div>
  )
})
GlowingOrbitPath.displayName = 'GlowingOrbitPath'

export default function OrbitingSkills({ defaultVariant = null }: OrbitingSkillsProps) {
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const variant = defaultVariant
  const orbitSet = variant ? orbitSets[variant] : null
  const displayedSkills = orbitSet ? orbitSet.skills : []

  useEffect(() => {
    if (isPaused) {
      return
    }

    let animationFrameId = 0
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      setTime((prevTime) => prevTime + deltaTime)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isPaused])

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden px-2 py-6 sm:px-4 sm:py-8">
      <div
        className="relative flex h-[300px] w-[300px] max-w-full items-center justify-center sm:h-[400px] sm:w-[400px] md:h-[470px] md:w-[470px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative z-10 flex h-30 w-30 items-center justify-center rounded-full border border-[rgba(16,33,44,0.10)] bg-[rgba(248,249,250,0.88)] shadow-[0_20px_54px_rgba(76,103,119,0.12)] md:h-32 md:w-32 dark:border-white/8 dark:bg-[rgba(19,27,33,0.88)] dark:shadow-[0_20px_54px_rgba(0,0,0,0.26)]">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl animate-pulse" />
          <div
            className="absolute inset-0 rounded-full bg-sky-500/10 blur-2xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-[rgba(16,33,44,0.08)] bg-white/72 font-mono text-xs font-semibold tracking-[0.24em] text-[var(--fg)] md:h-26 md:w-26 dark:border-white/8 dark:bg-black/24 dark:text-white">
            SKILL
          </div>
        </div>

        {orbitSet
          ? orbitSet.orbitConfigs.map((config) => (
              <GlowingOrbitPath
                key={`path-${config.radius}`}
                radius={config.radius}
                glowColor={config.glowColor}
                animationDelay={config.delay}
              />
            ))
          : null}

        {displayedSkills.map((config) => (
          <OrbitingSkill
            key={config.id}
            config={config}
            angle={time * config.speed + config.phaseShift}
          />
        ))}
      </div>
    </div>
  )
}
