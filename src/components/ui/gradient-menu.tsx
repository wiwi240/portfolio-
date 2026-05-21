import type { CSSProperties, ReactNode } from 'react'

type GradientMenuItem = {
  title: string
  icon: ReactNode
  gradientFrom: string
  gradientTo: string
  href?: string
  onClick?: () => void
  external?: boolean
  ariaLabel?: string
}

type GradientMenuProps = {
  items: GradientMenuItem[]
  className?: string
}

type GradientStyle = CSSProperties & {
  '--gradient-from': string
  '--gradient-to': string
}

export default function GradientMenu({ items, className }: GradientMenuProps) {
  return (
    <div className={['flex w-full justify-center', className].filter(Boolean).join(' ')}>
      <ul className="flex flex-wrap justify-center gap-4 sm:gap-5">
        {items.map(({ title, icon, gradientFrom, gradientTo, href, onClick, external, ariaLabel }) => {
          const style = {
            '--gradient-from': gradientFrom,
            '--gradient-to': gradientTo,
          } satisfies GradientStyle

          const sharedClassName =
            'group relative flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-full border border-[rgba(16,33,44,0.12)] bg-[rgba(248,249,250,0.78)] shadow-[0_16px_36px_rgba(76,103,119,0.10)] backdrop-blur-md transition-all duration-500 hover:w-[168px] hover:border-[rgba(28,141,179,0.18)] hover:shadow-[0_18px_34px_rgba(76,103,119,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40 dark:border-white/8 dark:bg-white/6 dark:shadow-[0_16px_36px_rgba(0,0,0,0.18)]'

          const content = (
            <>
              <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-88 group-focus-visible:opacity-88" />
              <span className="absolute inset-x-0 top-[10px] -z-10 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 blur-[18px] transition-all duration-500 group-hover:opacity-20 group-focus-visible:opacity-20" />

              <span className="relative z-10 transition-all duration-500 group-hover:scale-0 group-focus-visible:scale-0">
                <span className="text-[20px] text-[var(--fg)] dark:text-slate-100">{icon}</span>
              </span>

              <span className="absolute scale-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-500 delay-150 group-hover:scale-100 group-focus-visible:scale-100">
                {title}
              </span>
            </>
          )

          return (
            <li key={title} style={style as CSSProperties}>
              {href ? (
                <a
                  className={sharedClassName}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  aria-label={ariaLabel ?? title}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  className={sharedClassName}
                  onClick={onClick}
                  aria-label={ariaLabel ?? title}
                >
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
