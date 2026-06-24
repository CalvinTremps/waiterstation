/**
 * Informational guide articles — target the large "Informational" intent
 * cluster (job descriptions, duties, how-to-become, CV & interview) that
 * listing pages don't serve. Each renders with FAQ schema for PAA / AI Overview.
 */

export interface GuideSection { heading: string; body: string[] }
export interface Guide {
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  intro: string
  sections: GuideSection[]
  faqs: { q: string; a: string }[]
  relatedRole?: string   // links to /jobs/{role}/south-africa
}

export const GUIDES: Guide[] = [
  {
    slug: 'waiter-job-description',
    title: 'Waiter Job Description: Duties, Skills & Requirements',
    seoTitle: 'Waiter Job Description, Duties & Requirements (South Africa)',
    seoDescription: 'A complete waiter / waitress job description for South Africa — key duties, responsibilities, skills, requirements and typical pay.',
    intro: 'A waiter (or waitress) is the face of a restaurant — taking orders, serving food and drinks, and making sure every guest has a great experience. Here is a full job description you can use whether you are applying or hiring.',
    sections: [
      { heading: 'Key duties & responsibilities', body: [
        'Greet and seat guests, present menus and answer questions about dishes and drinks.',
        'Take accurate food and beverage orders and enter them into the POS system.',
        'Serve food and drinks promptly, check back on tables, and handle special requests.',
        'Upsell specials, wine and desserts, and process payments accurately.',
        'Set, clear and reset tables, and keep service stations clean and stocked.',
      ] },
      { heading: 'Skills & requirements', body: [
        'Friendly, well-presented and able to stay calm under pressure during busy service.',
        'Good communication and basic numeracy for handling bills and cash-ups.',
        'Ability to stand and carry plates for long shifts, including evenings and weekends.',
        'Matric is helpful but not always required; some venues train entry-level waiters.',
      ] },
      { heading: 'Typical pay in South Africa', body: [
        'Base pay usually runs R3,500–R6,000/month, with tips often doubling take-home — especially at busy, tourist-heavy venues.',
      ] },
    ],
    faqs: [
      { q: 'What does a waiter do?', a: 'A waiter greets guests, takes and serves food and drink orders, manages tables, upsells specials, and processes payments while delivering friendly, attentive service.' },
      { q: 'What skills does a waiter need?', a: 'Strong communication, a friendly manner, good memory and numeracy, stamina for long shifts, and the ability to stay calm and organised during busy service.' },
      { q: 'Do you need experience to be a waiter?', a: 'Not always — many South African restaurants hire entry-level waiters and train them, though fine-dining venues usually prefer some prior service experience.' },
    ],
    relatedRole: 'waiter',
  },
  {
    slug: 'how-to-become-a-chef',
    title: 'How to Become a Chef in South Africa',
    seoTitle: 'How to Become a Chef in South Africa (Steps & Qualifications)',
    seoDescription: 'Step-by-step guide to becoming a chef in South Africa — qualifications, culinary schools, apprenticeships, and how to work your way up a kitchen brigade.',
    intro: 'Becoming a chef in South Africa is part training, part hard graft in real kitchens. Here is how the path usually works, from commis chef to head chef.',
    sections: [
      { heading: 'The kitchen career ladder', body: [
        'Commis chef → Chef de Partie → Sous Chef → Head/Executive Chef. Most chefs start at the bottom and earn promotions through skill and consistency.',
      ] },
      { heading: 'Qualifications & training', body: [
        'A professional cookery qualification (e.g. a City & Guilds or an accredited culinary school diploma) helps, but is not always required to start.',
        'Many chefs train on the job as a commis or kitchen assistant while studying part-time.',
        'A CATHSSETA-accredited programme is widely recognised by South African employers.',
      ] },
      { heading: 'Tips to progress faster', body: [
        'Master the basics — knife skills, mise en place and consistency — before chasing fancy techniques.',
        'Stage (do trial shifts) at venues you admire, and treat every service as a learning opportunity.',
      ] },
    ],
    faqs: [
      { q: 'What qualifications do you need to be a chef in South Africa?', a: 'You can start as a commis chef without formal qualifications, but an accredited culinary diploma (e.g. CATHSSETA or City & Guilds) speeds up progression to Chef de Partie and beyond.' },
      { q: 'How long does it take to become a chef?', a: 'Reaching Chef de Partie typically takes 2–4 years of kitchen experience; becoming a Head Chef usually takes 8–10+ years depending on the venue and your progress.' },
    ],
    relatedRole: 'chef',
  },
  {
    slug: 'hospitality-cv',
    title: 'How to Write a Hospitality CV (with Example)',
    seoTitle: 'Hospitality CV: How to Write One That Gets Interviews',
    seoDescription: 'How to write a one-page hospitality CV for waiter, bartender, chef and hotel jobs in South Africa — structure, what to include, and a simple example.',
    intro: 'Hospitality managers skim CVs fast. A clear, one-page CV that shows your service experience and availability beats a long, generic one every time.',
    sections: [
      { heading: 'What to include', body: [
        'Contact details and the role/area you are looking for.',
        'A two-line summary: experience level, strengths, and your availability (shifts, weekends).',
        'Work history with venue type, role and key duties — newest first.',
        'Skills: POS systems, wine/cocktail knowledge, languages, and any certificates.',
      ] },
      { heading: 'Tips that get interviews', body: [
        'Keep it to one page and tailor the summary to each venue.',
        'Quantify where you can ("served 80-cover sections", "ran a 6-seat bar").',
        'List availability clearly — managers hire for the shifts they need to fill.',
      ] },
    ],
    faqs: [
      { q: 'What should a hospitality CV include?', a: 'Contact details, a short summary with your availability, work history (venue type, role, duties), and skills like POS systems, languages and service certificates — ideally on one page.' },
      { q: 'Do I need a CV to apply for hospitality jobs?', a: 'On Waiterstation you can apply with just your name and phone number, but a one-page CV helps for interviews and for roles at hotels and fine-dining venues.' },
    ],
  },
  {
    slug: 'restaurant-interview-questions',
    title: 'Common Restaurant & Waiter Interview Questions',
    seoTitle: 'Waiter & Restaurant Interview Questions (and How to Answer)',
    seoDescription: 'The most common waiter, bartender and restaurant interview questions in South Africa — with tips on how to answer and what managers look for.',
    intro: 'Restaurant interviews are often short and practical. Managers want to see that you are reliable, friendly under pressure, and a team player.',
    sections: [
      { heading: 'Questions you can expect', body: [
        '“Tell me about a time you dealt with a difficult guest.”',
        '“How do you handle a busy section when you’re in the weeds?”',
        '“What does good service mean to you?”',
        '“What’s your availability, and can you work weekends and public holidays?”',
      ] },
      { heading: 'How to stand out', body: [
        'Give short, specific examples from real shifts rather than generic answers.',
        'Show you’re a team player — managers hire for attitude and reliability.',
        'Ask about the menu and venue; arriving prepared signals genuine interest.',
      ] },
    ],
    faqs: [
      { q: 'How do I prepare for a waiter interview?', a: 'Research the venue and menu, prepare two or three real service examples, dress neatly, and be ready to talk clearly about your availability and why you enjoy hospitality.' },
      { q: 'What do restaurant managers look for?', a: 'Reliability, a friendly attitude, the ability to stay calm under pressure, teamwork, and flexible availability for evenings and weekends.' },
    ],
  },
]

const BY_SLUG = new Map(GUIDES.map(g => [g.slug, g]))
export const getGuide = (slug: string) => BY_SLUG.get(slug) ?? null
