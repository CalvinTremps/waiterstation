export type ApplicationStatus =
  | 'submitted'
  | 'viewed'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'hired'
  | 'not_selected'
  | 'withdrawn'

export interface WorkerApplication {
  id: string
  job_title: string
  employer_name: string
  location: string
  employment_type: 'permanent' | 'seasonal' | 'event'
  pay?: string
  status: ApplicationStatus
  applied_at: string
  updated_at: string
  notes: string
  interview_date?: string
  interview_time?: string
  interview_type?: 'in-person' | 'phone' | 'video'
}

export interface WorkerInterview {
  id: string
  application_id: string
  employer_name: string
  job_title: string
  date: string
  time: string
  type: 'in-person' | 'phone' | 'video'
  location?: string
  prep_notes: string
  questions_to_ask: string
  outcome: 'upcoming' | 'went_well' | 'waiting' | 'rejected' | 'offered' | 'no_show'
}

export interface JobAlert {
  id: string
  label: string
  role?: string
  location?: string
  employment_type?: string
  min_pay?: number
  active: boolean
  created_at: string
  matches_since: number
  last_match?: string
}

export interface WorkerDocument {
  id: string
  name: string
  type: 'cv' | 'reference' | 'certificate' | 'id' | 'other'
  file_name: string
  size_kb: number
  uploaded_at: string
  used_in: number
}

export interface WorkerMessage {
  id: string
  employer_name: string
  job_title: string
  last_message: string
  last_message_at: string
  unread: boolean
  avatar_color: string
  avatar_initials: string
  thread: { from: 'employer' | 'me'; text: string; at: string }[]
}

export interface WorkerExperience {
  id: string
  employer: string
  role: string
  from: string
  to: string | null
  current: boolean
  description: string
}

// Fixed reference date for deterministic mock timestamps — see the matching
// note in mock-recruitment.ts. Date.now() here caused SSR/client hydration
// mismatches because this module is imported by server-rendered 'use client'
// pages and evaluated at different wall-clock times on server vs browser.
const now = new Date('2026-06-23T09:00:00+02:00').getTime()
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString()
const daysAhead = (d: number) => new Date(now + d * 86400000).toISOString()

export const MOCK_APPLICATIONS: WorkerApplication[] = [
  {
    id: 'wa-1',
    job_title: 'Senior Waiter / Floor Captain',
    employer_name: 'One&Only Cape Town',
    location: 'Cape Town, V&A Waterfront',
    employment_type: 'permanent',
    pay: 'R8 500/month + tips',
    status: 'offered',
    applied_at: daysAgo(14),
    updated_at: daysAgo(2),
    notes: 'Offer letter received. Deadline to respond is Friday.',
    interview_date: daysAgo(4).split('T')[0],
    interview_time: '10:00',
    interview_type: 'in-person',
  },
  {
    id: 'wa-2',
    job_title: 'Head Waiter',
    employer_name: 'The Test Kitchen',
    location: 'Cape Town, Woodstock',
    employment_type: 'permanent',
    pay: 'R9 000/month + tips',
    status: 'interview',
    applied_at: daysAgo(10),
    updated_at: daysAgo(1),
    notes: 'Second interview booked for next week.',
    interview_date: daysAhead(5).split('T')[0],
    interview_time: '14:00',
    interview_type: 'in-person',
  },
  {
    id: 'wa-3',
    job_title: 'Floor Waiter',
    employer_name: 'Marble Restaurant',
    location: 'Johannesburg, Sandton',
    employment_type: 'permanent',
    pay: 'R7 000/month + tips',
    status: 'shortlisted',
    applied_at: daysAgo(7),
    updated_at: daysAgo(3),
    notes: 'HR called to confirm my availability. Waiting to hear about interview.',
    interview_date: undefined,
    interview_time: undefined,
  },
  {
    id: 'wa-4',
    job_title: 'Waiter / Waitress – Wine Estate',
    employer_name: 'Spier Wine Farm',
    location: 'Stellenbosch, Western Cape',
    employment_type: 'permanent',
    pay: 'R6 500/month + tips',
    status: 'viewed',
    applied_at: daysAgo(5),
    updated_at: daysAgo(2),
    notes: '',
  },
  {
    id: 'wa-5',
    job_title: 'Event Waiter x8',
    employer_name: 'Sun International',
    location: 'Cape Town, Century City',
    employment_type: 'event',
    pay: 'R850/day',
    status: 'submitted',
    applied_at: daysAgo(2),
    updated_at: daysAgo(2),
    notes: '',
  },
  {
    id: 'wa-6',
    job_title: 'Senior Waitress',
    employer_name: 'Belmond Mount Nelson',
    location: 'Cape Town, Gardens',
    employment_type: 'permanent',
    pay: 'R8 000/month + tips',
    status: 'not_selected',
    applied_at: daysAgo(30),
    updated_at: daysAgo(15),
    notes: 'Position filled internally. Will keep me in mind for future roles.',
  },
  {
    id: 'wa-7',
    job_title: 'Restaurant Supervisor',
    employer_name: 'Twelve Apostles Hotel',
    location: 'Cape Town, Camps Bay',
    employment_type: 'permanent',
    pay: 'R12 000/month',
    status: 'withdrawn',
    applied_at: daysAgo(20),
    updated_at: daysAgo(10),
    notes: 'Withdrew after accepting another offer.',
  },
]

