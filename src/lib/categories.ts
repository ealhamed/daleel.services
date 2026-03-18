import { CATEGORY_EN } from './icons'

// Create URL-safe slugs from Arabic category names
const CATEGORY_SLUGS: Record<string, string> = {
  'خدمات الجوازات': 'passport-services',
  'خدمات المرور': 'traffic-services',
  'خدمات العمل': 'labor-services',
  'خدمات تجارية': 'business-services',
  'خدمات عامة': 'general-services',
  'خدمات التأمينات': 'insurance-services',
  'خدمات التأشيرات': 'visa-services',
  'خدمات الأحوال المدنية': 'civil-affairs',
  'خدمات العمالة المنزلية': 'domestic-workers',
  'خدمات ضريبية': 'tax-services',
  'خدمات عدلية': 'justice-services',
  'خدمات الإسكان': 'housing-services',
  'خدمات صحية': 'health-services',
  'خدمات تعليمية': 'education-services',
  'خدمات الحج والعمرة': 'hajj-umrah-services',
}

const REVERSE_SLUGS: Record<string, string> = {}
Object.entries(CATEGORY_SLUGS).forEach(([ar, en]) => { REVERSE_SLUGS[en] = ar })

export function getCategorySlug(categoryAr: string): string {
  return CATEGORY_SLUGS[categoryAr] || categoryAr.replace(/\s/g, '-')
}

export function getCategoryAr(slug: string): string | null {
  return REVERSE_SLUGS[slug] || null
}

export function getAllCategorySlugs(): string[] {
  return Object.values(CATEGORY_SLUGS)
}

export { CATEGORY_SLUGS }
