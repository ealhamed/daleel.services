import { ServiceData } from './types'
import fs from 'fs'
import path from 'path'

const SERVICES_DIR = path.join(process.cwd(), 'src/data/services')

export function getAllServices(): ServiceData[] {
  const files = fs.readdirSync(SERVICES_DIR).filter(f => f.endsWith('.json'))
  return files.map(f => {
    const raw = fs.readFileSync(path.join(SERVICES_DIR, f), 'utf-8')
    return JSON.parse(raw) as ServiceData
  })
}

export function getServiceBySlug(slug: string): ServiceData | null {
  const services = getAllServices()
  return services.find(s => s.slug === slug) || null
}

export function getAllSlugs(): string[] {
  return getAllServices().map(s => s.slug)
}