export const MOCK_WORKER_INTERVIEWS: WorkerInterview[] = [
  {
    id: 'wi-1',
    application_id: 'wa-2',
    employer_name: 'The Test Kitchen',
    job_title: 'Head Waiter',
    date: daysAhead(5).split('T')[0],
    time: '14:00',
    type: 'in-person',
    location: '375 Albert Rd, Woodstock — ask for Bianca at reception',
    prep_notes: 'Review their tasting menu. Know the wine list basics. Wear smart black.',
    questions_to_ask: 'What does a typical Friday service look like? Is there a trial shift? What is the tip structure?',
    outcome: 'upcoming',
  },
  {
    id: 'wi-2',
    application_id: 'wa-1',
    employer_name: 'One&Only Cape Town',
    job_title: 'Senior Waiter / Floor Captain',
    date: daysAgo(4).split('T')[0],
    time: '10:00',
    type: 'in-person',
    location: 'V&A Waterfront — Hotel lobby, ask for Fatima',
    prep_notes: 'Research One&Only standards. Wear a suit. Bring printed CV.',
    questions_to_ask: 'What career progression looks like for floor captains?',
    outcome: 'offered',
  },
  {
    id: 'wi-3',
    application_id: 'wa-6',
    employer_name: 'Belmond Mount Nelson',
    job_title: 'Senior Waitress',
    date: daysAgo(20).split('T')[0],
    time: '09:30',
    type: 'phone',
    location: undefined,
    prep_notes: 'Relax, be confident, emphasise fine dining background.',
    questions_to_ask: 'Is there flexibility on starting date?',
    outcome: 'rejected',
  },
]

export const MOCK_JOB_ALERTS: JobAlert[] = [
  {
    id: 'al-1',
    label: 'Waiter jobs in Cape Town',
    role: 'waiter',
    location: 'Cape Town',
    employment_type: 'permanent',
    active: true,
    created_at: daysAgo(30),
    matches_since: 14,
    last_match: daysAgo(1),
  },
  {
    id: 'al-2',
    label: 'Floor captain / supervisor roles',
    role: 'manager',
    location: 'Cape Town',
    employment_type: undefined,
    min_pay: 10000,
    active: true,
    created_at: daysAgo(15),
    matches_since: 3,
    last_match: daysAgo(5),
  },
  {
    id: 'al-3',
    label: 'Event work this month',
    role: 'waiter',
    location: undefined,
    employment_type: 'event',
    active: false,
    created_at: daysAgo(60),
    matches_since: 22,
    last_match: daysAgo(10),
  },
]

