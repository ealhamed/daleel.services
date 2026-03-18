export interface ServiceCheck {
  text_ar: string
  text_en: string
}

export interface ServiceFee {
  label_ar: string
  label_en?: string
  amount: number
  unit_ar: string
  unit_en?: string
}

export interface ServiceStep {
  text_ar: string
  text_en: string
}

export interface ServiceTrouble {
  question_ar: string
  question_en?: string
  answer_ar: string
  answer_en?: string
}

export interface ServiceData {
  slug: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en?: string
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
  penalty_en?: string
  steps: ServiceStep[]
  troubles: ServiceTrouble[]
  related_slugs: string[]
  last_updated: string
}
