import { Mail } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { contactEmail, githubUrl, linkedinUrl, type Language } from '@/data/portfolio-content'

type SocialLinksProps = {
  language: Language
  variant?: 'hero' | 'contact'
}

const socialLinkCopy = {
  fr: {
    emailTitle: 'Envoyer un email',
    githubTitle: 'Voir mon GitHub',
    linkedinTitle: 'Voir mon LinkedIn',
    emailLabel: 'Envoyer un email à William',
    githubLabel: 'Consulter le profil GitHub de William',
    linkedinLabel: 'Consulter le profil LinkedIn de William',
  },
  en: {
    emailTitle: 'Send an email',
    githubTitle: 'View my GitHub',
    linkedinTitle: 'View my LinkedIn',
    emailLabel: 'Send an email to William',
    githubLabel: "View William's GitHub profile",
    linkedinLabel: "View William's LinkedIn profile",
  },
} as const

export function SocialLinks({ language, variant = 'hero' }: SocialLinksProps) {
  const labels = socialLinkCopy[language]

  return (
    <div className={`portfolio-social-links portfolio-social-links--${variant}`}>
      <a
        className="portfolio-social-link"
        href={`mailto:${contactEmail}`}
        aria-label={labels.emailLabel}
        title={labels.emailTitle}
      >
        <Mail aria-hidden="true" />
      </a>
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
  )
}