export const MOCK_DOCUMENTS: WorkerDocument[] = [
  {
    id: 'doc-1',
    name: 'My CV',
    type: 'cv',
    file_name: 'Thabo_Nkosi_CV_2026.pdf',
    size_kb: 184,
    uploaded_at: daysAgo(30),
    used_in: 5,
  },
  {
    id: 'doc-2',
    name: 'Reference – Shortmarket Club',
    type: 'reference',
    file_name: 'Shortmarket_Reference_Letter.pdf',
    size_kb: 62,
    uploaded_at: daysAgo(45),
    used_in: 3,
  },
  {
    id: 'doc-3',
    name: 'WSET Level 2 Certificate',
    type: 'certificate',
    file_name: 'WSET_Level2_Certificate.pdf',
    size_kb: 430,
    uploaded_at: daysAgo(90),
    used_in: 2,
  },
  {
    id: 'doc-4',
    name: 'Food Handlers Certificate',
    type: 'certificate',
    file_name: 'Food_Handlers_Cert_2025.pdf',
    size_kb: 115,
    uploaded_at: daysAgo(120),
    used_in: 4,
  },
]

export const MOCK_MESSAGES: WorkerMessage[] = [
  {
    id: 'msg-1',
    employer_name: 'One&Only Cape Town',
    job_title: 'Senior Waiter / Floor Captain',
    last_message: 'Hi Thabo, congratulations! We would like to extend a formal offer...',
    last_message_at: daysAgo(2),
    unread: true,
    avatar_color: 'bg-gray-800',
    avatar_initials: 'OO',
    thread: [
      { from: 'employer', text: 'Hi Thabo, thank you for coming in for the interview. We were very impressed with your experience and wine knowledge.', at: daysAgo(4) },
      { from: 'me', text: 'Thank you so much, it was a pleasure to meet the team. I am very excited about the opportunity.', at: daysAgo(4) },
      { from: 'employer', text: 'Hi Thabo, congratulations! We would like to extend a formal offer for the Senior Waiter / Floor Captain position. Please see the attached offer letter and let us know by Friday.', at: daysAgo(2) },
    ],
  },
  {
    id: 'msg-2',
    employer_name: 'The Test Kitchen',
    job_title: 'Head Waiter',
    last_message: 'Looking forward to seeing you on Thursday at 2pm.',
    last_message_at: daysAgo(1),
    unread: true,
    avatar_color: 'bg-gray-800',
    avatar_initials: 'TK',
    thread: [
      { from: 'employer', text: 'Hi Thabo, we reviewed your application and would love to invite you for a second interview. Are you available Thursday at 2pm?', at: daysAgo(3) },
      { from: 'me', text: 'Thursday at 2pm works perfectly, thank you! I look forward to it.', at: daysAgo(2) },
      { from: 'employer', text: 'Looking forward to seeing you on Thursday at 2pm. The address is 375 Albert Rd, Woodstock. Ask for Bianca at reception.', at: daysAgo(1) },
    ],
  },
  {
    id: 'msg-3',
    employer_name: 'Marble Restaurant',
    job_title: 'Floor Waiter',
    last_message: 'We will be in touch shortly regarding next steps.',
    last_message_at: daysAgo(3),
    unread: false,
    avatar_color: 'bg-stone-700',
    avatar_initials: 'MR',
    thread: [
      { from: 'employer', text: 'Hi, thank you for applying to Marble Restaurant. We have reviewed your application and you have been shortlisted. We will be in touch shortly regarding next steps.', at: daysAgo(3) },
    ],
  },
]

export const MOCK_WORKER_PROFILE = {
  name: 'Thabo Nkosi',
  email: 'thabo.nkosi@gmail.com',
  phone: '+27 82 441 3320',
  location: 'Cape Town, Mitchells Plain',
  role_category: 'waiter',
  bio: '5 years in fine dining at Norval Foundation and Shortmarket Club. WSET Level 2 certified with strong wine knowledge and a passion for delivering exceptional guest experiences. Experienced in training junior staff and floor management.',
  experience_years: 5,
  availability: 'Available immediately',
  skills: ['Fine dining', 'Wine service', 'POS systems (MICROS)', 'Team leadership', 'Upselling', 'Allergen knowledge', 'Cash handling'],
  languages: ['English', 'Afrikaans', 'Xhosa'],
  certifications: ['WSET Level 2', 'Food Handlers Certificate', 'RASA Member'],
  open_to_work: true,
}

