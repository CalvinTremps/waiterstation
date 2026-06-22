import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, getSession } from '@/lib/supabase-server'

interface WorkerProfile {
  id: string
  name: string
  role_category: string | null
  location: string | null
  experience_summary: string | null
  availability: string | null
  certifications: string | null
  phone?: string | null
}

function scoreCandidate(profile: WorkerProfile, role: string, location: string): number {
  const hasRole = role.length > 0
  const hasLoc = location.length > 0

  let score = 0
  let max = 0

  if (hasRole) {
    max += 5
    if (profile.role_category === role) score += 5
  }

  if (hasLoc) {
    max += 3
    const candidateLoc = (profile.location ?? '').toLowerCase()
    const searchLoc = location.toLowerCase()
    const candidateCity = candidateLoc.split(',')[0].trim()
    const candidateProvince = candidateLoc.split(',')[1]?.trim() ?? ''
    if (candidateLoc.includes(searchLoc) || searchLoc.includes(candidateCity)) {
      score += 3
    } else if (candidateProvince && (searchLoc.includes(candidateProvince) || candidateProvince.includes(searchLoc))) {
      score += 1
    }
  }

  max += 1
  const avail = (profile.availability ?? '').toLowerCase()
  if (avail.includes('immediately') || avail.includes('1 week')) score += 1

  max += 1
  if (profile.experience_summary || profile.certifications) score += 1

  if (max === 0) return 5
  return Math.max(1, Math.round((score / max) * 10))
}

const MOCK_CANDIDATES: WorkerProfile[] = [
  { id: 'mock-1', name: 'Thabo Nkosi', role_category: 'waiter', location: 'Cape Town, Mitchells Plain', experience_summary: '5 years fine dining at Shortmarket Club and Norval Foundation', availability: 'Available immediately', certifications: 'WSET Level 2, Food Handlers Certificate' },
  { id: 'mock-2', name: 'Aisha Petersen', role_category: 'bartender', location: 'Cape Town, Claremont', experience_summary: '3 years cocktail bartending at Bascule Bar and Cause & Effect', availability: 'Available in 2 weeks', certifications: 'Flair Certificate, Responsible Service of Alcohol' },
  { id: 'mock-3', name: 'Sipho Dlamini', role_category: 'chef', location: 'Johannesburg, Sandton', experience_summary: '7 years in professional kitchens, specialising in modern African cuisine', availability: 'Available immediately', certifications: 'Food Handlers Certificate, HACCP' },
  { id: 'mock-4', name: 'Nomsa Vilakazi', role_category: 'manager', location: 'Johannesburg, Rosebank', experience_summary: '4 years floor management at upscale restaurants in Sandton', availability: 'Available in 1 month', certifications: 'WSET Level 1, First Aid' },
  { id: 'mock-5', name: 'Ruan Jacobs', role_category: 'barista', location: 'Cape Town, Sea Point', experience_summary: '2 years specialty coffee at Truth Coffee and Rosetta Roastery', availability: 'Available in 1 week', certifications: null },
  { id: 'mock-6', name: 'Zanele Mokoena', role_category: 'waiter', location: 'Cape Town, Woodstock', experience_summary: '3 years in fine dining and wine estate restaurants', availability: 'Available immediately', certifications: 'WSET Level 1, Food Handlers Certificate' },
  { id: 'mock-7', name: 'Pieter van der Berg', role_category: 'chef', location: 'Stellenbosch, Western Cape', experience_summary: 'Pastry chef with 5 years at La Petite Ferme and Tokara', availability: 'Available in 2 weeks', certifications: 'Food Handlers Certificate' },
  { id: 'mock-8', name: 'Fatima Essop', role_category: 'front_desk', location: 'Cape Town, V&A Waterfront', experience_summary: '4 years front desk at One&Only and Radisson Blu', availability: 'Available immediately', certifications: 'First Aid' },
  { id: 'mock-9', name: 'Lungelo Khumalo', role_category: 'waiter', location: 'Durban, Umhlanga', experience_summary: '2 years at Oyster Box Hotel and Cafe Fish', availability: 'Available in 1 week', certifications: null },
  { id: 'mock-10', name: 'Jessica Louw', role_category: 'bartender', location: 'Cape Town, Green Point', experience_summary: '4 years cocktail and wine bar experience at upmarket venues', availability: 'Available immediately', certifications: 'WSET Level 2, Responsible Service of Alcohol' },
]

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') ?? ''
  const location = searchParams.get('location') ?? ''

  const supabase = await createServerClient()
  const { data } = await supabase
    .from('worker_profiles')
    .select('id, name, role_category, location, experience_summary, availability, certifications')
    .limit(50)

  const realCandidates: WorkerProfile[] = data ?? []

  // Merge real candidates with mock ones (by id, real takes precedence)
  const realIds = new Set(realCandidates.map(c => c.id))
  const combined = [...realCandidates, ...MOCK_CANDIDATES.filter(m => !realIds.has(m.id))]

  const scored = combined
    .map(p => ({ ...p, score: scoreCandidate(p, role, location) }))
    .filter(p => {
      // If role filter set, only return candidates who score > 0 on role
      if (role && p.role_category !== role) {
        // Still include with low score if they have location match
        if (location) {
          const loc = (p.location ?? '').toLowerCase()
          if (!loc.includes(location.toLowerCase())) return false
        } else {
          return false
        }
      }
      return true
    })
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({ candidates: scored })
}
