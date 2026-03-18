import { getAllServices } from '@/lib/services'
import HomePage from '@/components/HomePage'

export default function Page() {
  const services = getAllServices()
  return <HomePage services={services} />
}
