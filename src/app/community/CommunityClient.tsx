'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { MOCK_COMMUNITY_POSTS, COMMUNITY_BOWLS, CommunityPost } from '@/lib/mock-community'
import SalaryExplorer from '@/components/SalaryExplorer'
import { Icon } from '@/components/Icon'

/* ─── Per-category colour identity ───────────────────────── */
type BowlStyle = { chip: string; bar: string; avatar: string; dot: string; soft: string; border: string }
const BOWL_STYLES: Record<string, BowlStyle> = {
  'Salary Talk':     { chip: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-400', avatar: 'from-emerald-400 to-teal-500',  dot: 'text-emerald-500', soft: 'group-hover:border-emerald-200', border: 'border-emerald-200' },
  'Interview Tips':  { chip: 'bg-blue-50 text-blue-700',       bar: 'bg-blue-400',    avatar: 'from-blue-400 to-indigo-500',   dot: 'text-blue-500',    soft: 'group-hover:border-blue-200',    border: 'border-blue-200' },
  'Work Stories':    { chip: 'bg-amber-50 text-amber-700',     bar: 'bg-amber-400',   avatar: 'from-amber-400 to-orange-500',  dot: 'text-amber-500',   soft: 'group-hover:border-amber-200',   border: 'border-amber-200' },
  'Industry News':   { chip: 'bg-violet-50 text-violet-700',   bar: 'bg-violet-400',  avatar: 'from-violet-400 to-purple-500', dot: 'text-violet-500',  soft: 'group-hover:border-violet-200',  border: 'border-violet-200' },
  'Career Advice':   { chip: 'bg-rose-50 text-rose-700',       bar: 'bg-rose-400',    avatar: 'from-rose-400 to-pink-500',     dot: 'text-rose-500',    soft: 'group-hover:border-rose-200',    border: 'border-rose-200' },
  'Management Talk': { chip: 'bg-indigo-50 text-indigo-700',   bar: 'bg-indigo-400',  avatar: 'from-indigo-400 to-blue-500',   dot: 'text-indigo-500',  soft: 'group-hover:border-indigo-200',  border: 'border-indigo-200' },
}
const DEFAULT_STYLE: BowlStyle = { chip: 'bg-gray-100 text-gray-600', bar: 'bg-gray-300', avatar: 'from-gray-400 to-gray-500', dot: 'text-gray-400', soft: 'group-hover:border-gray-300', border: 'border-gray-200' }
const bowlStyle = (label: string): BowlStyle => BOWL_STYLES[label] ?? DEFAULT_STYLE

/* ─── Avatar ─────────────────────────────────────────────── */
function AvatarCircle({ letter, size = 'md', gradient }: { letter: string; size?: 'sm' | 'md' | 'lg'; gradient?: string }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }
  return (
    <div className={`${sizes[size]} rounded-full font-bold flex items-center justify-center shrink-0 ${
      gradient ? `bg-gradient-to-br ${gradient} text-white shadow-sm` : 'bg-gray-200 text-gray-600'
    }`}>
      {letter}
    </div>
  )
}

/* ─── Mock replies pool ───────────────────────────────────── */
interface Reply {
  id: string
  letter: string
  role: string
  time: string
  content: string
  likes: number
  liked?: boolean
}

