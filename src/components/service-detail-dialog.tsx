import { useEffect, useRef, type KeyboardEvent, type RefObject } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, CreditCard, FileCheck2, FileText, FolderOpen, Gauge, Globe2, Image, LayoutGrid, Link2, Mail, MonitorSmartphone, MousePointer2, Navigation, Package, RefreshCw, Search, Server, Settings2, ShieldCheck, ShoppingBag, UserRound, Wrench, X, type LucideIcon } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import type { ServiceIllustrationKind } from './service-illustrations'
import { serviceDetailHeaders, type ServiceDetailCopy } from './service-detail-data'
import { ProcessAvatar, ServiceDetailScene } from './service-detail-scenes'
import './service-detail-dialog.css'

type ServiceDetailDialogProps = {
  service: { id: ServiceIllustrationKind; title: string } | null
  detail: ServiceDetailCopy | null
  language: Language
  contactHref: string
  onClose: () => void
  openerRef: RefObject<HTMLButtonElement | null>
}

const labels = {
  fr: { close: 'Fermer la prestation', illustrative: 'Ces possibilités sont choisies selon votre projet.' },
  en: { close: 'Close service details', illustrative: 'These options are selected for your project.' },
} satisfies Record<Language, { close: string; illustrative: string }>

const featureIcons: Record<ServiceIllustrationKind, LucideIcon[]> = {
  landing:[FileText,LayoutGrid,ShieldCheck,MousePointer2], showcase:[FileText,Image,Globe2,Mail,Settings2],
  shop:[ShoppingBag,Search,CreditCard,Package,Settings2], webapp:[UserRound,CalendarDays,FolderOpen,ClipboardList],
  business:[FolderOpen,FileCheck2,CalendarDays,ShieldCheck], custom:[LayoutGrid,Navigation,FileText,MonitorSmartphone],
  redesign:[FileText,Navigation,MousePointer2,FolderOpen], features:[CalendarDays,UserRound,FileText,Link2],
  performance:[Image,Server,Gauge,CheckCircle2], fixes:[Mail,MonitorSmartphone,MousePointer2],
  updates:[Search,Settings2,RefreshCw,CheckCircle2], support:[Wrench,RefreshCw,CheckCircle2,Mail],
  hosting:[Globe2,Server,Package,Settings2],
}

const journeyIcons: Record<ServiceIllustrationKind, LucideIcon[]> = {
  landing:[Search,FileText,Mail], showcase:[Search,Image,Mail], shop:[ShoppingBag,CreditCard,Package],
  webapp:[CalendarDays,UserRound,ClipboardList], business:[UserRound,FileCheck2,FolderOpen],
  custom:[Navigation,FileText,CheckCircle2], redesign:[Search,ClipboardList,MonitorSmartphone,CheckCircle2],
  features:[FileText,Search,Settings2,CheckCircle2], performance:[Search,ClipboardList,Settings2,CheckCircle2],
  fixes:[Search,Gauge,Wrench,CheckCircle2], updates:[Search,ClipboardList,RefreshCw,CheckCircle2],
  support:[Mail,CalendarDays,Wrench,FileCheck2], hosting:[FolderOpen,Settings2,Package,CheckCircle2],
}

export function ServiceDetailDialog({ service, detail, language, contactHref, onClose, openerRef }: ServiceDetailDialogProps) {
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
    const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
    const first = focusable[0]
    const last = focusable.at(-1)
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const contactUrl = service ? `${contactHref}?service=${encodeURIComponent(service.id)}` : contactHref
  const scopeItems = detail?.scope.replace(/\.$/, '').split(/, | et | and /) ?? []
  const primaryKinds: ServiceIllustrationKind[] = ['landing','showcase','shop','webapp','business','custom']
  const primaryIndex = service ? primaryKinds.indexOf(service.id) : -1
  const header = service ? serviceDetailHeaders[service.id][language] : null

  return <dialog id="service-detail-dialog" ref={dialogRef} className="service-detail-dialog" aria-labelledby="service-detail-title" aria-describedby="service-detail-intro" onClose={handleClose} onKeyDown={handleKeyDown}>
    {service && detail && <>
      <header className="service-detail-header">
        <div className="service-detail-heading"><span className="service-detail-category">{primaryIndex >= 0 ? `${primaryIndex + 1}. ${service.title}` : detail.category}</span><h2 id="service-detail-title">{primaryIndex >= 0 ? header?.headline : service.title}</h2>{primaryIndex < 0 && <p className="service-detail-lead">{header?.headline}</p>}<p id="service-detail-intro">{header?.summary}</p></div>
        <button ref={closeButtonRef} className="service-detail-close" type="button" onClick={() => dialogRef.current?.close()} aria-label={t.close}><X aria-hidden="true" /></button>
      </header>
      <div className="service-detail-content">
        <ServiceDetailScene kind={service.id} language={language} />
        <div className="service-detail-information">
          <section className="service-detail-features" aria-labelledby="service-detail-features"><h3 id="service-detail-features">{detail.featureLabel}</h3><div className="service-detail-feature-grid">{detail.features.map((item, index) => { const Icon = featureIcons[service.id][index]; return <div className="service-detail-feature" key={item.title}><span className="service-detail-feature-icon"><Icon aria-hidden="true" /></span><div><h4>{item.title}</h4><p>{item.benefit}</p></div></div> })}</div></section>
          <section className="service-detail-journey" aria-labelledby="service-detail-journey"><h3 id="service-detail-journey">{detail.journeyLabel}</h3><ol>{detail.journey.map((step, index) => { const Icon = journeyIcons[service.id][index]; const portrait = ['landing','showcase','shop','webapp','business','custom'].includes(service.id) && index < 2; return <li key={step}><div className="service-detail-step-head"><span className="service-detail-step-number">{index + 1}</span><strong>{step}</strong></div><div className="service-detail-step-visual">{portrait ? <ProcessAvatar kind={index === 0 ? 'woman' : 'man'} /> : <Icon aria-hidden="true" />}</div><p>{detail.journeyDetails[index]}</p>{index < detail.journey.length - 1 && <ArrowRight className="service-detail-step-arrow" aria-hidden="true" />}</li> })}</ol></section>
          <section className="service-detail-scope"><span className="service-detail-scope-icon"><Settings2 aria-hidden="true" /></span><div><h3>{language === 'fr' ? 'À définir ensemble' : 'To define together'}</h3><ul>{scopeItems.map((item) => <li key={item}>{item}</li>)}</ul>{detail.note && <p>{detail.note}</p>}</div></section>
        </div>
        <p className="service-detail-disclaimer">{t.illustrative}</p>
      </div>
      <footer className="service-detail-footer"><a className="home-button home-button-primary" href={contactUrl}>{detail.cta}<ArrowRight aria-hidden="true" /></a></footer>
    </>}
  </dialog>
}
