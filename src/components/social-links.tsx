import { Mail } from 'lucide-react'
import { useId, useState } from 'react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { contactEmail, githubUrl, linkedinUrl, type Language } from '@/data/portfolio-content'

type SocialLinksProps = {
  language: Language
  variant?: 'hero' | 'contact'
}

const socialLinkCopy = {
  fr: {
    emailTitle: 'Afficher mon adresse email',
    copy: 'Copier',
    copied: 'Adresse copiée',
    copyError: 'Copie impossible. Sélectionnez l’adresse pour la copier manuellement.',
    githubTitle: 'Voir mon GitHub',
    linkedinTitle: 'Voir mon LinkedIn',
    emailLabel: 'Afficher l’adresse email de William',
    githubLabel: 'Consulter le profil GitHub de William',
    linkedinLabel: 'Consulter le profil LinkedIn de William',
  },
  en: {
    emailTitle: 'Show my email address',
    copy: 'Copy',
    copied: 'Address copied',
    copyError: 'Unable to copy. Select the address to copy it manually.',
    githubTitle: 'View my GitHub',
    linkedinTitle: 'View my LinkedIn',
    emailLabel: 'Show William’s email address',
    githubLabel: "View William's GitHub profile",
    linkedinLabel: "View William's LinkedIn profile",
  },
} as const

export function SocialLinks({ language, variant = 'hero' }: SocialLinksProps) {
  const labels = socialLinkCopy[language]
  const emailPanelId = useId()
  const [emailVisible, setEmailVisible] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <div className="portfolio-social-group">
      <div className={`portfolio-social-links portfolio-social-links--${variant}`}>
        <button
          type="button"
          className="portfolio-social-link"
          aria-expanded={emailVisible}
          aria-controls={emailPanelId}
          onClick={() => {
            setEmailVisible(!emailVisible)
            setCopyStatus('idle')
          }}
          aria-label={labels.emailLabel}
          title={labels.emailTitle}
        >
          <Mail aria-hidden="true" />
        </button>
        <a
          className="portfolio-social-link"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.githubLabel}
          title={labels.githubTitle}
        >
          <FaGithub aria-hidden="true" />
        </a>
        <a
          className="portfolio-social-link"
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.linkedinLabel}
          title={labels.linkedinTitle}
        >
          <FaLinkedinIn aria-hidden="true" />
        </a>
      </div>
      <div id={emailPanelId} className="portfolio-email-panel" hidden={!emailVisible}>
        <span className="portfolio-email-address">{contactEmail}</span>
        <button type="button" className="portfolio-email-copy" onClick={copyEmail}>
          {labels.copy}
        </button>
        <p className="portfolio-email-feedback" role="status">
          {copyStatus === 'copied' ? labels.copied : copyStatus === 'error' ? labels.copyError : ''}
        </p>
      </div>
    </div>
  )
}
