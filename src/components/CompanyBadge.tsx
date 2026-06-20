const COLORS = [
  'bg-orange-100 text-orange-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-800',
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
]

function colorFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return COLORS[hash % COLORS.length]
}

export default function CompanyBadge({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const letter = name.trim().charAt(0).toUpperCase()
  const color = colorFor(name)

  const dim =
    size === 'sm' ? 'w-9 h-9 text-xs' :
    size === 'lg' ? 'w-14 h-14 text-xl' :
    'w-11 h-11 text-sm'

  return (
    <div className={`${dim} ${color} rounded-lg flex items-center justify-center font-semibold shrink-0`}>
      {letter}
    </div>
  )
}