export const MOCK_EXPERIENCES: WorkerExperience[] = [
  {
    id: 'exp-1',
    employer: 'Shortmarket Club',
    role: 'Senior Waiter',
    from: '2022-03',
    to: null,
    current: true,
    description: 'Fine dining floor service for 80-cover restaurant. Wine service, floor captain duties, training of junior staff.',
  },
  {
    id: 'exp-2',
    employer: 'Norval Foundation',
    role: 'Waiter',
    from: '2020-01',
    to: '2022-02',
    current: false,
    description: 'Restaurant and event catering at Cape Town art museum. Seasonal functions and gallery events.',
  },
  {
    id: 'exp-3',
    employer: 'Quay Four',
    role: 'Junior Waiter',
    from: '2018-06',
    to: '2019-12',
    current: false,
    description: 'Waterfront restaurant, high-volume lunch and dinner service for tourists and locals.',
  },
]

export const CAREER_TIPS = [
  {
    id: 'tip-1',
    category: 'Interview',
    title: 'What fine dining employers actually look for',
    time_read: '3 min',
    content: `When interviewing for a fine dining position, employers are assessing far more than your technical knowledge. Here is what they really want to see:\n\n**Grooming and presentation** — Your appearance when you walk in is the first audition. Wear clean, pressed clothes. Shoes matter more than you think.\n\n**Composure under questioning** — You may be asked about handling a difficult guest, a kitchen delay, or a wine complaint. Stay calm and structured: describe the situation, your action, and the result.\n\n**Menu knowledge curiosity** — You won't know their menu yet, but showing you've researched their restaurant signals seriousness. "I looked at your current tasting menu and was curious about the smoked octopus pairing" will separate you from everyone else.\n\n**Asking the right questions** — The best candidates ask: What does your busiest service look like? How do you run staff training? What does career progression look like here? These signal you're thinking long-term.\n\n**Energy and warmth** — Hospitality is a people industry. Be genuinely enthusiastic. Interviewers remember how you made them feel.`,
  },
  {
    id: 'tip-2',
    category: 'Pay',
    title: 'How to negotiate your salary as a hospitality worker in SA',
    time_read: '4 min',
    content: `Salary negotiation in hospitality is more common than most candidates think. Here is how to approach it:\n\n**Know the market** — In South Africa, waiters at casual restaurants earn R4 000–R6 500/month. Fine dining and 5-star hotels typically range from R7 000–R11 000 + tips. Floor captains and supervisors can command R12 000–R18 000.\n\n**Always negotiate on job offers** — If an employer makes an offer verbally or in writing, it is always appropriate to respond with a counter. A simple "Thank you so much for the offer. Based on my experience, I was hoping for R9 000 — is there flexibility?" is professional and expected.\n\n**Beyond base salary** — Don't forget to consider: tip structure and pool arrangements, medical aid contribution, staff meals (valued at R200–R400/month), uniform provision, and provident fund.\n\n**Timing matters** — Never bring up salary in a first interview unless they ask. The right moment is after you receive an offer.\n\n**Your walk-away number** — Know the minimum you'll accept before you start negotiating. If they can't meet it, it's better to know early.`,
  },
  {
    id: 'tip-3',
    category: 'Career',
    title: 'Moving from waiter to floor captain: what the step up requires',
    time_read: '5 min',
    content: `The gap between senior waiter and floor captain is not just seniority — it requires a different mindset and a visible skill set.\n\n**Leadership on the floor** — Floor captains are judged by their team, not just their guests. You need to show you can brief a team before service, assign sections fairly, manage a junior who is struggling, and hold a standard without making people feel criticised.\n\n**Ownership of the guest experience** — As a waiter, you own your section. As a floor captain, you own the entire room. That means watching tables that aren't yours, noticing when a colleague is overwhelmed, and stepping in before things go wrong.\n\n**Wine and menu depth** — Most floor captains are expected to lead wine recommendations and handle escalated guest queries. WSET Level 2 is increasingly seen as a baseline in fine dining. If you don't have it, start studying.\n\n**When to make the move** — Look for supervisor or floor captain roles after 3+ years of fine dining experience, strong relationships with management, and at least one instance of leading a service or training a junior colleague. If your current employer doesn't have a path upward, it may be time to move to create one.\n\n**The interview conversation** — When applying for your first captain role, lead with a specific example of when you managed a situation beyond your station: covering for a manager, handling a difficult table escalation, training a new starter.`,
  },
  {
    id: 'tip-4',
    category: 'CV',
    title: 'Writing a hospitality CV that gets you called back',
    time_read: '3 min',
    content: `Most hospitality CVs look the same. Here is how to make yours stand out:\n\n**Lead with a 2-line summary** — Employers scan CVs in under 10 seconds. Open with: "Senior waiter with 5 years of fine dining experience at award-winning Cape Town restaurants. WSET Level 2 certified, experienced in floor captain duties and team training."\n\n**List accomplishments, not duties** — Instead of "Took orders and served food", write "Consistently achieved top upsell scores for wine and dessert across a 90-cover fine dining floor."\n\n**Include your certifications prominently** — WSET, RASA membership, food hygiene, Flair certification — list them near the top, not buried at the bottom.\n\n**Tailor for each application** — If a job listing emphasises wine knowledge, put your wine experience first. If they mention team leadership, highlight your training experience. Customising takes 5 minutes and dramatically increases your callback rate.\n\n**Keep it to one page** — Unless you have 10+ years of experience, one page is ideal. Use clean formatting, no photos (unless requested), and simple fonts.`,
  },
  {
    id: 'tip-5',
    category: 'Rights',
    title: 'Your rights as a hospitality worker in South Africa',
    time_read: '4 min',
    content: `Knowing your rights protects you from exploitation and helps you have informed conversations with employers.\n\n**Minimum wage** — As of 2025, South Africa's national minimum wage is R27.58/hour. For hospitality workers this translates to approximately R4 800/month for full-time work. Many employers pay above this, but below minimum wage is illegal.\n\n**Tips belong to you** — Tips are legally your property and cannot be withheld by an employer. If your employer pools tips and distributes them, they must do so fairly and transparently.\n\n**Working hours** — The Basic Conditions of Employment Act limits ordinary working hours to 45 per week (9 per day). Overtime must be agreed upon and paid at 1.5x your rate (2x on Sundays and public holidays).\n\n**Probation and dismissal** — During a probationary period, employers can let you go with less notice, but must still follow a fair process. Dismissal without a fair process is unfair dismissal and can be disputed at the CCMA.\n\n**The CCMA** — If you believe you've been unfairly dismissed or your rights have been violated, you can refer a dispute to the Commission for Conciliation, Mediation and Arbitration (CCMA) for free. This is an important resource many workers don't know about.`,
  },
  {
    id: 'tip-6',
    category: 'Event',
    title: 'Making the most of event and seasonal hospitality work',
    time_read: '3 min',
    content: `Event work is often dismissed as less desirable than permanent positions, but it can be a powerful tool for building your career.\n\n**The networking upside** — Every event is a room full of managers and HR contacts. Show up early, work hard, be professional, and introduce yourself at the end of a shift. Event coordinators often have permanent openings they fill from their reliable event pool.\n\n**Rates** — Event rates in Cape Town typically range from R700–R1 200/day depending on the event type and your experience. Functions for five-star hotels or corporate events often pay more than casual restaurant work.\n\n**Build a reputation fast** — Event companies rehire the same reliable people. If you show up on time, work hard, don't leave early, and maintain a professional standard, you'll be booked every weekend within a month.\n\n**What to wear** — Unless instructed otherwise: black non-slip shoes, black trousers, white collared shirt. Bring your own corkscrew and pen. It signals professionalism.\n\n**When to move to permanent** — If you're doing event work while looking for a permanent role, use it to fill gaps in your CV, build references, and stay sharp. Don't let event work become a comfort zone if your goal is permanent placement.`,
  },
]

