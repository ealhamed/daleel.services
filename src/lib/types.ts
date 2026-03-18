export interface ServiceCheck {
  text_ar: string
  text_en: string
}

export interface ServiceFee {
  label_ar: string
  amount: number
  unit_ar: string
}

export interface ServiceStep {
  text_ar: string
  text_en: string
}

export interface ServiceTrouble {
  question_ar: string
  answer_ar: string
}

export interface ServiceData {
  slug: string
  title_ar: string
  title_en: string
  description_ar: string
  portal: string
  portal_url: string
  tags: { text_ar: string; type: 'info' | 'success' | 'warning' }[]
  ministry_ar: string
  ministry_en: string
  category_ar: string
  category_en: string
  checks: ServiceCheck[]
  fees: ServiceFee[]
  penalty_ar?: string
  steps: ServiceStep[]
  troubles: ServiceTrouble[]
  related_slugs: string[]
  last_updated: string
}