const REPLY_POOL: Omit<Reply, 'id'>[] = [
  { letter: 'M', role: 'Head Waiter · Camps Bay', time: '1h ago', content: 'Completely agree. V&A tourist season is something else. I\'ve had single tables where the tip covered half my week\'s base pay.', likes: 18 },
  { letter: 'T', role: 'Bartender · Sandton', time: '2h ago', content: 'Joburg is more corporate though — consistent 12-hour shifts and stable income year-round. Cape Town is feast or famine depending on season.', likes: 11 },
  { letter: 'A', role: 'Restaurant Manager · Cape Town', time: '3h ago', content: 'What I\'d tell anyone: come for summer, stay for the lifestyle. Just make sure you have three months\' savings before the June–August slow period.', likes: 24 },
  { letter: 'N', role: 'Waitress · Johannesburg', time: '4h ago', content: 'Moved two years ago. Best decision I ever made. Monthly earnings up by about 40%. English-friendly areas and the food scene is incredible.', likes: 31 },
  { letter: 'R', role: 'Senior Waiter · Durban', time: '5h ago', content: 'Durban is also worth considering. Umhlanga summer season is underrated and less saturated than Cape Town. Lower cost of living too.', likes: 8 },
  { letter: 'B', role: 'Chef de Partie · Cape Town', time: '6h ago', content: 'Fine dining scene here is incredibly competitive. If you\'re a chef wanting to level up, there\'s no better city in SA right now.', likes: 15 },
  { letter: 'P', role: 'Hospitality Graduate · Stellenbosch', time: '7h ago', content: 'Wine estates around Stellenbosch often include accommodation for seasonal staff. Worth looking into if you\'re weighing the move.', likes: 9 },
  { letter: 'C', role: 'Front Desk · Cape Town CBD', time: '8h ago', content: 'Hotels are year-round here unlike F&B. If the seasonal income drop scares you, get into city-bowl hotels first to build savings.', likes: 13 },
  { letter: 'L', role: 'Floor Manager · V&A Waterfront', time: '9h ago', content: 'The V&A is its own world. On a good December night I\'ve seen junior waiters walk out with R1 200 in tips alone. The tourist market is real.', likes: 37 },
  { letter: 'S', role: 'Sommelier · Franschhoek', time: '10h ago', content: 'For wine service roles specifically — Franschhoek estates will train you if you show genuine passion. Better long-term career growth than city restaurants.', likes: 22 },
  { letter: 'D', role: 'Duty Manager · Sandton', time: '11h ago', content: 'Management track is faster in Joburg. The volume of corporate events means you can progress to supervisor in 18 months if you work the right venues.', likes: 14 },
  { letter: 'G', role: 'Barista · Woodstock', time: '12h ago', content: 'Cape Town specialty coffee scene is elite. If you\'re a barista, this city will push your standards. Competition entry culture is massive here.', likes: 19 },
]

function getMockReplies(postId: string, count: number): Reply[] {
  let hash = 0
  for (let i = 0; i < postId.length; i++) hash = (hash * 31 + postId.charCodeAt(i)) & 0x7fffffff
  const result: Reply[] = []
  for (let i = 0; i < count; i++) {
    const r = REPLY_POOL[(hash + i) % REPLY_POOL.length]
    result.push({ ...r, id: `${postId}-r${i}`, liked: false })
  }
  return result
}

