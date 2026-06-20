import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import CompanyClient from './CompanyClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return MOCK_COMPANIES.map(c => ({ id: c.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const company = MOCK_COMPANIES.find(c => c.id === id)
  if (!company) return { title: 'Company not found' }
  return {
    title: `${company.name} Reviews & Salaries | Waiterstation`,
    description: `Read employee reviews, salary info, and benefits at ${company.name}. ${company.description.slice(0, 120)}...`,
  }
}

export default async function CompanyPage({ params }: Props) {
  const { id } = await params
  const company = MOCK_COMPANIES.find(c => c.id === id)
  if (!company) notFound()

  return (
    <Suspense>
      <CompanyClient company={company} />
    </Suspense>
  )
}
