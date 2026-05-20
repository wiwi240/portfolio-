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
            'group relative flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/6 shadow-[0_18px_40px_rgba(3,7,14,0.16)] backdrop-blur-sm transition-all duration-500 hover:w-[180px] hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60'

          const content = (
            <>
              <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="absolute inset-x-0 top-[10px] -z-10 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 blur-[18px] transition-all duration-500 group-hover:opacity-45 group-focus-visible:opacity-45" />

              <span className="relative z-10 transition-all duration-500 group-hover:scale-0 group-focus-visible:scale-0">
                <span className="text-[22px] text-slate-100">{icon}</span>
              </span>

              <span className="absolute scale-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-500 delay-150 group-hover:scale-100 group-focus-visible:scale-100">
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
