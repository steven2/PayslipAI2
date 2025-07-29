// Default content structure for typing
export const legalContent = {
  disclaimer: {
    title: "",
    content: ""
  },
  privacy: {
    title: "",
    content: ""
  },
  terms: {
    title: "",
    content: ""
  },
  security: {
    title: "",
    content: ""
  },
  accessibility: {
    title: "",
    content: ""
  }
}

// Helper function to get localized legal content
export const getLocalizedLegalContent = (t: (key: string) => string) => {
  return {
    disclaimer: {
      title: t('legal.disclaimer.title'),
      content: t('legal.disclaimer.content')
    },
    privacy: {
      title: t('legal.privacy.title'),
      content: t('legal.privacy.content')
    },
    terms: {
      title: t('legal.terms.title'),
      content: t('legal.terms.content')
    },
    security: {
      title: t('legal.security.title'),
      content: t('legal.security.content')
    },
    accessibility: {
      title: t('legal.accessibility.title'),
      content: t('legal.accessibility.content')
    }
  }
} 