// ── Smart Job Feed ───────────────────────────────────────────────

export interface FeedJob {
  id: string
  title: string
  employer: string
  location: string
  distance_km: number
  pay: string
  shift_type: 'Full-time' | 'Part-time' | 'Once-off' | 'Casual'
  match_score: number
  match_reasons: string[]
  posted_days_ago: number
  logo_color: string
  logo_initials: string
  applied: boolean
  saved: boolean
  urgent?: boolean
}

export const FEED_JOBS: FeedJob[] = [
  {
    id: 'fj-1', title: 'Senior Waiter – Fine Dining', employer: 'The Test Kitchen', location: 'Woodstock, Cape Town', distance_km: 3.2, pay: 'R9 500/month', shift_type: 'Full-time', match_score: 10, match_reasons: ['Role matches your experience', 'Location is near you', 'Pay matches your preference', 'Fine dining matches your specialisation'], posted_days_ago: 1, logo_color: 'bg-gray-900', logo_initials: 'TK', applied: false, saved: true, urgent: true,
  },
  {
    id: 'fj-2', title: 'Floor Captain', employer: 'La Colombe', location: 'Constantia, Cape Town', distance_km: 18, pay: 'R13 000/month', shift_type: 'Full-time', match_score: 9, match_reasons: ['Leadership experience on your CV', 'Fine dining matches your specialisation', 'Salary above your target'], posted_days_ago: 2, logo_color: 'bg-amber-700', logo_initials: 'LC', applied: false, saved: false,
  },
  {
    id: 'fj-3', title: 'Event Waiter – Weekend', employer: 'Societi Bistro', location: 'Gardens, Cape Town', distance_km: 5.1, pay: 'R900/shift', shift_type: 'Once-off', match_score: 8, match_reasons: ['Matches your weekend availability', 'Short distance from you', 'Casual rate above average'], posted_days_ago: 0, logo_color: 'bg-rose-600', logo_initials: 'SB', applied: true, saved: false,
  },
  {
    id: 'fj-4', title: 'Bartender / Waiter', employer: 'Signal Restaurant', location: 'V&A Waterfront, Cape Town', distance_km: 7.8, pay: 'R8 000/month', shift_type: 'Full-time', match_score: 8, match_reasons: ['Bar experience on your CV', 'High-volume experience matches', 'Location is accessible'], posted_days_ago: 3, logo_color: 'bg-blue-700', logo_initials: 'SR', applied: false, saved: false,
  },
  {
    id: 'fj-5', title: 'Breakfast & Brunch Waiter', employer: 'The Pot Luck Club', location: 'Woodstock, Cape Town', distance_km: 3.5, pay: 'R7 500/month', shift_type: 'Part-time', match_score: 7, match_reasons: ['Morning availability set', 'Close to your location', 'Casual fine dining environment'], posted_days_ago: 4, logo_color: 'bg-orange-600', logo_initials: 'PL', applied: false, saved: false,
  },
  {
    id: 'fj-6', title: 'Banqueting Waiter – Hotel', employer: 'One&Only Cape Town', location: 'V&A Waterfront', distance_km: 8.2, pay: 'R1 100/shift', shift_type: 'Casual', match_score: 7, match_reasons: ['Hotel experience on your CV', 'WSET certification is a plus'], posted_days_ago: 5, logo_color: 'bg-gray-800', logo_initials: 'OO', applied: false, saved: true,
  },
  {
    id: 'fj-7', title: 'Senior Waitron', employer: 'Kloof Street House', location: 'Gardens, Cape Town', distance_km: 6.1, pay: 'R8 800/month', shift_type: 'Full-time', match_score: 6, match_reasons: ['Experience level matches', 'Neighbourhood restaurant experience'], posted_days_ago: 6, logo_color: 'bg-green-700', logo_initials: 'KS', applied: false, saved: false,
  },
  {
    id: 'fj-8', title: 'Junior Waiter – Breakfast', employer: 'Cafe Paradiso', location: 'Sea Point, Cape Town', distance_km: 9.3, pay: 'R6 200/month', shift_type: 'Full-time', match_score: 5, match_reasons: ['Matches your availability', 'Entry path to area growth'], posted_days_ago: 8, logo_color: 'bg-teal-600', logo_initials: 'CP', applied: false, saved: false,
  },
]

