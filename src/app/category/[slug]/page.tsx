import { getAllServices } from '@/lib/services'
import { getCategoryAr, getAllCategorySlugs } from '@/lib/categories'
import { CATEGORY_EN } from '@/lib/icons'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryPage from '@/components/CategoryPage'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getAllCategorySlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const catAr = getCategoryAr(params.slug)
  if (!catAr) return { title: 'غير موجود' }
  const catEn = CATEGORY_EN[catAr] || params.slug
  return {
    title: `${catAr} — دليل الخدمات الحكومية | ${catEn}`,
    description: `دليل شامل لجميع ${catAr} الإلكترونية في المملكة العربية السعودية. خطوات، رسوم، ومتطلبات. Complete guide to ${catEn} in Saudi Arabia.`,
  }
}

export default function Page({ params }: Props) {
  const catAr = getCategoryAr(params.slug)
  if (!catAr) notFound()
  const services = getAllServices().filter(s => s.category_ar === catAr)
  if (services.length === 0) notFound()
  const catEn = CATEGORY_EN[catAr] || params.slug
  return <CategoryPage services={services} categoryAr={catAr} categoryEn={catEn} slug={params.slug} />
}
