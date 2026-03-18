import { getAllSlugs, getServiceBySlug, getAllServices } from '@/lib/services'
import ServicePage from '@/components/ServicePage'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceBySlug(params.slug)
  if (!service) return { title: 'غير موجود' }
  return {
    title: `${service.title_ar} — دليل الخدمات الحكومية | ${service.title_en}`,
    description: `${service.description_ar} | ${service.title_en} - steps, fees, requirements.`,
    keywords: `${service.title_ar}, ${service.title_en}, ${service.category_ar}, ${service.ministry_ar}, خدمات حكومية, السعودية, Saudi Arabia`,
    openGraph: {
      title: `${service.title_ar} | Daleel`,
      description: service.description_ar,
      locale: 'ar_SA',
      type: 'article',
    },
  }
}

export default function Page({ params }: Props) {
  const service = getServiceBySlug(params.slug)
  if (!service) notFound()

  const allServices = getAllServices()
  const relatedServices = (service.related_slugs || [])
    .map(slug => allServices.find(s => s.slug === slug))
    .filter(Boolean) as typeof allServices

  // HowTo schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: service.title_ar,
    description: service.description_ar,
    step: service.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.text_ar,
      text: s.text_en,
    })),
    ...(service.fees.length > 0 && service.fees[0].amount > 0 ? {
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'SAR', value: service.fees[0].amount }
    } : {}),
    inLanguage: ['ar', 'en'],
  }

  // FAQ schema from troubleshooting
  const faqSchema = service.troubles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.troubles.map(t => ({
      '@type': 'Question',
      name: t.question_ar,
      acceptedAnswer: {
        '@type': 'Answer',
        text: t.answer_ar,
      }
    }))
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <ServicePage service={service} relatedServices={relatedServices} />
    </>
  )
}