/* ─── Post Thread Overlay ────────────────────────────────── */
function PostThread({ post, onClose }: { post: CommunityPost; onClose: () => void }) {
  const replyCount = Math.max(post.comments, 3)
  const [replies, setReplies] = useState<Reply[]>(() => getMockReplies(post.id, Math.min(replyCount, 8)))
  const [comment, setComment] = useState('')
  const [postLiked, setPostLiked] = useState(false)
  const [postLikes, setPostLikes] = useState(post.likes)
  const [visible, setVisible] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Trigger enter animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  function handleLikeReply(id: string) {
    setReplies(rs => rs.map(r => r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r))
  }

  function handleSubmitComment() {
    if (!comment.trim()) return
    const newReply: Reply = {
      id: `local-${Date.now()}`,
      letter: 'Y',
      role: 'You · Just now',
      time: 'Just now',
      content: comment.trim(),
      likes: 0,
      liked: false,
    }
    setReplies(rs => [...rs, newReply])
    setComment('')
    // Scroll to bottom after render
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }

  const bowl = COMMUNITY_BOWLS.find(b => b.label === post.bowl)

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Panel — slides up on mobile, scales in on desktop */}
      <div
        className={`relative w-full md:max-w-2xl bg-white md:rounded-2xl shadow-2xl flex flex-col
          transition-all duration-300 ease-out
          ${visible
            ? 'translate-y-0 opacity-100 md:scale-100'
            : 'translate-y-full opacity-0 md:translate-y-0 md:scale-95'
          }
          h-[92dvh] md:h-[85vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition"
              aria-label="Close thread"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            {bowl && (
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {bowl.label}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {replies.length + (post.comments > replies.length ? post.comments - replies.length : 0)} comments
          </p>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">

          {/* Original post */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start gap-3 mb-3">
              <AvatarCircle letter={post.author_avatar_letter} size="md" />
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {post.is_anonymous ? 'Anonymous' : (post.author_name ?? 'Unknown')}
                  {post.author_role && <span className="font-normal text-gray-400"> · {post.author_role}</span>}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{post.time_ago}</p>
              </div>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-5">
              <button
                onClick={() => { setPostLiked(l => !l); setPostLikes(c => postLiked ? c - 1 : c + 1) }}
                className={`flex items-center gap-1.5 text-xs font-medium transition ${postLiked ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <svg className="w-3.5 h-3.5" fill={postLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                </svg>
                {postLikes}
              </button>
              <button
                onClick={() => textareaRef.current?.focus()}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Reply
              </button>
            </div>
          </div>

          {/* Replies */}
          <div>
            {replies.map((reply, i) => (
              <div key={reply.id} className="px-4 py-3 flex items-start gap-3 group">
                {/* Thread line visual — indent nested replies */}
                {i > 0 && i < 3 && (
                  <div className="absolute left-[30px] mt-9 w-px bg-gray-100" style={{ height: 24 }} />
                )}
                <AvatarCircle letter={reply.letter} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <p className="text-xs font-semibold text-gray-800">{reply.role.split(' · ')[0]}</p>
                    <p className="text-xs text-gray-400">{reply.role.split(' · ').slice(1).join(' · ')}</p>
                    <span className="text-gray-200">·</span>
                    <p className="text-xs text-gray-400">{reply.time}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mt-1">{reply.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleLikeReply(reply.id)}
                      className={`flex items-center gap-1 text-xs font-medium transition ${reply.liked ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <svg className="w-3 h-3" fill={reply.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                      </svg>
                      {reply.likes}
                    </button>
                    <button
                      onClick={() => { textareaRef.current?.focus() }}
                      className="text-xs text-gray-400 hover:text-gray-600 transition font-medium"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {post.comments > replies.length && (
              <div className="px-4 py-4 text-center">
                <p className="text-xs text-gray-400">
                  {post.comments - replies.length} more comments — sign in to see all
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky comment composer */}
        <div className="shrink-0 px-4 py-3 bg-white" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <div className="flex items-end gap-3">
            <AvatarCircle letter="Y" size="sm" />
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={comment}
                onChange={e => {
                  setComment(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && comment.trim()) {
                    e.preventDefault()
                    handleSubmitComment()
                  }
                }}
                placeholder="Add a comment..."
                rows={1}
                className="w-full text-sm text-gray-800 placeholder:text-gray-400 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none overflow-hidden leading-relaxed"
                style={{ minHeight: 40 }}
              />
            </div>
            <button
              onClick={handleSubmitComment}
              disabled={!comment.trim()}
              className="shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Post comment"
            >
              <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 ml-10">
            Posting anonymously · <a href="/auth/login" className="text-gray-900 hover:underline">Sign in</a> to use your profile
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Post Card ──────────────────────────────────────────── */
function PostCard({ post, onOpen, onReport }: { post: CommunityPost; onOpen: () => void; onReport: () => void }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [pop, setPop] = useState(false)
  const bowl = COMMUNITY_BOWLS.find(b => b.label === post.bowl)
  const st = bowlStyle(post.bowl)
  const hot = post.likes + post.comments * 2 >= 180

  function stopAndLike(e: React.MouseEvent) {
    e.stopPropagation()
    if (!liked) { setPop(true); setTimeout(() => setPop(false), 320) }
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  return (
    <div
      onClick={onOpen}
      className={`relative bg-white rounded-xl border border-gray-200 p-5 pl-6 cursor-pointer group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${st.soft}`}
    >
      {/* Category accent bar */}
      <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${st.bar}`} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <AvatarCircle letter={post.author_avatar_letter} gradient={st.avatar} />
          <div className="min-w-0">
            <p className="text-xs text-gray-700 leading-tight font-semibold truncate">
              {post.is_anonymous ? 'Anonymous' : (post.author_name ?? '')}
              {post.author_role && <span className="font-normal text-gray-400"> · {post.author_role}</span>}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{post.time_ago}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {hot && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-600">
              <Icon name="flame" className="w-3 h-3" strokeWidth={2.2} />Hot
            </span>
          )}
          {bowl && (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${st.chip}`}>
              <Icon name={bowl.icon} className="w-3 h-3" />{post.bowl}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 group-hover:text-gray-900 transition-colors">{post.content}</p>

      {post.featured_reply && (
        <div className={`mt-3 ml-1 pl-3 border-l-2 py-1 ${st.border}`}>
          <p className="text-xs text-gray-400 mb-0.5">{post.featured_reply.author_role}</p>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{post.featured_reply.content}</p>
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
        <button
          onClick={stopAndLike}
          aria-label={liked ? 'Unlike' : 'Like'}
          className={`flex items-center gap-1.5 text-xs font-semibold transition active:scale-90 ${liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'}`}
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${pop ? 'scale-125' : ''}`} fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          {likeCount}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onOpen() }}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-blue-600 transition"
        >
          <Icon name="chat" className="w-4 h-4" strokeWidth={2} />
          {post.comments}
        </button>
        <button
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-emerald-600 transition"
        >
          <Icon name="share" className="w-4 h-4" strokeWidth={2} />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button
          onClick={e => { e.stopPropagation(); onReport() }}
          aria-label="Report post"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-red-500 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 2H21l-3 6 3 6h-8.5l-1-2H5a2 2 0 00-2 2z"/>
          </svg>
        </button>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-gray-300 transition group-hover:text-gray-600">
          <span className="group-hover:hidden">Read</span>
          <span className="hidden group-hover:inline">Open thread</span>
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </span>
      </div>
    </div>
  )
}

/* ─── Create Post Modal ──────────────────────────────────── */
function CreatePostModal({ onClose, onPost }: { onClose: () => void; onPost: (post: CommunityPost) => void }) {
  const [bowl, setBowl] = useState(COMMUNITY_BOWLS[0].label)
  const [content, setContent] = useState('')

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handlePost() {
    if (!content.trim()) return
    const newPost: CommunityPost = {
      id: `local-${Date.now()}`,
      bowl,
      author_role: 'Hospitality Worker',
      author_avatar_letter: 'Y',
      author_name: undefined,
      time_ago: 'Just now',
      content: content.trim(),
      likes: 0,
      comments: 0,
      shares: 0,
      is_anonymous: true,
    }
    onPost(newPost)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base">Create a post</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">Y</div>
          <div>
            <p className="text-sm font-medium text-gray-700">Posting anonymously</p>
            <p className="text-xs text-gray-400"><a href="/auth/login" className="text-gray-900 hover:underline">Sign in</a> to post with your profile</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Bowl</label>
          <div className="flex flex-wrap gap-2">
            {COMMUNITY_BOWLS.map(b => (
              <button
                key={b.label}
                onClick={() => setBowl(b.label)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                  bowl === b.label ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Ask a question, share an experience, or start a discussion..."
          className="w-full h-32 text-sm text-gray-700 placeholder:text-gray-400 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
          autoFocus
        />

        <div className="flex items-center justify-end gap-3 mt-4">
          <button onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2 transition">Cancel</button>
          <button
            onClick={handlePost}
            disabled={!content.trim()}
            className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main CommunityClient ───────────────────────────────── */
export default function CommunityClient() {
  const [tab, setTab] = useState<'discussions' | 'salaries'>('discussions')
  const [activeBowl, setActiveBowl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [sort, setSort] = useState<'new' | 'top'>('new')

  function handleNewPost(post: CommunityPost) {
    setPosts(prev => [post, ...prev])
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  const filtered = useMemo(() => {
    let list = activeBowl ? posts.filter(p => p.bowl === activeBowl) : posts
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.content.toLowerCase().includes(q) ||
        p.author_role.toLowerCase().includes(q) ||
        p.bowl.toLowerCase().includes(q)
      )
    }
    if (sort === 'top') {
      list = [...list].sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2))
    }
    return list
  }, [posts, activeBowl, query, sort])

  const totalReplies = useMemo(() => posts.reduce((n, p) => n + p.comments, 0), [posts])

  // Live "most discussed" — computed from real engagement, not hardcoded
  const mostDiscussed = useMemo(
    () => [...posts]
      .sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2))
      .slice(0, 4),
    [posts]
  )

  return (
    <>
      {showModal && <CreatePostModal onClose={() => setShowModal(false)} onPost={handleNewPost} />}
      {selectedPost && <PostThread post={selectedPost} onClose={() => setSelectedPost(null)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      <div className="bg-white" style={{ minHeight: 'calc(100vh - 112px)' }}>
        <div className="max-w-[1440px] mx-auto md:flex">

          {/* Left sidebar — desktop only */}
          <aside className="hidden md:block w-[260px] shrink-0 p-5 space-y-4 sticky top-[var(--header-height)] h-[calc(100vh-112px)] overflow-y-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">G</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Guest</p>
                  <p className="text-xs text-gray-400">Sign in to join discussions</p>
                </div>
              </div>
              <a href="/auth/login" className="block text-center text-sm font-medium text-gray-600 border border-gray-200 rounded-md py-1.5 hover:bg-gray-50 transition mb-2">Sign in</a>
              <button onClick={() => setShowModal(true)} className="w-full bg-gray-900 text-white text-sm font-semibold py-2 rounded-md hover:bg-gray-800 transition">
                + Create post
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Explore bowls</p>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveBowl(null)}
                  className={`w-full text-left text-sm font-medium px-3 py-2 rounded-lg transition flex items-center gap-2 ${activeBowl === null ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All posts
                </button>
                {COMMUNITY_BOWLS.map(b => (
                  <button
                    key={b.label}
                    onClick={() => setActiveBowl(activeBowl === b.label ? null : b.label)}
                    className={`w-full text-left text-sm font-medium px-3 py-2 rounded-lg transition flex items-center gap-2.5 ${activeBowl === b.label ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Icon name={b.icon} className={`w-4 h-4 ${bowlStyle(b.label).dot}`} />
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Center feed */}
          <main className="flex-1 py-5 px-4 min-w-0 md:border-x border-gray-200 pb-24 md:pb-5">
            <div className="max-w-2xl mx-auto">

              {/* Primary tabs */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 mb-4 w-full max-w-xs mx-auto md:mx-0">
                <button
                  onClick={() => setTab('discussions')}
                  className={`flex-1 text-sm font-semibold py-1.5 rounded-full transition ${tab === 'discussions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Discussions
                </button>
                <button
                  onClick={() => setTab('salaries')}
                  className={`flex-1 text-sm font-semibold py-1.5 rounded-full transition ${tab === 'salaries' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Salaries & Tips
                </button>
              </div>

              {tab === 'salaries' ? (
                <SalaryExplorer />
              ) : (
              <>
              {/* Pulse header */}
              <div className="relative overflow-hidden rounded-2xl p-5 mb-4 text-white shadow-sm" style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 52%,#db2777 100%)' }}>
                <div className="relative z-10">
                  <p className="text-base font-bold">The break room</p>
                  <p className="text-sm text-white/80 mt-0.5">Real talk from hospitality workers across South Africa.</p>
                  <div className="flex items-center gap-6 mt-3.5">
                    <div><p className="text-xl font-extrabold leading-none">{posts.length}</p><p className="text-[11px] text-white/70 mt-1">discussions</p></div>
                    <div><p className="text-xl font-extrabold leading-none">{totalReplies.toLocaleString()}</p><p className="text-[11px] text-white/70 mt-1">replies</p></div>
                    <div><p className="text-xl font-extrabold leading-none">{COMMUNITY_BOWLS.length}</p><p className="text-[11px] text-white/70 mt-1">topics</p></div>
                  </div>
                </div>
                <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full bg-white/10" />
                <div className="absolute right-12 top-12 w-16 h-16 rounded-full bg-white/10" />
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3 hover:border-violet-300 hover:shadow-sm transition text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0">G</div>
                <span className="text-sm text-gray-400 group-hover:text-gray-600 flex-1">Share a tip, ask a question...</span>
                <span className="text-xs font-bold text-white bg-gray-900 group-hover:bg-violet-600 transition px-3 py-1.5 rounded-full shrink-0">Post</span>
              </button>

              {/* Search */}
              <div className="relative mb-4">
                <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full h-10 bg-white border border-gray-200 rounded-full pl-10 pr-9 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Mobile bowl filter */}
              <div className="flex gap-2 overflow-x-auto scroll-no-bar pb-1 mb-4 -mx-4 px-4 md:hidden">
                <button
                  onClick={() => setActiveBowl(null)}
                  className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${activeBowl === null ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  All posts
                </button>
                {COMMUNITY_BOWLS.map(b => (
                  <button
                    key={b.label}
                    onClick={() => setActiveBowl(activeBowl === b.label ? null : b.label)}
                    className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${activeBowl === b.label ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* Sort control */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  {activeBowl ? (
                    <>
                      <Icon name={COMMUNITY_BOWLS.find(b => b.label === activeBowl)?.icon ?? 'chat'} className={`w-3.5 h-3.5 ${bowlStyle(activeBowl).dot}`} />
                      {activeBowl}
                      <button onClick={() => setActiveBowl(null)} className="text-gray-400 hover:text-gray-700 transition ml-1">Clear</button>
                    </>
                  ) : (
                    <span className="uppercase tracking-wide text-gray-400">{filtered.length} discussion{filtered.length !== 1 ? 's' : ''}</span>
                  )}
                </span>
                <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
                  <button onClick={() => setSort('new')}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition ${sort === 'new' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    Newest
                  </button>
                  <button onClick={() => setSort('top')}
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition ${sort === 'top' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Icon name="flame" className="w-3 h-3" strokeWidth={2.2} />Top
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    </div>
                    <p className="font-medium text-gray-600">{query ? `No posts match “${query}”` : 'No posts in this bowl yet'}</p>
                    {query
                      ? <button onClick={() => setQuery('')} className="mt-3 text-sm text-gray-900 hover:underline font-medium">Clear search</button>
                      : <button onClick={() => setShowModal(true)} className="mt-3 text-sm text-gray-900 hover:underline font-medium">Be the first to post</button>}
                  </div>
                ) : (
                  filtered.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onOpen={() => setSelectedPost(post)}
                      onReport={() => showToast('Thanks — this post has been flagged for review.')}
                    />
                  ))
                )}
              </div>
              </>
              )}
            </div>
          </main>

          {/* Right sidebar — desktop only */}
          <aside className="hidden lg:block w-[300px] shrink-0 p-5 space-y-4 sticky top-[var(--header-height)] h-[calc(100vh-112px)] overflow-y-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-bold text-gray-800 mb-3">Most discussed</p>
              <div className="space-y-3">
                {mostDiscussed.map((p, i) => (
                  <button key={p.id} onClick={() => setSelectedPost(p)}
                    className="w-full text-left flex items-start gap-3 group">
                    <span className="text-xs font-bold text-gray-300 mt-0.5 w-4 shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-gray-950">{p.content}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.bowl} · {p.likes + p.comments * 2} engagements</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-bold text-gray-800 mb-3">Browse by topic</p>
              <div className="space-y-1">
                {COMMUNITY_BOWLS.map(b => (
                  <div key={b.label} className="flex items-center justify-between py-1">
                    <span className="flex items-center gap-2 text-sm text-gray-700"><Icon name={b.icon} className="w-4 h-4 text-gray-400" />{b.label}</span>
                    <button onClick={() => setActiveBowl(b.label)} className="text-xs font-semibold text-gray-900 hover:underline">Browse</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-bold text-gray-900 mb-1">Share your experience</p>
              <p className="text-xs text-gray-800 mb-3 leading-relaxed">Help fellow hospitality workers with salary info, interview tips, and workplace insights.</p>
              <button onClick={() => setShowModal(true)} className="w-full bg-gray-900 text-white text-xs font-semibold py-2 rounded-full hover:bg-gray-800 transition">
                Start a discussion
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
