/**
 * Review moderation
 *
 * Returns 'approved', 'pending', or 'rejected' based on review content.
 *
 * Auto-reject  — clear profanity, threats, doxxing.
 * Auto-pending — borderline: short content, extreme rating patterns, suspicious signals.
 * Auto-approve — everything else.
 */

export type ModerationResult = {
  status: 'approved' | 'pending' | 'rejected'
  reason: string
}

// ── Hard-reject patterns ──────────────────────────────────────────────────────

const PROFANITY = [
  'fuck', 'fucker', 'fucking', 'motherfucker', 'cunt', 'shit', 'shithead',
  'asshole', 'arsehole', 'bastard', 'bitch', 'nigger', 'nigga', 'kaffir',
  'faggot', 'retard', 'whore', 'slut', 'cock', 'dick', 'pussy',
  'poes', 'doos', 'naai', 'hoer', 'moer', 'bliksem',
]

const THREATS = [
  'will kill', 'gonna kill', 'i\'ll kill', "i'll hurt", 'will hurt',
  'burn this place', 'burn it down', 'destroy you', 'expose you',
  'sue you', 'take you to court', 'will report you', 'i know where you live',
  'watch your back', 'you will regret',
]

const DOXXING = [
  /\b\d{10}\b/,                          // phone numbers (10 digits)
  /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/,    // formatted phone
  /\+27\s?\d{9}/,                         // SA mobile
  /\b[A-Z][a-z]+\s[A-Z][a-z]+\b.*?fired/i,  // "John Smith fired" name + fired
]

// ── Soft-flag patterns (→ pending) ───────────────────────────────────────────

const SOFT_FLAGS = [
  /\b(liar|lied|stole|stealing|steal|fraud|fraudulent|corrupt|racism|racist|sexist|sexual harassment|harassment)\b/i,
  /\b(criminal|criminal record|police|arrested|jailed|prison)\b/i,
  /\b(drug|drugs|alcohol|drunk on the job)\b/i,
]

function containsWord(text: string, words: string[]): string | null {
  const lower = text.toLowerCase()
  for (const w of words) {
    // Word boundary check (handles plurals, -ing etc.)
    if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(lower)) {
      return w
    }
  }
  return null
}

function matchesPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some(p => p.test(text))
}

export function moderateReview(opts: {
  pros: string
  cons: string
  role: string
  rating: number
}): ModerationResult {
  const { pros, cons, role, rating } = opts
  const combined = `${pros} ${cons} ${role}`

  // ── Hard reject ──────────────────────────────────────────────────────────
  const profanityHit = containsWord(combined, PROFANITY)
  if (profanityHit) {
    return { status: 'rejected', reason: `Contains profanity: "${profanityHit}"` }
  }

  const threatHit = containsWord(combined, THREATS)
  if (threatHit) {
    return { status: 'rejected', reason: `Contains threatening language: "${threatHit}"` }
  }

  if (matchesPattern(combined, DOXXING)) {
    return { status: 'rejected', reason: 'Contains potential personal information (phone number or identifying details)' }
  }

  // All-caps rage (more than 60% caps in a 20+ char string)
  const letters = combined.replace(/[^a-zA-Z]/g, '')
  if (letters.length > 20) {
    const upperPct = (combined.replace(/[^A-Z]/g, '').length / letters.length) * 100
    if (upperPct > 65) {
      return { status: 'rejected', reason: 'Appears to contain all-caps aggressive text' }
    }
  }

  // ── Send to manual review ────────────────────────────────────────────────
  if (matchesPattern(combined, SOFT_FLAGS)) {
    return { status: 'pending', reason: 'Contains sensitive claims that require admin review' }
  }

  // Very short content — might be low-quality or spam
  if (pros.trim().length < 20 || cons.trim().length < 20) {
    return { status: 'pending', reason: 'Review content is very short — requires admin review for quality' }
  }

  // 1-star with very brief explanation — often fake or venting
  if (rating === 1 && combined.trim().length < 80) {
    return { status: 'pending', reason: '1-star rating with minimal explanation — requires admin review' }
  }

  // 5-star with no substantive cons — could be fake positive
  if (rating === 5 && cons.trim().length < 30) {
    return { status: 'pending', reason: '5-star rating with no meaningful cons — requires admin review' }
  }

  // ── Auto-approve ─────────────────────────────────────────────────────────
  return { status: 'approved', reason: 'Passed automated review' }
}