// ── Availability ─────────────────────────────────────────────────

export type ShiftSlot = 'morning' | 'afternoon' | 'evening' | 'night'

export interface AvailabilityGrid {
  [day: number]: ShiftSlot[]
}

export const DEFAULT_AVAILABILITY: AvailabilityGrid = {
  0: [],
  1: ['morning', 'afternoon', 'evening'],
  2: ['morning', 'afternoon', 'evening'],
  3: ['evening', 'night'],
  4: ['evening', 'night'],
  5: ['afternoon', 'evening', 'night'],
  6: ['morning', 'afternoon', 'evening', 'night'],
}

// ── References & Endorsements ────────────────────────────────────

export interface Reference {
  id: string
  referee_name: string
  referee_role: string
  company: string
  relationship: string
  period: string
  message: string
  rating: number
  date: string
  verified: boolean
  avatar_color: string
  avatar_initials: string
}

export const MOCK_REFERENCES: Reference[] = [
  {
    id: 'ref-1',
    referee_name: 'Carla Fortuin',
    referee_role: 'Restaurant Manager',
    company: 'The Test Kitchen',
    relationship: 'Direct manager',
    period: 'Jan 2022 – Present',
    message: "Amahle is one of the most reliable and polished waiters I've managed in 12 years of hospitality. Her attention to detail, warm guest manner, and ability to handle pressure during full service make her a standout. She consistently upsells without being pushy and has trained two junior staff members this year. I would rehire her without hesitation.",
    rating: 5,
    date: '2024-03-10',
    verified: true,
    avatar_color: 'bg-purple-600',
    avatar_initials: 'CF',
  },
  {
    id: 'ref-2',
    referee_name: 'James Petersen',
    referee_role: 'Operations Director',
    company: 'One&Only Cape Town',
    relationship: 'Department head',
    period: 'Mar 2020 – Dec 2021',
    message: "Amahle joined our banqueting team during an extremely busy period and adapted quickly to the high standards we hold at One&Only. She's professional, well-groomed, and communicates confidently with both guests and colleagues. A solid performer who would fit well in any fine dining setting.",
    rating: 5,
    date: '2022-01-15',
    verified: true,
    avatar_color: 'bg-blue-700',
    avatar_initials: 'JP',
  },
  {
    id: 'ref-3',
    referee_name: 'Nadine Scholtz',
    referee_role: 'Floor Captain',
    company: 'La Colombe',
    relationship: 'Senior colleague',
    period: 'Aug 2019 – Feb 2020',
    message: "Amahle worked alongside me as a junior waitron and showed a genuine desire to learn. She picked up fine dining etiquette quickly and was always punctual and well-presented.",
    rating: 4,
    date: '2020-03-01',
    verified: false,
    avatar_color: 'bg-amber-600',
    avatar_initials: 'NS',
  },
]

