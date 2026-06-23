export interface CommunityPost {
  id: string
  bowl: string
  author_role: string
  author_avatar_letter: string
  time_ago: string
  content: string
  likes: number
  comments: number
  shares: number
  is_anonymous: boolean
  author_name?: string
  featured_reply?: {
    author_role: string
    content: string
  }
}

export const COMMUNITY_BOWLS = [
  { label: 'Salary Talk', icon: 'money' },
  { label: 'Interview Tips', icon: 'briefcase' },
  { label: 'Work Stories', icon: 'book' },
  { label: 'Industry News', icon: 'newspaper' },
  { label: 'Career Advice', icon: 'target' },
  { label: 'Management Talk', icon: 'users' },
]

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    bowl: 'Salary Talk',
    author_role: 'Senior Waiter · Cape Town',
    author_avatar_letter: 'S',
    time_ago: '2h',
    content:
      'Can we talk about tips culture in Cape Town vs Johannesburg? I moved from Joburg to the V&A Waterfront 8 months ago and my tips have literally tripled. Tourist money hits different. Cape Town summer season is in a different league. Anyone else made this move and felt the difference?',
    likes: 47,
    comments: 23,
    shares: 5,
    is_anonymous: true,
    featured_reply: {
      author_role: 'Waitress · Sandton, JHB',
      content:
        'Joburg corporate lunch tips are consistent but lower. Cape Town summer tips are wild — I\'m seriously considering a seasonal move.',
    },
  },
  {
    id: 'post-2',
    bowl: 'Interview Tips',
    author_role: 'Hospitality Graduate · Stellenbosch',
    author_avatar_letter: 'K',
    time_ago: '4h',
    content:
      'Just got hired as a junior sommelier at a 5-star estate. The interview was 3 rounds — blind tasting, a theory exam, and a service simulation in front of the panel. If you\'re going for a wine role at a serious estate, study your SA wine regions inside out. They tested Stellenbosch sub-appellations specifically. Preparation is everything.',
    likes: 62,
    comments: 18,
    shares: 9,
    is_anonymous: false,
    author_name: 'Charl V.',
    featured_reply: {
      author_role: 'Sommelier · Franschhoek',
      content:
        'This is solid advice. I\'d add — know the estate\'s own wines before you walk in. Blind tasting their flagship and not recognising it is an immediate red flag for any interviewer.',
    },
  },
  {
    id: 'post-3',
    bowl: 'Work Stories',
    author_role: 'Bartender · Umhlanga',
    author_avatar_letter: 'N',
    time_ago: '6h',
    content:
      'Table of 12 walked in at 9:45pm on a Saturday — kitchen closes at 10pm. Manager said yes to them without telling us. We scrambled, executed, the guests were genuinely lovely and tipped R1,400 between FOH and bar. Sometimes the late tables save the night. Tonight was one of those nights.',
    likes: 134,
    comments: 41,
    shares: 14,
    is_anonymous: true,
  },
  {
    id: 'post-4',
    bowl: 'Salary Talk',
    author_role: 'Restaurant Manager · Sea Point',
    author_avatar_letter: 'R',
    time_ago: '1d',
    content:
      'Honest question: what are restaurant managers actually earning in Cape Town right now? I\'m on R22k at a mid-size operation — no bonus structure, no medical. I have 5 years experience and I\'m starting to think I\'m being underpaid. Would love to hear what others are on before I negotiate my review next month.',
    likes: 89,
    comments: 56,
    shares: 7,
    is_anonymous: true,
    featured_reply: {
      author_role: 'Operations Manager · Cape Town',
      content:
        'R22k for 5 years experience is on the lower end right now, especially without benefits. Good restaurant groups are paying R25k–R32k for that level. Medical aid alone is worth R2k+ per month so factor that into any negotiation.',
    },
  },
  {
    id: 'post-5',
    bowl: 'Management Talk',
    author_role: 'Waiter · Johannesburg CBD',
    author_avatar_letter: 'T',
    time_ago: '1d',
    content:
      'Why do some managers think it\'s acceptable to change the roster 12 hours before a shift? This happened to me three times this month. I have a child. I have a life. I arranged transport based on the roster you gave me. There needs to be a legal minimum notice period for roster changes in hospitality — CCMA where are you on this?',
    likes: 211,
    comments: 87,
    shares: 32,
    is_anonymous: true,
    featured_reply: {
      author_role: 'HR Consultant · Hospitality Sector',
      content:
        'Technically the BCEA requires reasonable notice for shift changes. Document every instance — if it\'s a pattern, that\'s a grievance. Most employers back down immediately when an employee references the CCMA formally.',
    },
  },
  {
    id: 'post-6',
    bowl: 'Career Advice',
    author_role: 'Barista · De Waterkant',
    author_avatar_letter: 'A',
    time_ago: '2d',
    content:
      'I\'ve been a barista for 3 years and I genuinely love it, but everyone keeps telling me I need to "move up" into management. I don\'t want to manage people — I want to get better at coffee. Is there a career path in SA specialty coffee that doesn\'t involve becoming a manager? Thinking about competing but not sure how to start.',
    likes: 73,
    comments: 34,
    shares: 6,
    is_anonymous: false,
    author_name: 'Aisha C.',
    featured_reply: {
      author_role: 'Head Barista · Origins Coffee',
      content:
        'Yes absolutely. Pursue WSET Sake, SCA certifications, enter the SA Barista Championships. There\'s a legitimate technical career path as a head barista, trainer, or green buyer. Don\'t let people push you into a management role you don\'t want.',
    },
  },
  {
    id: 'post-7',
    bowl: 'Industry News',
    author_role: 'F&B Director · Sandton',
    author_avatar_letter: 'L',
    time_ago: '2d',
    content:
      'The new tipping feature on South African card machines is genuinely changing behaviour at restaurants. We\'ve tracked a 23% increase in tip frequency since it rolled out — guests who used to only tip with cash are now tipping consistently on card. The money is going directly into the pool. If your venue isn\'t offering card tip prompts yet, your staff are losing money every service.',
    likes: 156,
    comments: 49,
    shares: 21,
    is_anonymous: false,
    author_name: 'Lungelo M.',
  },
  {
    id: 'post-8',
    bowl: 'Work Stories',
    author_role: 'Housekeeping Supervisor · Hermanus',
    author_avatar_letter: 'Z',
    time_ago: '3d',
    content:
      'Guest checked out of the Presidential Suite today and left a R500 tip in an envelope with a handwritten note saying "Thank you for making our anniversary unforgettable." We turned that room three times this week with back-to-back bookings. That note made it all worth it. This is why I\'m in hospitality.',
    likes: 198,
    comments: 29,
    shares: 11,
    is_anonymous: true,
  },
  {
    id: 'post-9',
    bowl: 'Interview Tips',
    author_role: 'Chef de Partie · Cape Town',
    author_avatar_letter: 'D',
    time_ago: '3d',
    content:
      'Getting a kitchen trial shift right matters as much as the interview itself. Three things that will lose you the job during a trial: arriving without your knives, not knowing how to do a basic mise en place under time pressure, and talking too much instead of listening to the team. Show up clean, sharp, quiet, and focused. Let the food do the talking.',
    likes: 144,
    comments: 52,
    shares: 18,
    is_anonymous: true,
    featured_reply: {
      author_role: 'Executive Chef · Stellenbosch',
      content:
        'I\'d add: don\'t ask about pay, leave, or hours during the trial. There\'s time for that after you\'ve impressed us. Asking about benefits before you\'ve proven you can cook is an immediate flag.',
    },
  },
  {
    id: 'post-10',
    bowl: 'Salary Talk',
    author_role: 'Bartender · Cape Town',
    author_avatar_letter: 'J',
    time_ago: '3d',
    content:
      'Broke down my December income: R8,500 base + R11,200 in tips (cash and card) = R19,700 for the month. Not a bad month. The Waterfront during the festive season is unlike anything. January is going to be painful by comparison but December makes it worth it.',
    likes: 283,
    comments: 94,
    shares: 27,
    is_anonymous: true,
    featured_reply: {
      author_role: 'Bar Manager · V&A Waterfront',
      content:
        'December is why we all survive January and February. Smart move is to put half aside during the festive season. Most of us don\'t — I\'ve been in the industry 9 years and I still haven\'t fully cracked the discipline.',
    },
  },
  {
    id: 'post-11',
    bowl: 'Management Talk',
    author_role: 'General Manager · Boutique Hotel',
    author_avatar_letter: 'P',
    time_ago: '4d',
    content:
      'I\'ve been a GM for 6 years and the single best management decision I ever made was switching to a fixed roster two weeks in advance with a formal swap request system. Staff turnover dropped 40% in the first year. People in hospitality don\'t leave for more money as often as people think — they leave because they can\'t plan their lives. Give your team predictability.',
    likes: 317,
    comments: 103,
    shares: 45,
    is_anonymous: false,
    author_name: 'Paula N.',
  },
  {
    id: 'post-12',
    bowl: 'Career Advice',
    author_role: 'Experienced Waiter · Durban',
    author_avatar_letter: 'B',
    time_ago: '4d',
    content:
      'Is a CATHSSETA qualification still worth pursuing in 2025? I\'ve been waitering for 4 years without any formal qualification and I\'m being passed over for supervisory roles at every interview. My manager says experience is enough but the market clearly disagrees.',
    likes: 58,
    comments: 47,
    shares: 8,
    is_anonymous: true,
    featured_reply: {
      author_role: 'Training Manager · Hotel Group',
      content:
        'Yes — a CATHSSETA NQF Level 4 in Hospitality is absolutely still valued, especially for any management track. Many hotel groups require it for supervisor roles. You can do it through FEDHASA or directly through an accredited provider. Some employers will even fund it.',
    },
  },
  {
    id: 'post-13',
    bowl: 'Industry News',
    author_role: 'Events Coordinator · Johannesburg',
    author_avatar_letter: 'M',
    time_ago: '5d',
    content:
      'Cape Town is now officially the top-ranked city in Africa for food tourism according to the latest Condé Nast Traveller data. This is genuinely great news for hospitality workers in the Western Cape — when the destination wins, we all win. Foreign visitor spend on F&B is up 34% year on year. Translate that: more guests, better tips, more hiring.',
    likes: 92,
    comments: 22,
    shares: 19,
    is_anonymous: false,
    author_name: 'Mpho S.',
  },
  {
    id: 'post-14',
    bowl: 'Work Stories',
    author_role: 'Sous Chef · Pretoria',
    author_avatar_letter: 'F',
    time_ago: '5d',
    content:
      'Head Chef called in sick on a Friday night — 120 covers booked, private function in the side room for 40. I ran the kitchen with two CDPs and a commis who\'d been with us for 3 weeks. Service was almost flawless. One cold starter made it out which I\'m still angry about. But we did it. You find out who you are in a kitchen on a night like that.',
    likes: 176,
    comments: 58,
    shares: 13,
    is_anonymous: true,
    featured_reply: {
      author_role: 'Head Chef · Cape Town',
      content:
        'That one cold starter will haunt you for longer than anyone else remembers it. But getting through a 160-cover service understaffed as a sous chef? That\'s the making of a head chef.',
    },
  },
  {
    id: 'post-15',
    bowl: 'Career Advice',
    author_role: 'Front Desk Agent · Cape Town',
    author_avatar_letter: 'G',
    time_ago: '6d',
    content:
      'Made a decision to move from front desk to revenue management and genuinely cannot recommend it enough for people who like hospitality but want to get off shift work. The learning curve on RMS systems and OTA channel management is steep but it\'s desk hours, weekends off eventually, and R5k–R10k more per month at senior level. If you\'re in a 5-star hotel, talk to your revenue manager about shadowing.',
    likes: 115,
    comments: 43,
    shares: 24,
    is_anonymous: true,
    featured_reply: {
      author_role: 'Revenue Manager · Sandton',
      content:
        'I started at front desk too. It took 18 months of persistence and doing extra work unpaid to learn the systems, but it completely changed my career trajectory. If your hotel uses Opera Cloud, start learning the reports side — that\'s your foot in the door.',
    },
  },
]
