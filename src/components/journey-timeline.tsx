import {
  BookOpen,
  BriefcaseBusiness,
  Braces,
  LayoutTemplate,
  MonitorSmartphone,
  RefreshCcw,
  Server,
  Terminal,
  Users,
} from 'lucide-react'
import Timeline from '@/components/ui/timeline'
import { journeyTimelineContent } from '@/data/journey-timeline-content'
import type { Language } from '@/data/portfolio-content'

type JourneyTimelineProps = {
  language: Language
  label: string
  title: string
  intro: string
}

const iconMap = {
  refresh: RefreshCcw,
  terminal: Terminal,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  users: Users,
  layout: LayoutTemplate,
  braces: Braces,
  monitor: MonitorSmartphone,
  server: Server,
} as const

const copy = {
  fr: { hint: 'Faites défiler : la frise avance toute seule.', period: 'Sept. 2025 — 2026' },
  en: { hint: 'Keep scrolling: the timeline moves along.', period: 'Sept. 2025 — 2026' },
}

// "Mon parcours" fresco: the shared pinned horizontal Timeline, fed with the journey content.
export function JourneyTimeline({ language, label, title, intro }: JourneyTimelineProps) {
  const items = journeyTimelineContent[language].map((item) => {
    const Icon = iconMap[item.icon]
    return { date: item.date, dateTime: item.dateTime, title: item.title, description: item.description, tags: item.tags, icon: <Icon /> }
  })
  return (
    <Timeline
      items={items}
      eyebrow={label}
      title={title}
      intro={intro}
      periodLabel={copy[language].period}
      hint={copy[language].hint}
      activeColor="var(--accent)"
      duration={1.2}
    />
  )
}