// ── Work History with Verification ──────────────────────────────

export interface WorkHistoryEntry {
  id: string
  role: string
  company: string
  location: string
  from: string
  to: string | null
  current: boolean
  description: string
  verification_status: 'verified' | 'pending' | 'unverified'
  verified_by?: string
  verified_date?: string
}

export const WORK_HISTORY: WorkHistoryEntry[] = [
  {
    id: 'wh-1',
    role: 'Senior Waiter',
    company: 'The Test Kitchen',
    location: 'Woodstock, Cape Town',
    from: '2022-01',
    to: null,
    current: true,
    description: "Fine dining floor service for 45-cover tasting menu restaurant. Responsible for wine recommendations, menu narration, and training junior staff. Consistently achieved top upsell scores across the team.",
    verification_status: 'verified',
    verified_by: 'Carla Fortuin (Manager)',
    verified_date: '2024-03-12',
  },
  {
    id: 'wh-2',
    role: 'Banqueting Waiter',
    company: 'One&Only Cape Town',
    location: 'V&A Waterfront, Cape Town',
    from: '2020-03',
    to: '2021-12',
    current: false,
    description: 'High-volume banqueting and fine dining service in a 5-star hotel environment. Events of 20–500 covers. Trained in butler service and VIP guest handling.',
    verification_status: 'verified',
    verified_by: 'James Petersen (Operations Director)',
    verified_date: '2022-01-20',
  },
  {
    id: 'wh-3',
    role: 'Junior Waitron',
    company: 'La Colombe',
    location: 'Constantia, Cape Town',
    from: '2019-08',
    to: '2020-02',
    current: false,
    description: 'Waterfront fine dining in a Top 50 Africa restaurant. Introduced to high-end tasting menu service, extensive wine list, and French service techniques.',
    verification_status: 'pending',
  },
  {
    id: 'wh-4',
    role: 'Waiter',
    company: 'Cafe Paradiso',
    location: 'Sea Point, Cape Town',
    from: '2018-01',
    to: '2019-07',
    current: false,
    description: 'Casual neighbourhood restaurant, breakfast and lunch service. High-volume, fast-paced environment with a focus on friendly guest experience.',
    verification_status: 'unverified',
  },
]
