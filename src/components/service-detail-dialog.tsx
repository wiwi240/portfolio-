import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ArrowRight, X } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'

export type ServiceDetailCopy = {
  needs: string
  examples: string[]
  scope: string
}

type ServiceDetailDialogProps = {
  service: { title: string } | null
  detail: ServiceDetailCopy | null
  language: Language
  contactHref: string
  scopeNote: string
  onClose: () => void
  openerRef: React.RefObject<HTMLButtonElement | null>
}

const labels = {
  fr: { close: 'Fermer', needs: 'Besoins couverts', examples: 'Exemples concrets', scope: 'Selon le périmètre convenu', contact: 'Discuter de ce besoin' },
  en: { close: 'Close', needs: 'Needs addressed', examples: 'Examples', scope: 'Depending on the agreed scope', contact: 'Discuss this need' },
} satisfies Record<Language, Record<string, string>>

export function ServiceDetailDialog({ service, detail, language, contactHref, scopeNote, onClose, openerRef }: ServiceDetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const t = labels[language]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow

    if (service) {
      if (!dialog.open) dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      closeButtonRef.current?.focus()
    } else if (dialog.open) {
      dialog.close()
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [service])

  function handleClose() {
    onClose()
    requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const dialog = event.currentTarget
    const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    const first = focusable[0]
    const last = focusable.at(-1)
    if (!first || !last) return

    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault()
      first.focus()
    }
  }

  return <dialog id="service-detail-dialog" ref={dialogRef} className="service-detail-dialog" aria-modal="true" aria-labelledby="service-detail-title" onClose={handleClose} onKeyDown={handleKeyDown}>
    {service && detail && <>
      <header className="service-detail-header">
        <h2 id="service-detail-title">{service.title}</h2>
        <button ref={closeButtonRef} className="service-detail-close" type="button" onClick={() => dialogRef.current?.close()} aria-label={t.close}>
          <X aria-hidden="true" />
        </button>
      </header>
      <div className="service-detail-content">
        <section aria-labelledby="service-detail-needs"><h3 id="service-detail-needs">{t.needs}</h3><p>{detail.needs}</p></section>
        <section aria-labelledby="service-detail-examples"><h3 id="service-detail-examples">{t.examples}</h3><ul>{detail.examples.map((example) => <li key={example}>{example}</li>)}</ul></section>
        <section aria-labelledby="service-detail-scope"><h3 id="service-detail-scope">{t.scope}</h3><p>{detail.scope}</p><p className="service-detail-scope-note">{scopeNote}</p></section>
      </div>
      <footer className="service-detail-footer">
        <a className="home-button home-button-primary" href={contactHref}>{t.contact}<ArrowRight aria-hidden="true" /></a>
      </footer>
    </>}
  </dialog>
}
