import { useState } from 'react'
import { ArrowRight, Check, FileDown, Mail, Plus, Send, Trash2 } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import './preview-management-pages.css'

// Ten back-office pages of the mockup. Each one is a tiny working demo with local state only:
// nothing is sent or stored. Used by the preview when one of these features is chosen.
const tr = (language: Language, fr: string, en: string) => (language === 'fr' ? fr : en)


type Props = { id: string; language: Language; description?: string }

export function ManagementPage({ id, language, description }: Props) {
  const body = (() => {
    switch (id) {
      case 'caseManagement': return <Cases language={language} />
      case 'quotesDocuments': return <Quotes language={language} />
      case 'roles': return <Roles language={language} />
      case 'statuses': return <Statuses language={language} />
      case 'editTexts': return <EditTexts language={language} />
      case 'editImages': return <EditImages language={language} />
      case 'manageOffers': return <Offers language={language} />
      case 'publishNews': return <News language={language} />
      case 'multilingual': return <Languages language={language} />
      case 'administrators': return <Admins language={language} />
      default: return null
    }
  })()
  return (
    <div className="psp-mp">
      {description && <p className="psp-mp-lead">{description}</p>}
      {body}
    </div>
  )
}

/* 1. Cases: columns by status, a button moves a card forward */
function Cases({ language }: { language: Language }) {
  const columns = [tr(language, 'Nouveau', 'New'), tr(language, 'En cours', 'In progress'), tr(language, 'Terminé', 'Done')]
  const [cards, setCards] = useState([
    { name: tr(language, 'Dossier Martin', 'Martin case'), col: 0 },
    { name: tr(language, 'Dossier Leroy', 'Leroy case'), col: 0 },
    { name: tr(language, 'Dossier Bernard', 'Bernard case'), col: 1 },
    { name: tr(language, 'Dossier Petit', 'Petit case'), col: 2 },
  ])
  const advance = (index: number) => setCards((list) => list.map((card, i) => (i === index ? { ...card, col: Math.min(card.col + 1, 2) } : card)))
  return (
    <div className="psp-mp-kanban">
      {columns.map((label, col) => (
        <section key={label} aria-label={label}>
          <h4>
            {label} <span>{cards.filter((card) => card.col === col).length}</span>
          </h4>
          {cards.map((card, index) => card.col === col && (
            <article key={card.name}>
              <strong>{card.name}</strong>
              {col < 2 ? (
                <button type="button" onClick={() => advance(index)} aria-label={tr(language, `Faire avancer ${card.name}`, `Move ${card.name} forward`)}>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <Check size={16} />
              )}
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}

/* 2. Quotes: status chips and a simulated PDF */
function Quotes({ language }: { language: Language }) {
  const steps = [tr(language, 'Brouillon', 'Draft'), tr(language, 'Envoyé', 'Sent'), tr(language, 'Accepté', 'Accepted')]
  const [quotes, setQuotes] = useState([
    { ref: 'D-2026-014', client: 'Atelier Lumière', amount: '1 850 €', step: 0 },
    { ref: 'D-2026-013', client: 'Studio Nova', amount: '3 200 €', step: 1 },
    { ref: 'D-2026-012', client: 'Maison Roche', amount: '940 €', step: 2 },
  ])
  const [note, setNote] = useState('')
  const next = (index: number) => setQuotes((list) => list.map((quote, i) => (i === index ? { ...quote, step: Math.min(quote.step + 1, 2) } : quote)))
  return (
    <div className="psp-mp-card">
      <ul className="psp-mp-rows">
        {quotes.map((quote, index) => (
          <li key={quote.ref}>
            <span>
              <strong>{quote.ref}</strong>
              <small>{quote.client}</small>
            </span>
            <b>{quote.amount}</b>
            <i className={`psp-mp-chip step-${quote.step}`}>{steps[quote.step]}</i>
            <span className="psp-mp-actions">
              {quote.step < 2 && (
                <button type="button" onClick={() => next(index)}>
                  <Send size={14} /> {quote.step === 0 ? tr(language, 'Envoyer', 'Send') : tr(language, 'Marquer accepté', 'Mark accepted')}
                </button>
              )}
              <button type="button" onClick={() => setNote(tr(language, `PDF du devis ${quote.ref} généré (simulation).`, `PDF for quote ${quote.ref} generated (simulation).`))}>
                <FileDown size={14} /> PDF
              </button>
            </span>
          </li>
        ))}
      </ul>
      {note && <p className="psp-mp-note" role="status">{note}</p>}
    </div>
  )
}

/* 3. Roles: permission matrix */
function Roles({ language }: { language: Language }) {
  const roles = [tr(language, 'Administrateur', 'Administrator'), tr(language, 'Équipe', 'Team'), tr(language, 'Client', 'Client')]
  const rights = [tr(language, 'Voir', 'View'), tr(language, 'Modifier', 'Edit'), tr(language, 'Supprimer', 'Delete'), tr(language, 'Exporter', 'Export')]
  const [grid, setGrid] = useState([
    [true, true, true, true],
    [true, true, false, false],
    [true, false, false, false],
  ])
  const toggle = (r: number, c: number) => setGrid((g) => g.map((row, i) => (i === r ? row.map((v, j) => (j === c ? !v : v)) : row)))
  return (
    <div className="psp-mp-card">
      <table className="psp-mp-matrix">
        <thead>
          <tr>
            <th />
            {rights.map((right) => <th key={right}>{right}</th>)}
          </tr>
        </thead>
        <tbody>
          {roles.map((role, r) => (
            <tr key={role}>
              <th scope="row">{role}</th>
              {rights.map((right, c) => (
                <td key={right}>
                  <input type="checkbox" checked={grid[r][c]} onChange={() => toggle(r, c)} aria-label={`${role} : ${right}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="psp-mp-note">
        {tr(language, `${grid.flat().filter(Boolean).length} droits accordés sur ${grid.flat().length}.`, `${grid.flat().filter(Boolean).length} of ${grid.flat().length} permissions granted.`)}
      </p>
    </div>
  )
}

/* 4. Statuses: rename, reorder, add */
const statusColors = ['#0866e8', '#00a6c8', '#f2a30f', '#17a673', '#8b5cf6']
function Statuses({ language }: { language: Language }) {
  const [list, setList] = useState([tr(language, 'Nouveau', 'New'), tr(language, 'En cours', 'In progress'), tr(language, 'À valider', 'To approve'), tr(language, 'Terminé', 'Done')])
  const move = (i: number, d: number) => setList((l) => { const n = [...l]; const j = i + d; if (j < 0 || j >= n.length) return l; [n[i], n[j]] = [n[j], n[i]]; return n })
  return (
    <div className="psp-mp-card">
      <ol className="psp-mp-statuses">
        {list.map((name, i) => (
          <li key={i}>
            <span className="psp-mp-dot" style={{ background: statusColors[i % statusColors.length] }} />
            <input value={name} onChange={(e) => setList((l) => l.map((v, j) => (j === i ? e.target.value : v)))} aria-label={tr(language, `Nom du statut ${i + 1}`, `Status ${i + 1} name`)} />
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={tr(language, 'Monter', 'Move up')}>↑</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={tr(language, 'Descendre', 'Move down')}>↓</button>
            <button type="button" onClick={() => setList((l) => l.filter((_, j) => j !== i))} disabled={list.length <= 2} aria-label={tr(language, 'Supprimer', 'Delete')}><Trash2 size={14} /></button>
          </li>
        ))}
      </ol>
      <button type="button" className="psp-mp-add" onClick={() => setList((l) => [...l, tr(language, 'Nouveau statut', 'New status')])} disabled={list.length >= 6}>
        <Plus size={15} /> {tr(language, 'Ajouter un statut', 'Add a status')}
      </button>
      <div className="psp-mp-pipeline" aria-hidden="true">
        {list.map((name, i) => <span key={i} style={{ background: statusColors[i % statusColors.length] }}>{name}</span>)}
      </div>
    </div>
  )
}

/* 5. Edit texts: live preview */
function EditTexts({ language }: { language: Language }) {
  const [title, setTitle] = useState(tr(language, 'Une activité à découvrir', 'A business to discover'))
  const [text, setText] = useState(tr(language, 'Découvrez notre savoir-faire et imaginons ensemble la suite.', 'Discover our work and let us imagine what comes next.'))
  return (
    <div className="psp-mp-split">
      <div className="psp-mp-card psp-mp-form">
        <label>{tr(language, 'Titre', 'Title')}<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>{tr(language, 'Texte', 'Text')}<textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} /></label>
      </div>
      <div className="psp-mp-card psp-mp-live" aria-live="polite">
        <small>{tr(language, 'Aperçu en direct', 'Live preview')}</small>
        <h4>{title || '…'}</h4>
        <p>{text || '…'}</p>
        <span className="psp-mp-button">{tr(language, 'Parlons de votre projet', 'Let’s talk')}</span>
      </div>
    </div>
  )
}

/* 6. Edit images: replace and compare */
const gradients = ['linear-gradient(135deg,#0866e8,#00bdeb)', 'linear-gradient(135deg,#6d5bf0,#0866e8)', 'linear-gradient(135deg,#00a6c8,#5be0c4)', 'linear-gradient(135deg,#f2a30f,#f06a4d)']
function EditImages({ language }: { language: Language }) {
  const [slots, setSlots] = useState([0, 1, 2])
  const [changed, setChanged] = useState<number[]>([])
  const replace = (i: number) => { setSlots((s) => s.map((v, j) => (j === i ? (v + 1) % gradients.length : v))); setChanged((c) => (c.includes(i) ? c : [...c, i])) }
  return (
    <div className="psp-mp-card">
      <div className="psp-mp-images">
        {slots.map((g, i) => (
          <figure key={i}>
            <div style={{ background: gradients[g] }}>{changed.includes(i) && <em>{tr(language, 'Modifiée', 'Updated')}</em>}</div>
            <button type="button" onClick={() => replace(i)}>{tr(language, 'Remplacer l’image', 'Replace image')}</button>
          </figure>
        ))}
      </div>
      <p className="psp-mp-note">{tr(language, `${changed.length} image(s) modifiée(s) : le site se met à jour sans développeur.`, `${changed.length} image(s) updated: the site updates without a developer.`)}</p>
    </div>
  )
}

/* 7. Offers: visibility switches + preview of what visitors see */
function Offers({ language }: { language: Language }) {
  const [offers, setOffers] = useState([
    { name: tr(language, 'Offre de bienvenue', 'Welcome offer'), price: '-10 %', on: true },
    { name: tr(language, 'Pack découverte', 'Starter pack'), price: '49 €', on: true },
    { name: tr(language, 'Offre de saison', 'Seasonal offer'), price: '79 €', on: false },
  ])
  const visible = offers.filter((o) => o.on)
  return (
    <div className="psp-mp-split">
      <div className="psp-mp-card">
        <ul className="psp-mp-rows">
          {offers.map((offer, i) => (
            <li key={offer.name}>
              <span><strong>{offer.name}</strong><small>{offer.price}</small></span>
              <button type="button" role="switch" aria-checked={offer.on} className="psp-mp-switch" onClick={() => setOffers((l) => l.map((o, j) => (j === i ? { ...o, on: !o.on } : o)))}>
                <span className="sr-only">{tr(language, 'Visible sur le site', 'Visible on the site')}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="psp-mp-card psp-mp-live" aria-live="polite">
        <small>{tr(language, 'Ce que voient les visiteurs', 'What visitors see')}</small>
        {visible.length === 0 ? <p>{tr(language, 'Aucune offre affichée.', 'No offer shown.')}</p> : visible.map((o) => <div className="psp-mp-offer" key={o.name}><strong>{o.name}</strong><b>{o.price}</b></div>)}
      </div>
    </div>
  )
}

/* 8. News: publish adds the article to the list */
function News({ language }: { language: Language }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [posts, setPosts] = useState([{ title: tr(language, 'Ouverture de la saison', 'Season opening'), date: tr(language, 'Il y a 3 jours', '3 days ago') }])
  const publish = () => {
    if (!title.trim()) return
    setPosts((p) => [{ title: title.trim(), date: tr(language, 'À l’instant', 'Just now') }, ...p])
    setTitle(''); setText('')
  }
  return (
    <div className="psp-mp-split">
      <div className="psp-mp-card psp-mp-form">
        <label>{tr(language, 'Titre de l’actualité', 'News title')}<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={tr(language, 'Ex. Nouveau service disponible', 'E.g. New service available')} /></label>
        <label>{tr(language, 'Texte', 'Text')}<textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} /></label>
        <button type="button" className="psp-mp-button" onClick={publish} disabled={!title.trim()}><Send size={14} /> {tr(language, 'Publier', 'Publish')}</button>
      </div>
      <div className="psp-mp-card psp-mp-live" aria-live="polite">
        <small>{tr(language, 'Publié sur le site', 'Published on the site')}</small>
        {posts.map((post, i) => <div className="psp-mp-post" key={i}><strong>{post.title}</strong><span>{post.date}</span></div>)}
      </div>
    </div>
  )
}

/* 9. Languages: the sample text really switches */
function Languages({ language }: { language: Language }) {
  const [lang, setLang] = useState<Language>(language)
  const sample = { fr: { t: 'Bienvenue chez nous', p: 'Découvrez nos services et contactez-nous.', b: 'Nous contacter' }, en: { t: 'Welcome', p: 'Discover our services and get in touch.', b: 'Contact us' } }[lang]
  return (
    <div className="psp-mp-split">
      <div className="psp-mp-card">
        <ul className="psp-mp-rows">
          {(['fr', 'en'] as const).map((l) => (
            <li key={l}>
              <span><strong>{l === 'fr' ? 'Français' : 'English'}</strong><small>{tr(language, 'Traduit à 100 %', '100% translated')}</small></span>
              <button type="button" aria-pressed={lang === l} className="psp-mp-pill" onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="psp-mp-card psp-mp-live" aria-live="polite" lang={lang}>
        <small>{tr(language, 'Aperçu du site', 'Site preview')} · {lang.toUpperCase()}</small>
        <h4>{sample.t}</h4>
        <p>{sample.p}</p>
        <span className="psp-mp-button">{sample.b}</span>
      </div>
    </div>
  )
}

/* 10. Administrators: invite by email */
function Admins({ language }: { language: Language }) {
  const [email, setEmail] = useState('')
  const [admins, setAdmins] = useState([
    { name: 'Camille Durand', email: 'camille@exemple.fr', pending: false },
    { name: 'Hugo Martin', email: 'hugo@exemple.fr', pending: false },
  ])
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const invite = () => { if (!valid) return; setAdmins((a) => [...a, { name: email.split('@')[0], email: email.trim(), pending: true }]); setEmail('') }
  return (
    <div className="psp-mp-card">
      <ul className="psp-mp-rows">
        {admins.map((admin) => (
          <li key={admin.email}>
            <span className="psp-mp-avatar" aria-hidden="true">{admin.name[0].toUpperCase()}</span>
            <span><strong>{admin.name}</strong><small>{admin.email}</small></span>
            <i className={`psp-mp-chip step-${admin.pending ? 1 : 2}`}>{admin.pending ? tr(language, 'Invitation envoyée', 'Invitation sent') : tr(language, 'Actif', 'Active')}</i>
          </li>
        ))}
      </ul>
      <div className="psp-mp-invite">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tr(language, 'email@exemple.fr', 'email@example.com')} aria-label={tr(language, 'Email à inviter', 'Email to invite')} />
        <button type="button" className="psp-mp-button" onClick={invite} disabled={!valid}><Mail size={14} /> {tr(language, 'Inviter', 'Invite')}</button>
      </div>
    </div>
  )
}
