import { notFound } from 'next/navigation'
import { getMarketingPage } from '@/lib/marketing'
import MarketingEditor from './MarketingEditor'

export const metadata = { title: 'Edit page | Admin' }
export const dynamic = 'force-dynamic'

export default async function EditMarketingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getMarketingPage(slug)
  if (!page) notFound()
  return <MarketingEditor page={page} />
}
