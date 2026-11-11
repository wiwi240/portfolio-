// Shared by the FAQ page and the home-page preview.
export const faqContent = {
  fr: {
    label: 'Questions fréquentes', title: 'Préparer votre projet', intro: 'Les réponses aux questions les plus courantes avant de commencer.',
    items: [
      ['Comment démarrer un projet ?', 'Prenons contact pour préciser votre besoin, vos objectifs et le contexte.'],
      ['Pouvez-vous améliorer un site existant ?', 'Oui. Une analyse de l’existant permet de définir les améliorations utiles.'],
      ['Comment sont définis le prix et le délai ?', 'Ils sont estimés selon le périmètre et les contraintes du projet.'],
      ['Que prévoir après la livraison ?', 'Les modalités après livraison sont définies dans la prestation convenue.'],
    ],
  },
  en: {
    label: 'Frequently asked questions', title: 'Prepare your project', intro: 'Answers to the most common questions before getting started.',
    items: [
      ['How do we start a project?', 'Get in touch so we can clarify your needs, goals and context.'],
      ['Can you improve an existing website?', 'Yes. Reviewing the existing website helps identify useful improvements.'],
      ['How are price and timing defined?', 'They are estimated according to the scope and constraints of the project.'],
      ['What happens after delivery?', 'Post-delivery arrangements are defined in the agreed service.'],
    ],
  },
} as const
