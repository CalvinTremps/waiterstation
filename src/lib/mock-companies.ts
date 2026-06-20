export interface CompanyReview {
  id: string
  role: string
  employment_status: 'Current' | 'Former'
  rating: number
  date: string
  pros: string
  cons: string
  anonymous: boolean
  author_name?: string
  helpful_count: number
  salary?: string
}

export interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
  description: string
  overall_rating: number
  ratings: {
    work_life_balance: number
    culture: number
    management: number
    career_growth: number
    compensation: number
  }
  benefits: string[]
  reviews: CompanyReview[]
  website?: string
  logo_url?: string
}

export const MOCK_COMPANIES: Company[] = [

  // ─── RESTAURANT GROUPS ───────────────────────────────────────────────────────

  {
    id: 'spur-corporation',
    name: 'Spur Corporation',
    industry: 'Restaurant Group',
    size: '1 000+ employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: 'Spur Corporation is one of South Africa\'s largest and most recognised restaurant groups, operating the Spur Steak Ranches, Panarottis Pizza Pasta, John Dory\'s Fish & Grill, RocoMamas Burgers & Shakes, and The Hussar Grill brands. With over 600 restaurants across South Africa and beyond, Spur offers structured career pathways, national training programmes, and the stability of a JSE-listed company. A great starting point for anyone entering the hospitality industry.',
    overall_rating: 3.7,
    ratings: { work_life_balance: 3.4, culture: 3.9, management: 3.6, career_growth: 3.8, compensation: 3.5 },
    benefits: ['Staff meals on shift', 'Tips kept by waiter', 'Provident fund', 'Structured training programme', 'Internal promotion pathway', 'Annual performance bonus'],
    website: 'spur.co.za',
    logo_url: 'https://logo.clearbit.com/spur.co.za',
    reviews: [
      { id: 'spur-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Consistent income because of the volume — Spur is always busy. Tips are decent on family weekends. Training is thorough and they genuinely care about service standards. Provident fund is a plus.', cons: 'Weekend and school holiday rushes are relentless. Some franchise owners run their restaurants very differently from the group standards. Pay increases are slow.', anonymous: true, helpful_count: 22, salary: 'R5 800/month + tips' },
      { id: 'spur-r2', role: 'Kitchen Supervisor', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Great brand to have on your CV. The group\'s supply chain means you always have consistent product. Internal promotion from junior cook to supervisor is real — I\'ve seen it happen multiple times.', cons: 'The food is simple but the volume is high. It can feel repetitive after a few years. Head office initiatives sometimes feel disconnected from floor reality.', anonymous: false, author_name: 'Lungelo M.', helpful_count: 15, salary: 'R11 500/month' },
      { id: 'spur-r3', role: 'Hostess', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'Good first job. Safe environment, always busy. The regular families who come in are sweet.', cons: 'Pay is low for the chaos of a busy Saturday. Some customers treat hostesses like they\'re invisible.', anonymous: true, helpful_count: 8, salary: 'R5 200/month' },
    ],
  },

  {
    id: 'nandos-sa',
    name: "Nando's South Africa",
    industry: 'Restaurant Chain',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "Nando's is a South African-born global restaurant brand famous for its PERi-PERi flame-grilled chicken. Founded in Johannesburg in 1987, Nando's now operates over 1 200 restaurants in 30+ countries, with more than 300 locations across South Africa. The culture is bold, irreverent, and people-first — heavily influenced by its Portuguese-Mozambican roots. Nando's invests significantly in staff development and is widely regarded as one of the better hospitality employers in the country.",
    overall_rating: 4.0,
    ratings: { work_life_balance: 3.6, culture: 4.5, management: 3.9, career_growth: 4.1, compensation: 3.7 },
    benefits: ['Free meal per shift', 'Tips kept by staff', 'Nando\'s card (discounted meals)', 'Medical aid contribution', 'Bursary programme', 'Rapid promotion pathway', 'Annual Awards Night'],
    website: 'nandos.co.za',
    logo_url: 'https://logo.clearbit.com/nandos.co.za',
    reviews: [
      { id: 'nan-r1', role: 'Cashier / FOH', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'The culture is genuinely the best part — there\'s real energy and they hire people with personality. Free chicken every shift is not nothing. The Nando\'s card for discounted meals at any branch is a great perk. Management at most franchises respects the team.', cons: 'Lunchtime and Friday evening rushes are extremely fast-paced. Some franchise owners don\'t always uphold Nando\'s group standards. The music is sometimes just too loud.', anonymous: true, helpful_count: 34, salary: 'R5 500/month + tips' },
      { id: 'nan-r2', role: 'Restaurant Manager', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Nando\'s gives managers real autonomy. The group supports you with systems and training but you run your own floor. International exposure exists if you perform — managers have moved to the UK, Australia, Canada.', cons: 'The responsibility is high. Franchise model means your experience depends heavily on your franchisee. Month-end reporting can be time-consuming.', anonymous: false, author_name: 'Priya N.', helpful_count: 27, salary: 'R22 000/month' },
      { id: 'nan-r3', role: 'Grill Chef', employment_status: 'Former', rating: 4, date: '2025-05', pros: 'You learn the product inside and out. PERi-PERi expertise is actually transferable — restaurants value it. Fast-paced kitchen with a positive team culture at the branch I was at.', cons: 'The grill station gets extremely hot in summer. Working evenings until close can drag on public holidays.', anonymous: true, helpful_count: 12, salary: 'R7 200/month' },
    ],
  },

  {
    id: 'ocean-basket',
    name: 'Ocean Basket',
    industry: 'Restaurant Chain',
    size: '500–1 000 employees',
    location: 'Pretoria (HQ) · Nationwide',
    description: 'Ocean Basket is South Africa\'s most beloved seafood restaurant chain, known for its affordable, generously portioned fish and seafood in a relaxed, family-friendly setting. Founded in 1995, the brand has grown to over 200 restaurants across South Africa and internationally. Ocean Basket is recognised as one of the most accessible seafood dining experiences in the country, with a loyal following and consistent high volumes.',
    overall_rating: 3.6,
    ratings: { work_life_balance: 3.3, culture: 3.8, management: 3.5, career_growth: 3.4, compensation: 3.5 },
    benefits: ['Staff meals', 'Tips kept by waiter', 'Franchise training programme', 'Public holiday premium', 'Staff discount on food'],
    website: 'oceanbasket.com',
    logo_url: 'https://logo.clearbit.com/oceanbasket.com',
    reviews: [
      { id: 'ob-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Busy restaurant means good tips, especially on weekends and school holidays. Customers generally love the food which makes service enjoyable. Colleagues are friendly.', cons: 'Very fast-paced — you can be running six tables alone on a Saturday. Seafood smell in your hair and uniform is unavoidable. Parking at mall branches can be a pain.', anonymous: true, helpful_count: 19, salary: 'R5 500/month + tips' },
      { id: 'ob-r2', role: 'Kitchen Hand', employment_status: 'Former', rating: 3, date: '2025-08', pros: 'Structured training. The brand is reliable and always busy so work is consistent. Good for gaining kitchen experience.', cons: 'The kitchen is very hot and the seafood prep is repetitive. Pay is at minimum wage level.', anonymous: true, helpful_count: 7, salary: 'R4 500/month' },
      { id: 'ob-r3', role: 'Floor Supervisor', employment_status: 'Former', rating: 3, date: '2025-04', pros: 'Good stepping stone in a management career. The brand is well-known so it opens doors.', cons: 'Communication from franchise owner was poor. Rota changes at short notice were common.', anonymous: true, helpful_count: 5 },
    ],
  },

  {
    id: 'tashas',
    name: "Tashas",
    industry: 'Café / Restaurant',
    size: '201–500 employees',
    location: 'Johannesburg · Cape Town · Dubai',
    description: "Tashas is a premium South African café-restaurant brand founded by Natasha Sideris, known for its beautifully designed interiors, all-day dining menu, and celebrity clientele. Operating high-end locations across Johannesburg's northern suburbs, Cape Town, and internationally in Dubai and Abu Dhabi, Tashas sets a very high bar for presentation, service, and product quality. Working at Tashas is fast-paced, stylish, and demanding.",
    overall_rating: 3.9,
    ratings: { work_life_balance: 3.2, culture: 4.1, management: 3.7, career_growth: 3.8, compensation: 3.9 },
    benefits: ['Uniform provided', 'Staff meals on shift', 'Tips kept by waiter', 'International transfer opportunities', 'F&B skills training', 'High-profile brand exposure'],
    website: 'tashas.co.za',
    logo_url: 'https://logo.clearbit.com/tashas.co.za',
    reviews: [
      { id: 'tashas-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'The clientele is top-end and the tips reflect that — a good Saturday can net you R800+ in tips alone. The brand is beautiful to work in. Standards are high which actually makes you a better server.', cons: 'Management is very strict about presentation and standards. The pace during brunch on weekends is relentless. Working in Sandton can be exhausting with traffic.', anonymous: true, helpful_count: 31, salary: 'R6 500/month + tips (R3 000–R7 000/month)' },
      { id: 'tashas-r2', role: 'Barista', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Quality coffee, quality beans. The brand is serious about coffee and invests in training. Working at a Tashas branch looks excellent on your CV.', cons: 'The morning rush (7:30–10am) is absolutely intense. Very little room for error with the clientele.', anonymous: false, author_name: 'Aisha K.', helpful_count: 18, salary: 'R6 200/month' },
      { id: 'tashas-r3', role: 'Floor Manager', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'Premium brand, premium experience. Operations are well-structured. International expansion means real growth opportunities.', cons: 'Expectations are very high and deadlines are tight. Work-life balance is challenging at management level.', anonymous: true, helpful_count: 14 },
    ],
  },

  {
    id: 'mugg-and-bean',
    name: 'Mugg & Bean',
    industry: 'Café / Restaurant',
    size: '500–1 000 employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Mugg & Bean is one of South Africa's most recognisable coffee and casual dining brands, owned by Famous Brands. Known for its generous portions, big mugs of coffee, and mall-based locations nationwide, Mugg & Bean is a constant in South African food culture. The brand serves breakfast, lunch, and dinner and is particularly popular for family dining and business meetings.",
    overall_rating: 3.5,
    ratings: { work_life_balance: 3.3, culture: 3.7, management: 3.4, career_growth: 3.5, compensation: 3.4 },
    benefits: ['Staff meals', 'Tips kept by waiter', 'Famous Brands group training', 'Internal promotion pathway', 'Provident fund (management level)'],
    website: 'muggandbean.co.za',
    logo_url: 'https://logo.clearbit.com/muggandbean.co.za',
    reviews: [
      { id: 'mb-r1', role: 'Waiter', employment_status: 'Current', rating: 3, date: '2025-11', pros: 'Consistent work — Mugg & Bean is always open and always busy. Good for someone starting out. Regulars tip well. The food is popular so customers are mostly happy.', cons: 'Mall environment can feel monotonous. Tips vary a lot by location. Some franchise owners don\'t treat staff with respect.', anonymous: true, helpful_count: 14, salary: 'R5 200/month + tips' },
      { id: 'mb-r2', role: 'Barista', employment_status: 'Former', rating: 3, date: '2025-08', pros: 'Good introduction to coffee. The volume builds your speed fast. Training from Famous Brands is structured.', cons: 'The coffee quality could be higher for a coffee-focused brand. The pace is relentless in the mornings.', anonymous: true, helpful_count: 9, salary: 'R5 500/month' },
      { id: 'mb-r3', role: 'Restaurant Manager', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Famous Brands group gives you resources other independents don\'t have. The systems are solid. Real progression to area manager is possible.', cons: 'Mall trading hours mean you work weekends and public holidays without exception. Franchise owners vary significantly in quality.', anonymous: false, author_name: 'Sifiso T.', helpful_count: 11, salary: 'R18 000/month' },
    ],
  },

  {
    id: 'the-test-kitchen',
    name: 'The Test Kitchen',
    industry: 'Fine Dining Restaurant',
    size: '11–50 employees',
    location: 'Cape Town, Woodstock',
    description: "The Test Kitchen is South Africa's most acclaimed fine dining restaurant, helmed by Chef Luke Dale Roberts. Located in The Old Biscuit Mill in Woodstock, it has held the title of Africa's Best Restaurant and consistently ranks among the world's top dining destinations. The kitchen produces boundary-pushing, experimental cuisine that has influenced an entire generation of South African chefs. Working at The Test Kitchen is considered the pinnacle of culinary achievement in South Africa.",
    overall_rating: 4.1,
    ratings: { work_life_balance: 2.8, culture: 4.3, management: 3.9, career_growth: 4.8, compensation: 3.2 },
    benefits: ['Mentorship from Luke Dale Roberts', 'World-class culinary training', 'Strong international alumni network', 'Staff tasting menus', 'CV value — opens doors globally'],
    website: 'thetestkitchen.co.za',
    logo_url: 'https://logo.clearbit.com/thetestkitchen.co.za',
    reviews: [
      { id: 'ttk-r1', role: 'Commis Chef', employment_status: 'Former', rating: 4, date: '2025-10', pros: 'The most technically demanding and rewarding kitchen I\'ve ever worked in. You learn things here that you simply cannot learn elsewhere in Africa. Luke\'s team sets an international standard. The alumni network is genuinely powerful — I had two overseas offers within months of leaving.', cons: 'The hours are punishing — 14-hour days are common and the kitchen is high-pressure. Pay does not reflect the standard of work required. You do it for the career trajectory, not the salary.', anonymous: false, author_name: 'Marco A.', helpful_count: 47, salary: 'R9 000/month' },
      { id: 'ttk-r2', role: 'Sous Chef', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'This restaurant changed my career. I\'ve cooked in London and Lisbon since leaving and TTK opened every door. The creativity is extraordinary and the standards are uncompromising.', cons: 'Work-life balance essentially does not exist. It is a sacrifice role — you give everything to the kitchen for a season and collect the rewards later.', anonymous: true, helpful_count: 38, salary: 'R15 000/month' },
      { id: 'ttk-r3', role: 'Front of House Manager', employment_status: 'Former', rating: 4, date: '2025-03', pros: 'The service standard is the best in Africa. Working FOH here teaches you what hospitality at its highest level looks like. The experience is irreplaceable.', cons: 'Guest expectations are stratospheric and mistakes are not tolerated. Pressure is constant. The restaurant\'s fame means media scrutiny too.', anonymous: true, helpful_count: 22 },
    ],
  },

  {
    id: 'la-colombe',
    name: 'La Colombe',
    industry: 'Fine Dining Restaurant',
    size: '11–50 employees',
    location: 'Constantia, Cape Town',
    description: "La Colombe is one of the Cape's most celebrated fine dining restaurants, nestled in the Constantia Uitsig Wine Estate. Under Chef James Gaag, the restaurant consistently ranks among the top restaurants in Africa and the world. Known for its French-influenced contemporary cuisine, exceptional wine list, and mountain views, La Colombe is a destination restaurant that attracts discerning guests from around the globe.",
    overall_rating: 4.2,
    ratings: { work_life_balance: 3.0, culture: 4.4, management: 4.1, career_growth: 4.6, compensation: 3.3 },
    benefits: ['Chef mentorship programme', 'Staff tasting menu experiences', 'Wine education', 'Strong industry reputation', 'International career pathways'],
    website: 'lacolombe.co.za',
    logo_url: 'https://logo.clearbit.com/lacolombe.co.za',
    reviews: [
      { id: 'lc-r1', role: 'Chef de Partie', employment_status: 'Former', rating: 4, date: '2025-09', pros: 'The food we produced every day was genuinely world-class. La Colombe has the best pantry in South Africa. The team of chefs here are passionate and incredibly skilled. Your CV with La Colombe on it is golden globally.', cons: 'Long hours with moderate pay. The pressure of keeping a restaurant at this level is enormous. Personal life takes a back seat.', anonymous: true, helpful_count: 29, salary: 'R12 000/month' },
      { id: 'lc-r2', role: 'Sommelier', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'The wine list is extraordinary and I learn something every single day. Guests are knowledgeable and appreciate good recommendations. Wine training budget exists. Tips from fine dining are excellent.', cons: 'Fine dining service can be emotionally exhausting — perfection is expected every evening. The drive to Constantia from the city can be tough without a car.', anonymous: false, author_name: 'Brendan F.', helpful_count: 33, salary: 'R14 000/month + tips' },
      { id: 'lc-r3', role: 'Pastry Chef', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'La Colombe pushes creative boundaries in pastry. You have freedom to experiment within a framework of excellence. The team respects craft.', cons: 'Pastry often starts before everyone else and finishes after. The precision required is extreme and mistakes are costly.', anonymous: true, helpful_count: 17 },
    ],
  },

  {
    id: 'marble-restaurant',
    name: 'Marble Johannesburg',
    industry: 'Fine Dining / Steakhouse',
    size: '51–100 employees',
    location: 'Rosebank, Johannesburg',
    description: 'Marble is one of Johannesburg\'s most prestigious restaurant experiences, founded by Chef David Higgs and Gary Kyriacou. Perched on a rooftop in Rosebank with dramatic open-fire cooking, Marble is known for its dry-aged beef, wood-fired meats, and exceptional drinks programme. The restaurant has earned widespread acclaim and is one of the most Instagrammed dining experiences in South Africa. Marble sets extremely high standards for both kitchen and front of house.',
    overall_rating: 4.0,
    ratings: { work_life_balance: 3.1, culture: 4.2, management: 3.9, career_growth: 4.3, compensation: 3.7 },
    benefits: ['Staff tasting experience', 'Wine and spirits training', 'High-tip environment', 'Prestigious CV entry', 'David Higgs mentorship culture'],
    website: 'marble.restaurant',
    logo_url: 'https://logo.clearbit.com/marble.restaurant',
    reviews: [
      { id: 'mrbl-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'The tips are among the best in Joburg — Marble attracts serious spenders. The environment is stunning and you feel proud to work here. Chef David sets a culture of excellence that filters down. Service training is top tier.', cons: 'The expectation level is extremely high and management notices everything. December is completely relentless with back-to-back full services. Getting to Rosebank can be expensive without your own transport.', anonymous: true, helpful_count: 26, salary: 'R7 500/month + tips (R4 000–R9 000/month)' },
      { id: 'mrbl-r2', role: 'Line Chef', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Working at a wood-fire station at Marble teaches you techniques you don\'t learn anywhere else. The produce quality is the best in the city. David Higgs is actually present and cooking which is rare for a chef at his level.', cons: 'The fire station is brutally hot in summer. Long prep hours before service are intense. The kitchen moves at an elite pace that takes months to adapt to.', anonymous: false, author_name: 'Themba S.', helpful_count: 21, salary: 'R13 000/month' },
      { id: 'mrbl-r3', role: 'Bar Manager', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'Marble\'s drinks programme is one of the most sophisticated in Joburg. Real creative latitude at the bar. Great brand to have in your career story.', cons: 'The rooftop exposure means cold nights in June/July are tough on the team. Expectation to upsell is constant pressure.', anonymous: true, helpful_count: 13 },
    ],
  },

  {
    id: 'rocomamas',
    name: 'RocoMamas',
    industry: 'Restaurant Chain',
    size: '201–500 employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: 'RocoMamas is a smash burger and craft beer brand under the Spur Corporation umbrella, known for its loud, energetic atmosphere and freaky good burgers. Targeting a younger, trend-conscious demographic, RocoMamas has grown rapidly across South Africa with a strong social media presence and dedicated fanbase. The restaurant experience is deliberately casual and high-energy, and the team culture reflects this.',
    overall_rating: 3.6,
    ratings: { work_life_balance: 3.2, culture: 4.1, management: 3.5, career_growth: 3.4, compensation: 3.5 },
    benefits: ['Staff meals', 'Tips kept by staff', 'Spur Corporation group benefits', 'Energetic team culture', 'Training programme'],
    website: 'rocomamas.com',
    logo_url: 'https://logo.clearbit.com/rocomamas.com',
    reviews: [
      { id: 'roco-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Fun place to work — the vibe is genuinely energetic and the team is young. Tips from the after-work crowd and sports events are good. The uniform is cool and customers are chill.', cons: 'Evenings and weekends are loud and chaotic. Table management during big sports events is very stressful. Some franchises are better managed than others.', anonymous: true, helpful_count: 16, salary: 'R5 500/month + tips' },
      { id: 'roco-r2', role: 'Burger Artist (Kitchen)', employment_status: 'Former', rating: 3, date: '2025-08', pros: 'Fun product to cook. The smash technique is satisfying once you nail it. Team is lively and management at my branch was decent.', cons: 'Very repetitive. The burger rush on Friday evening is relentless. No air conditioning in the kitchen.', anonymous: true, helpful_count: 8, salary: 'R5 800/month' },
      { id: 'roco-r3', role: 'Branch Manager', employment_status: 'Former', rating: 3, date: '2025-05', pros: 'Spur Corporation gives managers solid operational support. The brand is growing and there is room to progress.', cons: 'Managing a young team can be unpredictable. Late-night trading hours mean you don\'t leave until well after midnight on weekends.', anonymous: false, author_name: 'Johan V.', helpful_count: 10 },
    ],
  },

  {
    id: 'hussar-grill',
    name: 'The Hussar Grill',
    industry: 'Steakhouse',
    size: '201–500 employees',
    location: 'Nationwide',
    description: 'The Hussar Grill is a South African steakhouse institution, with roots stretching back to 1964. Now part of the Spur Corporation portfolio, The Hussar Grill operates across South Africa and is known for its premium dry-aged steaks, wood-fired grills, and classic upscale steakhouse experience. A favourite for business lunches and celebratory dinners, The Hussar Grill positions itself at the premium end of casual fine dining.',
    overall_rating: 3.8,
    ratings: { work_life_balance: 3.4, culture: 3.8, management: 3.7, career_growth: 3.6, compensation: 3.8 },
    benefits: ['Staff meals', 'High-tip environment', 'Spur group training', 'Provident fund', 'Annual bonus at management level'],
    website: 'hussargrill.com',
    logo_url: 'https://logo.clearbit.com/hussargrill.com',
    reviews: [
      { id: 'hg-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'The clientele spends generously — a good tip night at Hussar beats most restaurants in South Africa. The food is excellent and guests arrive in a good mood. Management is professional.', cons: 'Long service periods with minimal breaks. Expectations around wine knowledge are high and not always supported with training. Uniform standards are strict.', anonymous: true, helpful_count: 18, salary: 'R6 500/month + tips (R4 000–R8 000/month)' },
      { id: 'hg-r2', role: 'Grill Chef', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Working the grill at a premium steakhouse sharpens your skills fast. The dry-aged beef programme is impressive and chefs are given real autonomy over their station.', cons: 'Grill station heat is intense. Friday and Saturday dinner service is back-to-back for hours with no downtime.', anonymous: false, author_name: 'Ruan P.', helpful_count: 13, salary: 'R12 000/month' },
      { id: 'hg-r3', role: 'Floor Manager', employment_status: 'Former', rating: 4, date: '2025-04', pros: 'A very well-run brand with proper operational structure. Good place to develop management skills in a formal environment.', cons: 'Late nights are the norm. Spur Corporation reporting requirements add admin pressure.', anonymous: true, helpful_count: 7 },
    ],
  },

  {
    id: 'doppio-zero',
    name: 'Doppio Zero',
    industry: 'Café / Bakery / Restaurant',
    size: '201–500 employees',
    location: 'Johannesburg · Cape Town · Pretoria',
    description: "Doppio Zero is a well-loved South African café-restaurant brand with a strong Italian food identity — handmade pasta, wood-fired pizza, and exceptional pastry. Operating across Johannesburg, Cape Town, and Pretoria, Doppio Zero attracts a loyal, design-conscious clientele who return for the all-day menu and excellent coffee. The brand is known for its beautiful restaurant environments and high product quality.",
    overall_rating: 3.8,
    ratings: { work_life_balance: 3.5, culture: 4.0, management: 3.7, career_growth: 3.5, compensation: 3.7 },
    benefits: ['Staff meals', 'Tips kept by waiter', 'Barista training', 'Product knowledge training (Italian food & wine)', 'Staff discount'],
    website: 'doppiozero.com',
    logo_url: 'https://logo.clearbit.com/doppiozero.com',
    reviews: [
      { id: 'dz-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Beautiful restaurants, great food — it\'s a pleasure to serve. Customers are generally well-behaved and appreciative. Tips in the Joburg northern suburbs locations are very good. Staff meals (pasta!) are excellent.', cons: 'Weekends can be relentlessly busy. The Italian food focus means you need product knowledge that isn\'t always well-supported with training.', anonymous: true, helpful_count: 20, salary: 'R6 000/month + tips' },
      { id: 'dz-r2', role: 'Pasta Chef', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Best handmade pasta operation in South Africa at scale. You genuinely hone Italian technique. Management respects the kitchen craft.', cons: 'Handmade pasta at volume is physically demanding. The prep shift starts very early.', anonymous: false, author_name: 'Carla E.', helpful_count: 15, salary: 'R10 500/month' },
      { id: 'dz-r3', role: 'Barista', employment_status: 'Former', rating: 3, date: '2025-06', pros: 'Good coffee training. Consistent customers who know what they want. Nice environment to work in.', cons: 'Morning rush is intense. Pay is on the lower side for skilled baristas.', anonymous: true, helpful_count: 8, salary: 'R5 800/month' },
    ],
  },

  // ─── HOTELS ─────────────────────────────────────────────────────────────────

  {
    id: 'sun-international',
    name: 'Sun International',
    industry: 'Hotel & Casino Group',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "Sun International is one of South Africa's premier hotel, resort, and gaming groups, operating iconic properties including Sun City Resort, The Palace of the Lost City, the Table Bay Hotel in Cape Town, and The Maslow in Sandton. As a JSE-listed company with properties across Sub-Saharan Africa, Sun International offers unmatched career pathways, structured training, and the prestige of working in some of Africa's most celebrated hospitality destinations.",
    overall_rating: 3.9,
    ratings: { work_life_balance: 3.5, culture: 3.8, management: 3.7, career_growth: 4.2, compensation: 3.8 },
    benefits: ['Medical aid', 'Provident fund', 'Staff accommodation at resorts', 'Meals on shift', 'Sun International hotel discounts', 'Structured career development', 'Annual incentive bonus'],
    website: 'suninternational.com',
    logo_url: 'https://logo.clearbit.com/suninternational.com',
    reviews: [
      { id: 'sun-r1', role: 'Front Desk Manager', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'Working at Sun City is genuinely incredible — the scale of the resort is unlike anything else in Africa. The training programmes are excellent and the group takes development seriously. Medical aid and provident fund are properly administered.', cons: 'Sun City is remote — you need to commit to the lifestyle. Shift work is constant including public holidays. Corporate bureaucracy can slow decision-making.', anonymous: true, helpful_count: 27, salary: 'R18 500/month' },
      { id: 'sun-r2', role: 'Sous Chef', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Cooking for 500+ guests at a resort teaches you scale and operational discipline. The group\'s purchasing power means good ingredients. Real promotion pathways exist within the group — I\'ve moved up twice.', cons: 'Resort kitchens operate on a different pace to restaurant kitchens — volume over creativity. The remoteness of some properties can be isolating.', anonymous: false, author_name: 'Tumi M.', helpful_count: 19, salary: 'R19 000/month' },
      { id: 'sun-r3', role: 'Food & Beverage Attendant', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'Stable employment with a reputable company. Benefits are properly administered. The resort experience is unique.', cons: 'Volume-driven operations can feel impersonal. Career progression at the attendant level requires patience. Living on-site has its challenges.', anonymous: true, helpful_count: 12, salary: 'R7 500/month' },
    ],
  },

  {
    id: 'tsogo-sun-hotels',
    name: 'Tsogo Sun Hotels',
    industry: 'Hotel Group',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "Tsogo Sun Hotels is one of Africa's largest hotel management companies, operating over 100 properties across Southern Africa under brands including Southern Sun, Garden Court, StayEasy, Sandton Sun, and InterContinental. With a diverse portfolio ranging from budget to luxury, Tsogo Sun offers career opportunities at every level of the hospitality ladder. The group is known for strong HR structures, national training programmes, and genuine internal promotion pathways.",
    overall_rating: 3.8,
    ratings: { work_life_balance: 3.5, culture: 3.8, management: 3.6, career_growth: 4.1, compensation: 3.7 },
    benefits: ['Medical aid', 'Provident fund', 'Staff meals', 'Hotel rate discounts across portfolio', 'Tsogo hospitality academy', 'Annual performance reviews', 'Long-service awards'],
    website: 'tsogosunhotels.com',
    logo_url: 'https://logo.clearbit.com/tsogosunhotels.com',
    reviews: [
      { id: 'ts-r1', role: 'Receptionist', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Tsogo Sun is the most professionally run hotel group in South Africa from an HR perspective. Benefits are well-administered. The variety of properties means you can transfer within the group. Opera PMS training is excellent and portable.', cons: 'Shift work including night audit is part of the job at any hotel. Some properties are better managed than others. Pay increases at the receptionist level are slow.', anonymous: true, helpful_count: 24, salary: 'R8 500/month' },
      { id: 'ts-r2', role: 'F&B Manager', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Managing across multiple outlets at a Tsogo Sun property gives you broad experience. The company supports managers with proper systems and resources. I\'ve moved between three properties and each transfer improved my career significantly.', cons: 'Corporate reporting is heavy. Month-end close requires a lot of admin. The pace during peak season is relentless across all outlets simultaneously.', anonymous: false, author_name: 'Nomvula Z.', helpful_count: 18, salary: 'R26 000/month' },
      { id: 'ts-r3', role: 'Housekeeping Attendant', employment_status: 'Former', rating: 3, date: '2025-06', pros: 'Stable, structured employment. UIF and benefits properly managed. The company treats housekeeping staff with more respect than many independents do.', cons: 'Physical workload is high. Room quota per shift can be demanding. Housekeeping is often the last to receive equipment upgrades.', anonymous: true, helpful_count: 11, salary: 'R7 200/month' },
    ],
  },

  {
    id: 'city-lodge-hotels',
    name: 'City Lodge Hotels',
    industry: 'Hotel Group',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "City Lodge Hotels is a JSE-listed South African hotel group operating over 60 properties across South Africa, Botswana, Kenya, Mozambique, Tanzania, Uganda, and Zambia. Operating brands including City Lodge, Courtyard, Town Lodge, Road Lodge, and Newmark Hotels, the group serves business travellers and tourists across the continent. City Lodge is known for consistent service standards, strong HR policies, and genuine internal career development.",
    overall_rating: 3.9,
    ratings: { work_life_balance: 3.7, culture: 3.9, management: 3.8, career_growth: 4.0, compensation: 3.7 },
    benefits: ['Medical aid contribution', 'Provident fund', 'Staff accommodation discounts', 'Annual leave', 'Structured training', 'Internal mobility across portfolio'],
    website: 'citylodge.co.za',
    logo_url: 'https://logo.clearbit.com/citylodge.co.za',
    reviews: [
      { id: 'cl-r1', role: 'Night Auditor', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'City Lodge runs the best night audit training in South Africa. The systems are solid. The company is stable — no risk of the property closing suddenly. Quiet nights give you time to study.', cons: 'Night shift is hard on your health and social life long-term. Dealing with unhappy guests at 3am with no manager available is stressful.', anonymous: true, helpful_count: 16, salary: 'R9 000/month' },
      { id: 'cl-r2', role: 'Restaurant Manager', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Structured environment — you know exactly what is expected. The group has good SOPs and the kitchen is properly resourced. Real management support exists.', cons: 'Business travel hotels can feel monotonous — the F&B offering is limited by the property type. Less creativity than an independent restaurant.', anonymous: false, author_name: 'Warren G.', helpful_count: 13, salary: 'R20 000/month' },
      { id: 'cl-r3', role: 'Front Desk Agent', employment_status: 'Former', rating: 4, date: '2025-04', pros: 'Good first hotel job. Standards are consistent so you learn the right way from day one. Provident fund and medical aid from day one of employment.', cons: 'The hotel brand is corporate and can feel impersonal. Tips are not a significant part of the income at this brand level.', anonymous: true, helpful_count: 9, salary: 'R7 800/month' },
    ],
  },

  {
    id: 'one-and-only-cape-town',
    name: 'One&Only Cape Town',
    industry: 'Luxury Hotel',
    size: '201–500 employees',
    location: 'Cape Town, V&A Waterfront',
    description: "One&Only Cape Town is a Forbes Five-Star ultra-luxury resort situated on a private island in the V&A Waterfront, offering views of Table Mountain and the Cape Town harbour. Featuring 131 rooms and suites, multiple award-winning restaurants (including the celebrated Nobu Cape Town), a world-class spa, and butler service, One&Only is widely considered the finest hotel in South Africa. The property attracts A-list celebrities, international business leaders, and discerning travellers.",
    overall_rating: 4.2,
    ratings: { work_life_balance: 3.3, culture: 4.3, management: 4.0, career_growth: 4.5, compensation: 4.1 },
    benefits: ['Medical aid', 'Provident fund', 'Staff meals (fine dining quality)', 'Hotel discounts at One&Only global portfolio', 'Leadership development programme', 'Recognition awards', 'Uniform provided and laundered'],
    website: 'oneandonlyresorts.com',
    logo_url: 'https://logo.clearbit.com/oneandonlyresorts.com',
    reviews: [
      { id: 'oao-r1', role: 'Butler', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'Working at One&Only has transformed my career. The training is the best I have experienced anywhere — they bring in international trainers. The guest calibre is extraordinary and you learn how the very top tier of hospitality operates. Staff meals are actually restaurant quality. Global transfer opportunities are real.', cons: 'The standard of perfection expected is relentless. Mistakes have immediate consequences at this level. The Waterfront location means you need reliable transport — the area is expensive.', anonymous: true, helpful_count: 41, salary: 'R14 000/month' },
      { id: 'oao-r2', role: 'Sous Chef (Nobu)', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Cooking Nobu cuisine in South Africa is a privilege. The kitchen is impeccably equipped. Chef Nobu\'s standards are embedded in every dish. This is a career-defining role for any serious chef.', cons: 'The hours at a Nobu kitchen are long. Japanese cuisine mastery takes years and the learning curve is steep. Pressure from the brand is constant.', anonymous: false, author_name: 'Sipho K.', helpful_count: 29, salary: 'R22 000/month' },
      { id: 'oao-r3', role: 'Front Desk Supervisor', employment_status: 'Former', rating: 4, date: '2025-08', pros: 'One&Only on your CV changes every interview. You learn luxury service at its highest level. Benefits are excellent and the company takes care of you.', cons: 'The guest expectation is stratospheric and you are expected to anticipate every need before it arises. High-stress environment for perfectionists.', anonymous: true, helpful_count: 23 },
    ],
  },

  {
    id: 'the-silo-hotel',
    name: 'The Silo Hotel',
    industry: 'Luxury Hotel',
    size: '51–200 employees',
    location: 'Cape Town, V&A Waterfront',
    description: "The Silo Hotel is one of the world's most architecturally celebrated hotels, occupying the converted grain elevator of Cape Town's historic Royal Portfolio in the V&A Waterfront. With 28 spectacular rooms and suites featuring pillow-windowed views of Table Mountain and the harbour, The Silo is the ultimate luxury boutique hotel in Africa. The property is managed with an emphasis on impeccable personalised service and extraordinary attention to detail.",
    overall_rating: 4.4,
    ratings: { work_life_balance: 3.4, culture: 4.6, management: 4.3, career_growth: 4.4, compensation: 4.2 },
    benefits: ['Medical aid', 'Provident fund', 'Fine dining staff meals', 'Royal Portfolio property discounts', 'World-class training', 'Internationally recognised CV entry'],
    website: 'thesilohotel.com',
    logo_url: 'https://logo.clearbit.com/thesilohotel.com',
    reviews: [
      { id: 'silo-r1', role: 'Guest Relations Manager', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'The Silo is simply the most beautiful place I have ever worked. Every shift feels special. The Royal Portfolio takes its culture of service seriously and invests in the team. The guest interactions are extraordinary — you meet remarkable people.', cons: 'The standard expected is absolute — there is no room for inconsistency. The property is small (28 rooms) so every team member carries significant responsibility. Parking and transport costs in the Waterfront area.', anonymous: true, helpful_count: 36, salary: 'R18 000/month' },
      { id: 'silo-r2', role: 'Head Bartender', employment_status: 'Current', rating: 5, date: '2025-09', pros: 'The bar at The Silo is one of the most celebrated in Africa. Creative latitude is exceptional. Tips from The Silo\'s guest profile are extraordinary. The team is small and highly skilled — I learn from every colleague.', cons: 'Pressure to be creative and consistent simultaneously at this level is significant. Very small margin for error.', anonymous: false, author_name: 'Jacques H.', helpful_count: 28, salary: 'R15 000/month + tips' },
      { id: 'silo-r3', role: 'Housekeeping Attendant', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'Working in rooms with pillow windows overlooking Table Mountain — genuinely never took it for granted. The team is treated with respect at every level. Uniform and equipment are the best quality.', cons: 'Only 28 rooms but the standard required is an order of magnitude above a normal hotel. The prep time required per room is significant.', anonymous: true, helpful_count: 17, salary: 'R9 500/month' },
    ],
  },

  {
    id: 'twelve-apostles-hotel',
    name: 'Twelve Apostles Hotel & Spa',
    industry: 'Luxury Hotel',
    size: '201–500 employees',
    location: 'Camps Bay, Cape Town',
    description: "The Twelve Apostles Hotel & Spa is one of the Cape's most iconic luxury hotels, dramatically positioned between the slopes of the Table Mountain National Park and the Atlantic Ocean. With 70 rooms and suites, a celebrated spa, wildlife sanctuary, private cinema, and award-winning Leopard Bar, the hotel attracts a global celebrity clientele. The Twelve Apostles is recognised internationally for its extraordinary natural setting and warm, personalised South African hospitality.",
    overall_rating: 4.1,
    ratings: { work_life_balance: 3.5, culture: 4.4, management: 4.0, career_growth: 4.0, compensation: 3.9 },
    benefits: ['Medical aid', 'Provident fund', 'Staff meals', 'Transport subsidy', 'Annual leave at reduced hotel rates', 'Spa access at reduced rates', 'Employee of the Month awards'],
    website: '12apostleshotel.com',
    logo_url: 'https://logo.clearbit.com/12apostleshotel.com',
    reviews: [
      { id: 'ta-r1', role: 'Spa Therapist', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'The Azure Spa at The Twelve Apostles is one of the best in South Africa. The equipment is world-class. Guests are wealthy and grateful — tips are exceptional. The setting between the mountain and ocean is unlike anything else.', cons: 'Transport to Camps Bay from the southern suburbs or city is difficult without your own car. The spa is busy all year round and therapists carry a full day of treatments.', anonymous: true, helpful_count: 31, salary: 'R9 500/month + tips' },
      { id: 'ta-r2', role: 'Waiter (Leopard Bar)', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'The Leopard Bar is one of the most beautiful bar settings in Africa. Tips from the international guest profile are excellent. Service standards are high and you grow fast.', cons: 'Getting to work at Camps Bay can be expensive. The property is spread across a mountain slope which means a lot of walking between sections.', anonymous: false, author_name: 'Mlungisi D.', helpful_count: 22, salary: 'R7 500/month + tips' },
      { id: 'ta-r3', role: 'Front Desk Receptionist', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'Working at a property of this calibre accelerates your career significantly. The team culture is warm and South African in the best way. Wildlife on the property is an unexpected daily delight.', cons: 'High expectations with no let-up. Driving guests between the hotel and the city centre is part of some roles which adds unpredictability.', anonymous: true, helpful_count: 15 },
    ],
  },

  {
    id: 'belmond-mount-nelson',
    name: 'Belmond Mount Nelson Hotel',
    industry: 'Luxury Hotel',
    size: '201–500 employees',
    location: 'Cape Town, Gardens',
    description: "The Belmond Mount Nelson Hotel — affectionately known as 'The Nellie' — is Cape Town's most storied grand hotel, operating since 1899. Painted in its trademark dusty pink and set in 9 acres of manicured gardens, The Mount Nelson is a Cape Town institution that has hosted Winston Churchill, John Lennon, Nelson Mandela, and countless heads of state. Under the Belmond brand (LVMH), the property operates to the very highest international luxury standards with an extraordinary heritage.",
    overall_rating: 4.1,
    ratings: { work_life_balance: 3.4, culture: 4.3, management: 4.0, career_growth: 4.2, compensation: 4.0 },
    benefits: ['Medical aid', 'Provident fund', 'Belmond global hotel discounts', 'Heritage hotel experience', 'LVMH group learning programmes', 'Staff meals', 'Afternoon tea experience for staff'],
    website: 'belmond.com',
    logo_url: 'https://logo.clearbit.com/belmond.com',
    reviews: [
      { id: 'mnh-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'The heritage of The Nellie is extraordinary — you serve afternoon tea in the same gardens that Churchill once walked. Tips from the international luxury clientele are excellent. Belmond\'s global training programme is world-class.', cons: 'The expectation of perfection is absolute — as it should be at this price point. The traditional hotel atmosphere requires a particular type of service sensibility that takes time to develop.', anonymous: true, helpful_count: 29, salary: 'R8 000/month + tips' },
      { id: 'mnh-r2', role: 'Pastry Chef', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'Producing pastry for a property of this heritage is a privilege. The kitchen is exceptional. Access to Belmond\'s global chef network and training is genuinely transformative. The afternoon tea programme is one of the best in Africa.', cons: 'Early starts are non-negotiable in pastry. The LVMH standard of presentation is uncompromising.', anonymous: false, author_name: 'Isabella V.', helpful_count: 24, salary: 'R16 000/month' },
      { id: 'mnh-r3', role: 'Concierge', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'Best concierge training in South Africa — Belmond invests properly. The connections you build with Cape Town\'s best venues and service providers are invaluable. The role builds your personal brand.', cons: 'Guest demands at this level can be extraordinary and need to be met with a smile regardless. No tip structure for concierge at this property.', anonymous: true, helpful_count: 17 },
    ],
  },

  {
    id: 'saxon-hotel',
    name: 'Saxon Hotel, Villas & Spa',
    industry: 'Luxury Boutique Hotel',
    size: '51–200 employees',
    location: 'Sandhurst, Johannesburg',
    description: "The Saxon Hotel, Villas & Spa in Sandhurst, Johannesburg is consistently rated among the finest luxury boutique hotels in the world. Famous as the place where Nelson Mandela completed his autobiography Long Walk to Freedom, the Saxon offers 53 sumptuous suites, a world-class spa, and the celebrated Saxon Restaurant. The property is a favourite of international celebrities, diplomats, and business leaders who value absolute privacy and bespoke luxury.",
    overall_rating: 4.3,
    ratings: { work_life_balance: 3.3, culture: 4.5, management: 4.2, career_growth: 4.3, compensation: 4.2 },
    benefits: ['Medical aid', 'Provident fund', 'Fine dining staff meals', 'International training exchanges', 'Prestigious CV entry', 'Accommodation option for some roles', 'Uniform provided'],
    website: 'saxon.co.za',
    logo_url: 'https://logo.clearbit.com/saxon.co.za',
    reviews: [
      { id: 'sax-r1', role: 'Butler', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'Working at the Saxon is the pinnacle of South African luxury hospitality. The guest profile is extraordinary. You develop a level of discretion, emotional intelligence, and service instinct that transforms your career. Tips are life-changing. The property itself is stunning.', cons: 'The standard of absolute discretion is non-negotiable — this is not a role for someone who wants to share their work life on social media. The pressure to anticipate every guest need before it arises is constant.', anonymous: true, helpful_count: 43, salary: 'R15 000/month + tips' },
      { id: 'sax-r2', role: 'Head Chef', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'Complete creative control within the Saxon\'s vision. The best produce in Joburg comes through this kitchen. The guest profile includes food critics, celebrities, and heads of state — it sharpens your focus.', cons: 'Responsibility is enormous. A bad service at this level is career-defining. Small kitchen team carries a lot.', anonymous: false, author_name: 'André B.', helpful_count: 35, salary: 'R45 000/month' },
      { id: 'sax-r3', role: 'Spa Therapist', employment_status: 'Former', rating: 4, date: '2025-08', pros: 'The Saxon Spa is among the best in Africa. Equipment and product are exceptional. Tips from the guest profile are significant. Working here transforms your technique.', cons: 'Full day of treatments is physically demanding. Sandhurst is difficult to reach without your own vehicle.', anonymous: true, helpful_count: 21 },
    ],
  },

  {
    id: 'radisson-hotel-group-sa',
    name: 'Radisson Hotel Group SA',
    industry: 'International Hotel Group',
    size: '1 000+ employees',
    location: 'Johannesburg · Cape Town · Durban',
    description: 'Radisson Hotel Group operates multiple properties across South Africa under brands including Radisson Blu, Radisson RED, and Park Inn by Radisson. Key South African properties include the Radisson Blu Waterfront Cape Town, Radisson Blu Gauteng (Sandton), and Radisson RED Cape Town. As part of a global group, Radisson offers international career pathways, structured training programmes, and the stability of one of the world\'s largest hotel groups.',
    overall_rating: 3.9,
    ratings: { work_life_balance: 3.5, culture: 4.0, management: 3.8, career_growth: 4.3, compensation: 3.7 },
    benefits: ['Medical aid contribution', 'Provident fund', 'Radisson global hotel discounts', 'International transfer programme', 'Structured management training', 'Staff meals', 'Annual performance bonus'],
    website: 'radissonhotels.com',
    logo_url: 'https://logo.clearbit.com/radissonhotels.com',
    reviews: [
      { id: 'rad2-r1', role: 'Front Desk Manager', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'International brand gives you global recognition. The systems are world-class. Real opportunity to transfer internationally — colleagues have moved to Belgium, Scandinavia, and the UAE. Medical aid from day one.', cons: 'Corporate structure means decisions take time. Guest complaints escalate quickly to TripAdvisor and the pressure to manage online reputation is constant.', anonymous: true, helpful_count: 24, salary: 'R19 000/month' },
      { id: 'rad2-r2', role: 'Revenue Manager', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Exposure to international pricing strategy and revenue management systems is incredible for career development. The group supports advanced training in yield management.', cons: 'Data pressure during peak periods is intense. Monthly targets and reporting cycle is relentless.', anonymous: false, author_name: 'Kefilwe B.', helpful_count: 18, salary: 'R28 000/month' },
      { id: 'rad2-r3', role: 'Housekeeping Supervisor', employment_status: 'Former', rating: 3, date: '2025-06', pros: 'Stable employment. International brand standards mean your work is properly recognised. Provident fund properly administered.', cons: 'Room quota per shift is high relative to the 5-star expectation. Night cleaning rotation adds health strain.', anonymous: true, helpful_count: 11, salary: 'R9 200/month' },
    ],
  },

  {
    id: 'hilton-south-africa',
    name: 'Hilton South Africa',
    industry: 'International Hotel Group',
    size: '1 000+ employees',
    location: 'Sandton · Cape Town · Durban',
    description: 'Hilton Hotels & Resorts operates multiple properties across South Africa, including the Hilton Sandton, Hilton Cape Town City Centre, and DoubleTree by Hilton Cape Town. As part of one of the world\'s largest and most recognised hotel companies, Hilton South Africa offers structured career development, global transfer opportunities, and an internationally portable set of skills and credentials. Hilton is known for strong team culture and its "be hospitable" people philosophy.',
    overall_rating: 4.0,
    ratings: { work_life_balance: 3.6, culture: 4.2, management: 3.9, career_growth: 4.4, compensation: 3.8 },
    benefits: ['Hilton Team Member Travel Programme (heavily discounted stays globally)', 'Medical aid', 'Provident fund', 'Go Hilton programme for family discounts', 'Leadership development programme', 'Staff meals', 'Employee recognition awards'],
    website: 'hilton.com',
    logo_url: 'https://logo.clearbit.com/hilton.com',
    reviews: [
      { id: 'hil-r1', role: 'Reservations Manager', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'The Hilton Team Member Travel Programme is extraordinary — I\'ve stayed at Hilton properties in London, Dubai, and New York at near-zero cost. The global brand credibility transforms your CV. Leadership development programme is genuinely structured.', cons: 'Corporate hotel pace can feel monotonous after a few years. Revenue targets create constant pressure on the reservations team.', anonymous: true, helpful_count: 32, salary: 'R22 000/month' },
      { id: 'hil-r2', role: 'Executive Chef', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Leading a kitchen in a Hilton gives you access to global menu development support and international chef exchanges. The infrastructure and procurement are world-class. Go Hilton for family is an incredible perk.', cons: 'International brand menus can restrict local creativity. Cost controls at this level are scrutinised closely.', anonymous: false, author_name: 'Frederick W.', helpful_count: 25, salary: 'R48 000/month' },
      { id: 'hil-r3', role: 'F&B Attendant', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'Hilton trains properly and the international standard means your skills are valued everywhere. Staff meals are excellent. The team culture is warm.', cons: 'Pay at the attendant level is not high relative to the cost of living in Sandton. Shift work including early mornings is unavoidable.', anonymous: true, helpful_count: 14, salary: 'R8 000/month' },
    ],
  },

  {
    id: 'cape-grace-hotel',
    name: 'Cape Grace Hotel',
    industry: 'Luxury Hotel',
    size: '51–200 employees',
    location: 'Cape Town, V&A Waterfront',
    description: "Cape Grace is an intimate 5-star hotel perfectly positioned on its own private quay in the V&A Waterfront, with breathtaking views of Table Mountain and the working harbour. With 120 rooms and suites, the award-winning Signal Restaurant, Bascule Whisky Bar (one of the world's largest whisky collections), and a full spa, Cape Grace is known for its warm, personalised service and sense of place. Cape Grace is part of the Preferred Hotels & Resorts collection.",
    overall_rating: 4.2,
    ratings: { work_life_balance: 3.6, culture: 4.5, management: 4.1, career_growth: 4.0, compensation: 3.9 },
    benefits: ['Medical aid', 'Provident fund', 'Staff meals', 'Hotel accommodation discounts', 'Whisky education programme', 'Wine education', 'Annual recognition awards'],
    website: 'capegrace.com',
    logo_url: 'https://logo.clearbit.com/capegrace.com',
    reviews: [
      { id: 'cg-r1', role: 'Whisky Sommelier (Bascule)', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Bascule houses one of the world\'s largest whisky collections and I genuinely learn every shift. The guests are passionate about whisky — the conversations are extraordinary. Tips are excellent from the international clientele.', cons: 'The knowledge expectation is enormous — guests sometimes know more than you do which requires humility and constant study. The bar is intimate which means your mistakes are very visible.', anonymous: false, author_name: 'Declan O.', helpful_count: 37, salary: 'R13 000/month + tips' },
      { id: 'cg-r2', role: 'Head Waiter (Signal Restaurant)', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'The Signal Restaurant is one of Cape Town\'s finest. The view over the marina changes every day. The team is exceptionally close-knit. International guests bring extraordinary energy.', cons: 'December in the Waterfront tests every team member to their limit. The expectations at this level are uncompromising.', anonymous: true, helpful_count: 22, salary: 'R9 500/month + tips' },
      { id: 'cg-r3', role: 'Spa Therapist', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'Luxury spa environment with excellent equipment. Guests are generous tippers. The property is beautiful and the team culture is warm.', cons: 'Full days of back-to-back treatments are physically demanding. Waterfront transport costs add up.', anonymous: true, helpful_count: 14 },
    ],
  },

  // ─── CRUISE & MARITIME ───────────────────────────────────────────────────────

  {
    id: 'msc-cruises-sa',
    name: 'MSC Cruises South Africa',
    industry: 'Cruise Line',
    size: '1 000+ employees',
    location: 'Cape Town (SA HQ) · Durban',
    description: 'MSC Cruises is the world\'s largest privately held cruise company and has deep roots in South Africa — the Aponte family, who own MSC, have South African connections and the brand is headquartered in Cape Town for Africa operations. MSC offers exciting hospitality career opportunities aboard its fleet of modern cruise ships, sailing routes across the Indian Ocean, Mediterranean, Caribbean, and beyond. Cruise ship hospitality is a unique lifestyle — you live and work onboard, travel the world, and build an extraordinary career.',
    overall_rating: 3.8,
    ratings: { work_life_balance: 3.0, culture: 3.9, management: 3.7, career_growth: 4.4, compensation: 4.0 },
    benefits: ['Accommodation and meals onboard included', 'See the world — paid', 'Tax-free earnings (at sea)', 'Rapid career progression', 'Gratuities from passengers', 'International crew community', 'Contract rotation — time off between contracts'],
    website: 'msccruises.co.za',
    logo_url: 'https://logo.clearbit.com/msccruises.co.za',
    reviews: [
      { id: 'msc-r1', role: 'Waiter (F&B)', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'I\'ve visited 23 countries in 18 months. Your accommodation and meals are covered so your earnings are almost pure savings. Tax-free income at sea is a significant financial advantage. Gratuities from passengers boost income considerably. Career progression is fast — within 2 years I\'ve moved from waiter to section head.', cons: 'You are at sea for 6–9 months at a time with very limited personal privacy. Homesickness is real. Social life onboard is with the same 2 000 crew members. The schedule is relentless — no days off at sea.', anonymous: true, helpful_count: 44, salary: 'USD 1 200–1 800/month (tax-free) + gratuities' },
      { id: 'msc-r2', role: 'Restaurant Supervisor', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Incredible career trajectory — the cruise industry promotes quickly. Managing a dining room of 400 guests teaches operational skills that no land-based restaurant can match. The international crew community is genuinely diverse and enriching.', cons: 'Missing family milestones back home is the hardest part. Crew quarters are small. The pace onboard is without breaks — you work every single day for months at a stretch.', anonymous: false, author_name: 'Ntokozo M.', helpful_count: 31, salary: 'USD 2 500/month (tax-free)' },
      { id: 'msc-r3', role: 'Bartender', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'The world is your workplace. Bar skills developed at sea translate perfectly to any land-based role. The savings potential when all living costs are covered is remarkable.', cons: 'The isolation from family and friends builds over a long contract. Not everyone is suited to the lifestyle — you need to genuinely love the sea and crew life.', anonymous: true, helpful_count: 26, salary: 'USD 1 500/month (tax-free) + tips' },
    ],
  },

  // ─── GAME LODGES & SAFARI ────────────────────────────────────────────────────

  {
    id: 'andbeyond',
    name: '&Beyond',
    industry: 'Luxury Safari & Lodges',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Across Africa',
    description: '&Beyond is one of Africa\'s most celebrated luxury safari and conservation companies, operating 29 lodges across South Africa, Botswana, Kenya, Tanzania, Zimbabwe, Namibia, and beyond, with additional expeditions in South America and Asia. Founded in South Africa, &Beyond is built on a philosophy of Care of the Land, Care of the Wildlife, and Care of the People. Working at an &Beyond lodge means living in the African bush alongside extraordinary wildlife and delivering the finest safari experiences on the continent.',
    overall_rating: 4.3,
    ratings: { work_life_balance: 3.8, culture: 4.7, management: 4.2, career_growth: 4.4, compensation: 3.9 },
    benefits: ['Bush accommodation included', 'All meals provided', 'Game drives as part of the role', 'African wildlife proximity daily', 'Inter-lodge transfer opportunities', 'Conservation training', 'Guest gratuities', 'Annual bush bonus'],
    website: 'andbeyond.com',
    logo_url: 'https://logo.clearbit.com/andbeyond.com',
    reviews: [
      { id: 'ab-r1', role: 'Game Lodge Host', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Waking up to lion roaring outside your window is not something you get at a city job. The guests who come to &Beyond are extraordinary people — curious, generous, and deeply respectful of the bush. The culture of care that &Beyond has built is genuine. Gratuities from guests are life-changing.', cons: 'The lodge is remote — if you miss city life, this role will be challenging. You can go weeks without leaving the property. Mobile signal is minimal. Work rotation means you are at the lodge for 21 days followed by 7 days off.', anonymous: true, helpful_count: 38, salary: 'R12 000/month + accommodation + meals + gratuities' },
      { id: 'ab-r2', role: 'Safari Chef', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Cooking for guests who have just returned from a life-changing game drive is deeply satisfying. The creative latitude in a lodge kitchen is extraordinary — farm-to-table is genuinely practised. &Beyond invests in chefs, and our lodge chef has won multiple awards.', cons: 'Logistics in the bush are different from a city kitchen. Supply deliveries are less frequent and you plan around what is available. The remoteness is an acquired taste.', anonymous: false, author_name: 'Siphamandla D.', helpful_count: 27, salary: 'R15 000/month + accommodation + meals' },
      { id: 'ab-r3', role: 'Housekeeping Attendant', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'Making up a tented suite overlooking a waterhole where elephants drink is genuinely magical. The &Beyond team culture is warm and the management genuinely cares about staff. All costs are covered while on lodge rotation.', cons: 'Remote bush lifestyle is not for everyone. The 21-on-7-off rotation can be emotionally challenging when your family is far away.', anonymous: true, helpful_count: 19 },
    ],
  },

  {
    id: 'singita',
    name: 'Singita',
    industry: 'Ultra-Luxury Safari Lodges',
    size: '201–500 employees',
    location: 'Johannesburg (HQ) · Sabi Sand, Kruger & Beyond',
    description: 'Singita is Africa\'s most acclaimed ultra-luxury safari company, operating lodges in South Africa, Tanzania, Rwanda, and Zimbabwe. With over 100 years of family ownership in the South African bush, Singita has defined what ultra-luxury safari means — extraordinary design, world-class food and wine, exceptional rangers, and a deep commitment to conservation. Consistently ranked as the world\'s best safari brand, Singita attracts the most discerning travellers on earth. Working at Singita is the pinnacle of African safari hospitality.',
    overall_rating: 4.5,
    ratings: { work_life_balance: 3.7, culture: 4.8, management: 4.4, career_growth: 4.5, compensation: 4.3 },
    benefits: ['Full accommodation in the bush', 'All meals', 'World-class wine programme', 'Conservation education', 'International transfer between lodges', 'Guest gratuities (substantial)', 'Annual conservation leave bonus'],
    website: 'singita.com',
    logo_url: 'https://logo.clearbit.com/singita.com',
    reviews: [
      { id: 'sing-r1', role: 'Lodge Manager', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'Singita is not just a job — it is a calling. Managing a Singita lodge means working at the intersection of luxury hospitality, conservation, and community. Guests arrive with extraordinary expectations and leave changed by the experience. Gratuities at the lodge manager level are transformative. The Singita family culture is real.', cons: 'The remoteness is total. Leadership responsibility at this level is enormous. The standard of hospitality expected is unlike anything else in the world — there is no room for average.', anonymous: true, helpful_count: 52, salary: 'R35 000/month + accommodation + meals + gratuities' },
      { id: 'sing-r2', role: 'Head Chef', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'Cooking for Singita is the peak of South African culinary achievement. The wine programme is extraordinary — you learn from a world-class sommelier team. The produce philosophy (much of it grown on-property) is aligned with how I believe food should be approached. The exposure to influential international food critics has opened every door.', cons: 'Bush logistics require significant advance planning. The menu must feel effortless for guests who have spent R100 000+ on the experience — the pressure behind the scenes is significant.', anonymous: false, author_name: 'Hannah C.', helpful_count: 41, salary: 'R28 000/month + accommodation + meals' },
      { id: 'sing-r3', role: 'Wine Steward', employment_status: 'Former', rating: 5, date: '2025-08', pros: 'Singita\'s wine cellar is one of the finest in Africa. The education and tasting programme changed my understanding of wine completely. Guest gratuities at this level of luxury are extraordinary.', cons: 'Leaving the bush after a long rotation to re-adjust to normal life is genuinely difficult. The lifestyle consumes you — in the best way.', anonymous: true, helpful_count: 30 },
    ],
  },

  {
    id: 'wilderness-safaris',
    name: 'Wilderness Safaris',
    industry: 'Safari & Conservation Lodges',
    size: '1 000+ employees',
    location: 'Cape Town (HQ) · Across Southern & East Africa',
    description: 'Wilderness Safaris is one of Africa\'s largest and most respected safari conservation companies, operating over 60 camps and lodges across Botswana, Namibia, Zimbabwe, Zambia, Rwanda, South Africa, Kenya, and Seychelles. Committed to responsible tourism, Wilderness Safaris has protected over 2.5 million hectares of African wilderness. Hospitality roles within Wilderness combine world-class guest experience delivery with meaningful conservation and community impact.',
    overall_rating: 4.2,
    ratings: { work_life_balance: 3.9, culture: 4.6, management: 4.1, career_growth: 4.3, compensation: 3.8 },
    benefits: ['Full board and lodging on rotation', 'Conservation training', 'Guest gratuities', 'Regional transfer between camps', 'Environmental education', 'Annual sustainability bonus'],
    website: 'wilderness-safaris.com',
    logo_url: 'https://logo.clearbit.com/wilderness-safaris.com',
    reviews: [
      { id: 'ws-r1', role: 'Camp Host', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Working for a company that genuinely cares about conservation makes this job mean something beyond hospitality. The camps are in some of the most pristine wilderness on earth. Guest gratuities are generous. The cross-cultural team environment is enriching.', cons: 'Remote locations with limited connectivity test your ability to disconnect from the outside world. Rotation schedules need planning for family commitments.', anonymous: true, helpful_count: 28, salary: 'R11 000/month + accommodation + meals + gratuities' },
      { id: 'ws-r2', role: 'Camp Chef', employment_status: 'Former', rating: 4, date: '2025-09', pros: 'Wilderness Safaris encourages local, seasonal cooking that aligns with the environment. The creative freedom is significant. The feedback from guests who have had a bush dinner under the stars is incomparable.', cons: 'Bush logistics require real planning skill. Certain camps are extremely remote with infrequent supply runs.', anonymous: false, author_name: 'George K.', helpful_count: 20, salary: 'R13 000/month + accommodation + meals' },
      { id: 'ws-r3', role: 'Housekeeping Attendant', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'All costs covered while on rotation. The camps are beautiful. Conservation ethos makes it feel meaningful. Team community is close.', cons: 'Remoteness is challenging for someone with young children. Signal and internet access vary by camp location.', anonymous: true, helpful_count: 12 },
    ],
  },

  // ─── CONTRACT CATERING ───────────────────────────────────────────────────────

  {
    id: 'compass-group-sa',
    name: 'Compass Group South Africa',
    industry: 'Contract Catering',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "Compass Group South Africa is the local arm of the world's largest contract catering and support services company. Operating in corporate offices, mining sites, hospitals, schools, and events venues across South Africa, Compass Group offers stable employment, structured career development, and the backing of a global company. With a large and diverse South African portfolio, Compass Group hires extensively across culinary, service, and management roles.",
    overall_rating: 3.6,
    ratings: { work_life_balance: 3.8, culture: 3.5, management: 3.5, career_growth: 3.7, compensation: 3.6 },
    benefits: ['Medical aid contribution', 'Provident fund', 'Staff meals', 'Annual leave', 'Structured training', 'Internal promotion pathways', 'Long-service awards'],
    website: 'compass-group.co.za',
    logo_url: 'https://logo.clearbit.com/compass-group.co.za',
    reviews: [
      { id: 'comp-r1', role: 'Site Chef', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'The stability and structure of a global company is a genuine advantage in SA\'s volatile hospitality sector. Proper benefits administered correctly. Cooking for 500 people daily builds real volume skills. Real management career pathway within the group.', cons: 'Contract catering is less creative than restaurant cooking — menus are driven by cost and volume. Some remote mining site contracts can be isolating.', anonymous: true, helpful_count: 17, salary: 'R14 000/month' },
      { id: 'comp-r2', role: 'Service Supervisor', employment_status: 'Current', rating: 3, date: '2025-08', pros: 'Stable job, paid on time, benefits properly managed. The corporate structure means clear policies. Good for someone wanting predictable work hours.', cons: 'The work can be monotonous at corporate catering sites. Career growth requires patience in a large company. Some clients are demanding and treat contract staff as invisible.', anonymous: true, helpful_count: 11, salary: 'R10 500/month' },
      { id: 'comp-r3', role: 'Catering Manager', employment_status: 'Former', rating: 3, date: '2025-05', pros: 'Global brand credibility and systems that actually work. Good operations training. Real advancement to area manager level with time.', cons: 'Contract transitions can be disruptive — when a client changes catering company, your team\'s future is uncertain. Pay for the responsibility level is lower than equivalent restaurant roles.', anonymous: false, author_name: 'Michelle S.', helpful_count: 9, salary: 'R22 000/month' },
    ],
  },

  {
    id: 'tsebo-solutions',
    name: 'Tsebo Solutions Group',
    industry: 'Contract Catering & Facilities',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Pan-Africa',
    description: "Tsebo Solutions Group is Africa's leading integrated facilities solutions company, operating across catering, cleaning, security, and related services across Sub-Saharan Africa. The Tsebo Catering Solutions division serves corporate clients, schools, healthcare facilities, mining operations, and government institutions. As one of the largest Black-owned facilities companies on the continent, Tsebo has a strong BBBEE profile and broad employment footprint.",
    overall_rating: 3.5,
    ratings: { work_life_balance: 3.7, culture: 3.5, management: 3.4, career_growth: 3.6, compensation: 3.5 },
    benefits: ['Provident fund', 'Medical aid option', 'Staff meals on site', 'Structured training', 'Pan-African transfer opportunities', 'BBBEE employer'],
    website: 'tsebo.com',
    logo_url: 'https://logo.clearbit.com/tsebo.com',
    reviews: [
      { id: 'tsebo-r1', role: 'Kitchen Manager', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'Large and stable company. BBBEE credentials matter at corporate clients. Provident fund is properly administered. Wide variety of contract types gives exposure to different environments.', cons: 'Pay scales at the contract catering level can be frustrating given the volume of work. Management layers can make decision-making slow.', anonymous: true, helpful_count: 13, salary: 'R16 000/month' },
      { id: 'tsebo-r2', role: 'Food Service Assistant', employment_status: 'Current', rating: 3, date: '2025-08', pros: 'Stable, consistent employment. Paid on time. Good first job in the industry with training included.', cons: 'Entry-level pay is low. The work is routine. Not much creative opportunity at this level.', anonymous: true, helpful_count: 7, salary: 'R5 500/month' },
      { id: 'tsebo-r3', role: 'Area Operations Manager', employment_status: 'Former', rating: 4, date: '2025-04', pros: 'Pan-African scope gives real operational management experience. Tsebo\'s scale across multiple countries is career-building. Strong BBBEE positioning opens corporate opportunities.', cons: 'Travel intensity at area manager level is significant. Client retention pressure is constant.', anonymous: false, author_name: 'Bongani N.', helpful_count: 15, salary: 'R35 000/month' },
    ],
  },

  // ─── COFFEE BRANDS ───────────────────────────────────────────────────────────

  {
    id: 'vida-e-caffe',
    name: 'Vida e Caffè',
    industry: 'Coffee Brand / Café',
    size: '501–1 000 employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Vida e Caffè is South Africa's coolest and most culturally embedded coffee brand, founded in Cape Town in 2001 with a strong Portuguese identity. With over 200 stores across South Africa and in London, Vida is the home of bold espresso, custom drinks, and vibrant store culture. Famous for naming drinks and engaging with customers by name, Vida has built one of the strongest café team cultures in the country — energetic, proud, and community-oriented.",
    overall_rating: 3.9,
    ratings: { work_life_balance: 3.5, culture: 4.5, management: 3.7, career_growth: 3.8, compensation: 3.5 },
    benefits: ['Free coffee on shift', 'Staff discount across the menu', 'Barista competition opportunities', 'Internal promotion pathway', 'Vida culture training programme', 'Flexible scheduling for students'],
    website: 'vidaecaffe.com',
    logo_url: 'https://logo.clearbit.com/vidaecaffe.com',
    reviews: [
      { id: 'vida-r1', role: 'Barista', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Best café team culture in South Africa, full stop. The energy in a Vida store is unlike anything else. Free coffee forever is not a small thing. Management at most franchises is encouraging and the training is strong. The brand is genuinely loved by customers.', cons: 'Morning rush is intense and shows no mercy. Pay is on the lower end for the skill and energy required. Some franchise owners are better than others — your experience depends heavily on your owner.', anonymous: true, helpful_count: 36, salary: 'R5 500/month' },
      { id: 'vida-r2', role: 'Store Manager', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Managing a Vida store means running your own business with support from the group. The brand loyalty from customers makes it a pleasure. Staff culture stays positive because Vida hires for personality.', cons: 'Managing young, energetic teams means some staff turnover. Mall-based stores require trading through all public holidays. Admin for a franchise can pile up quickly.', anonymous: false, author_name: 'Ayanda T.', helpful_count: 23, salary: 'R17 000/month' },
      { id: 'vida-r3', role: 'Barista Trainer', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'Training the next generation of baristas is genuinely rewarding. Vida\'s coffee culture is worth teaching. Good internal role for someone who loves the brand.', cons: 'Trainer pay should be higher given the responsibility. Travel between stores for training sessions is extensive.', anonymous: true, helpful_count: 14, salary: 'R8 500/month' },
    ],
  },

  {
    id: 'seattle-coffee-company',
    name: 'Seattle Coffee Company',
    industry: 'Coffee Chain',
    size: '201–500 employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Seattle Coffee Company brought specialty coffee culture to South Africa in 1997 and remains one of the country's best-loved coffee brands, with locations across shopping centres, airports, and office parks nationwide. Known for its signature drinks, comfortable environments, and quality espresso, Seattle is a reliable, well-run operation under the Famous Brands group umbrella. It's a great workplace for baristas building their career in specialty coffee.",
    overall_rating: 3.6,
    ratings: { work_life_balance: 3.6, culture: 3.9, management: 3.5, career_growth: 3.5, compensation: 3.4 },
    benefits: ['Coffee on shift', 'Staff food discount', 'Famous Brands training', 'Barista skills certification', 'Flexible student-friendly hours'],
    website: 'seattlecoffee.co.za',
    logo_url: 'https://logo.clearbit.com/seattlecoffee.co.za',
    reviews: [
      { id: 'scc-r1', role: 'Barista', employment_status: 'Current', rating: 3, date: '2025-11', pros: 'Good for building barista fundamentals. Famous Brands support means proper training. Flexible hours suit students. The environment is comfortable and well-maintained.', cons: 'Pay is low for experienced baristas. Airport branches are non-stop with no quiet periods. Some customers are impatient and make it stressful.', anonymous: true, helpful_count: 15, salary: 'R5 200/month' },
      { id: 'scc-r2', role: 'Store Manager', employment_status: 'Former', rating: 3, date: '2025-08', pros: 'Good management training through Famous Brands academy. Reliable brand with consistent footfall. Clear operational systems.', cons: 'Growth beyond store manager requires waiting for openings in a large group. Mall hours are long. Pay for managers doesn\'t match the responsibility.', anonymous: true, helpful_count: 9, salary: 'R16 000/month' },
      { id: 'scc-r3', role: 'Floor Staff', employment_status: 'Former', rating: 3, date: '2025-05', pros: 'Consistent schedule, decent team culture. Good starter role in the industry.', cons: 'Very little tip income. Can feel like you\'re just processing transactions rather than building relationships.', anonymous: true, helpful_count: 5, salary: 'R5 000/month' },
    ],
  },

  // ─── ORIGINAL MOCK COMPANIES (retained and enhanced) ─────────────────────────

  {
    id: 'the-harbour-table',
    name: 'The Harbour Table',
    industry: 'Restaurant',
    size: '11–50 employees',
    location: 'Cape Town, V&A Waterfront',
    description: 'The Harbour Table is a busy upscale waterfront restaurant at the V&A Waterfront serving modern South African cuisine with a focus on fresh seafood. Known for its views of the harbour and a high-energy front-of-house team, we serve a mix of tourists and Cape Town locals.',
    overall_rating: 3.8,
    ratings: { work_life_balance: 3.5, culture: 4.0, management: 3.6, career_growth: 3.2, compensation: 3.8 },
    benefits: ['Staff meals on shift', 'Tips shared equally', 'Flexible rosters', 'Public holiday premium pay', 'Staff discount'],
    reviews: [
      { id: 'ht-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'The tips are genuinely good, especially in summer when the tourists come through. Team is mostly friendly and management is fair.', cons: 'Very busy during school holidays and December — you can do 12-hour shifts back to back with very little break time.', anonymous: true, helpful_count: 14, salary: 'R6 500/month + tips (averaging R2 000–R4 000 extra in season)' },
      { id: 'ht-r2', role: 'Junior Sous Chef', employment_status: 'Former', rating: 3, date: '2025-08', pros: 'Good experience for a younger chef — busy kitchen, you learn fast. The Head Chef is technically strong and teaches if you ask.', cons: 'Kitchen culture can be intense. Overtime is expected but not always compensated properly.', anonymous: false, author_name: 'Sipho M.', helpful_count: 9, salary: 'R14 000/month' },
    ],
  },

  {
    id: 'radisson-blu-gauteng',
    name: 'Radisson Blu Gauteng',
    industry: 'Hotel',
    size: '201–500 employees',
    location: 'Sandton, Johannesburg',
    description: 'The Radisson Blu Gauteng is a five-star business hotel in the heart of Sandton, catering predominantly to corporate guests and international travellers. The hotel operates multiple food and beverage outlets including a fine dining restaurant, rooftop bar, and all-day dining venue.',
    overall_rating: 3.9,
    ratings: { work_life_balance: 3.4, culture: 4.1, management: 3.8, career_growth: 4.3, compensation: 3.6 },
    benefits: ['Medical aid contribution', 'Staff meals', 'Provident fund', 'Global hotel network discounts', 'Training bursaries', 'Employee wellness programme'],
    website: 'radissonhotels.com',
    logo_url: 'https://logo.clearbit.com/radissonhotels.com',
    reviews: [
      { id: 'rad-r1', role: 'Front Desk Receptionist', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'Working in a 5-star environment is great for your CV and your personal development. The training is structured and professional.', cons: 'Shift work is relentless — public holidays, Christmas, New Year. The corporate environment can feel impersonal.', anonymous: true, helpful_count: 21, salary: 'R9 200/month' },
      { id: 'rad-r2', role: 'Sous Chef', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'International standards mean you are cooking at a high level. Real career pathway to transfer to other Radisson properties globally.', cons: 'Kitchen politics exist at every level. Night shifts for the rooftop bar can be rough.', anonymous: false, author_name: 'Lebo K.', helpful_count: 17, salary: 'R21 000/month' },
    ],
  },

  {
    id: 'origin-coffee-roasting',
    name: 'Origin Coffee Roasting',
    industry: 'Coffee Shop / Roastery',
    size: '51–100 employees',
    location: 'Cape Town, De Waterkant',
    description: "Origin Coffee Roasting is one of South Africa's most respected specialty coffee brands, with their flagship café and roastery in De Waterkant. They roast single-origin beans in-house and are known for their meticulous approach to coffee quality and barista training.",
    overall_rating: 4.3,
    ratings: { work_life_balance: 3.8, culture: 4.7, management: 4.2, career_growth: 4.0, compensation: 3.6 },
    benefits: ['Free coffee on shift', 'Specialty coffee education', 'Competition team participation', 'Staff beans at cost', 'Flexible hours for studies'],
    website: 'origincoffee.co.za',
    logo_url: 'https://logo.clearbit.com/origincoffee.co.za',
    reviews: [
      { id: 'orig-r1', role: 'Barista', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'If coffee is your passion, this is the best employer in Cape Town. The training is world-class. Management respects your craft.', cons: 'Pay is on the lower end for the skill level required. Peak hours in the morning are very intense.', anonymous: true, helpful_count: 29, salary: 'R6 000/month' },
      { id: 'orig-r2', role: 'Senior Barista', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Origin sends their top baristas to coffee competitions. Coffee sourcing trips to Ethiopia and Rwanda are available for senior staff.', cons: 'Advancement to management level requires patience.', anonymous: false, author_name: 'Thandeka N.', helpful_count: 18, salary: 'R7 800/month' },
    ],
  },

  {
    id: 'the-marine-hermanus',
    name: 'The Marine Hermanus',
    industry: 'Boutique Hotel',
    size: '11–50 employees',
    location: 'Hermanus, Western Cape',
    description: 'The Marine Hermanus is a historic boutique hotel perched above the Walker Bay coastline, one of the world\'s premier whale-watching destinations. Offering luxury accommodation, fine dining, and a seafront pool in one of Africa\'s most spectacular natural settings.',
    overall_rating: 4.2,
    ratings: { work_life_balance: 4.0, culture: 4.5, management: 4.1, career_growth: 3.2, compensation: 3.6 },
    benefits: ['Live-in accommodation on property', 'All meals provided', 'Whale-watching access', 'End-of-season bonus', 'Uniform provided and laundered'],
    reviews: [
      { id: 'marine-r1', role: 'Housekeeping Attendant', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'You live on the property in Hermanus with all meals included. The whale season from June to November means guests are genuinely excited to be there.', cons: 'It is seasonal work — you need to plan for the off-season. Hermanus is small and isolated if you\'re used to city life.', anonymous: true, helpful_count: 17, salary: 'R5 500/month + accommodation + meals' },
      { id: 'marine-r2', role: 'Breakfast Waiter', employment_status: 'Former', rating: 4, date: '2025-09', pros: 'Brilliant experience for someone wanting to try the seasonal hospitality lifestyle. The team that forms during the season becomes like a family.', cons: 'Breakfast starts at 6am which requires being up by 5:15. Very limited nightlife in Hermanus.', anonymous: false, author_name: 'Anke S.', helpful_count: 20, salary: 'R5 200/month + accommodation + meals + tips' },
    ],
  },

  // ─── FAST FOOD / QSR ────────────────────────────────────────────────────────

  {
    id: 'kfc-south-africa',
    name: 'KFC South Africa',
    industry: 'Fast Food Chain',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: 'KFC South Africa is one of the country\'s largest and most beloved fast-food chains, operating over 900 restaurants nationwide. Part of the global Yum! Brands family, KFC SA is deeply embedded in South African culture — from township outlets to highway stops. With one of the broadest geographic footprints of any restaurant chain in SA, KFC offers wide employment across all nine provinces.',
    overall_rating: 3.2,
    ratings: { work_life_balance: 3.0, culture: 3.2, management: 3.1, career_growth: 3.5, compensation: 2.9 },
    benefits: ['Staff meal per shift', 'Training programme', 'Promotion from within', 'Uniform provided', 'Provident fund at management level'],
    website: 'kfc.co.za',
    logo_url: 'https://logo.clearbit.com/kfc.co.za',
    reviews: [
      { id: 'kfc-r1', role: 'Team Member', employment_status: 'Current', rating: 3, date: '2025-11', pros: 'Free chicken every shift is a real benefit when you\'re watching your budget. Training is structured and they do promote from within — I\'ve seen team members become assistant managers within a year. The brand is busy which means the time goes fast.', cons: 'The pace during lunch and dinner rush is brutal. Pay is minimum wage at team member level. Management quality varies a lot by franchise.', anonymous: true, helpful_count: 21, salary: 'R4 500/month + staff meal' },
      { id: 'kfc-r2', role: 'Restaurant Manager', employment_status: 'Current', rating: 3, date: '2025-09', pros: 'KFC\'s operational systems are excellent — everything is documented. The training programme for managers is thorough. Job security at the franchise level is generally stable.', cons: 'Managing high staff turnover is exhausting. The bonus structure is tied to tight margin targets. Working every public holiday is expected.', anonymous: false, author_name: 'Thabo G.', helpful_count: 14, salary: 'R15 000/month' },
    ],
  },

  {
    id: 'mcdonalds-south-africa',
    name: "McDonald's South Africa",
    industry: 'Fast Food Chain',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "McDonald's South Africa operates over 340 restaurants nationwide and is committed to being a significant local employer. As part of one of the world's most recognised brands, McDonald's SA brings international training standards, a strong focus on food safety, and genuine career development for crew members at all levels.",
    overall_rating: 3.4,
    ratings: { work_life_balance: 3.1, culture: 3.5, management: 3.3, career_growth: 3.8, compensation: 3.1 },
    benefits: ['Crew meal per shift', 'Hamburger University training', 'Uniform provided', 'Flexible hours', 'Medical aid at management level'],
    website: 'mcdonalds.co.za',
    logo_url: 'https://logo.clearbit.com/mcdonalds.co.za',
    reviews: [
      { id: 'mcd-r1', role: 'Crew Member', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'McDonald\'s on your CV is globally recognised. Training is serious and the food safety knowledge you gain is genuinely valuable. Flexible shifts work well for students.', cons: 'Weekend rushes are relentless. Customer-facing role during conflict can be stressful. Pay is entry level.', anonymous: true, helpful_count: 18, salary: 'R4 800/month' },
      { id: 'mcd-r2', role: 'Shift Manager', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'Real management responsibility from early on. The Hamburger University management programme teaches genuine business fundamentals. International career pathways exist for top performers.', cons: 'The pace during peak hours is extreme. Managing crew behaviour on a late-night shift is demanding.', anonymous: true, helpful_count: 11, salary: 'R12 000/month' },
    ],
  },

  {
    id: 'steers-sa',
    name: 'Steers',
    industry: 'Fast Food Chain',
    size: '1 000+ employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Steers is South Africa's most loved flame-grilled burger brand, part of the Famous Brands group. With over 550 restaurants nationwide, Steers is a staple of South African fast-food culture. The brand's authenticity — flame-grilled, never fried — resonates deeply with South Africans.",
    overall_rating: 3.3,
    ratings: { work_life_balance: 3.1, culture: 3.4, management: 3.2, career_growth: 3.4, compensation: 3.1 },
    benefits: ['Staff meals', 'Famous Brands bursary scheme', 'Uniform provided', 'Training programme', 'Internal promotion'],
    website: 'steers.co.za',
    logo_url: 'https://logo.clearbit.com/steers.co.za',
    reviews: [
      { id: 'steers-r1', role: 'Grill Operator', employment_status: 'Current', rating: 3, date: '2025-11', pros: 'Learning the flame-grill technique is a useful skill. The team at my branch is young and energetic. Free burgers are a proper perk.', cons: 'Grill station is very hot in summer. Friday evenings are brutal. Pay is on the lower end.', anonymous: true, helpful_count: 12, salary: 'R5 000/month + meals' },
      { id: 'steers-r2', role: 'Store Manager', employment_status: 'Former', rating: 3, date: '2025-08', pros: 'Famous Brands provides good operational support. Steers brand is well-loved which makes the job easier. Training is structured.', cons: 'Franchise owners vary widely. Public holiday trading without premium pay at some franchises.', anonymous: true, helpful_count: 8, salary: 'R14 000/month' },
    ],
  },

  {
    id: 'wimpy-sa',
    name: 'Wimpy',
    industry: 'Fast Food / Casual Dining',
    size: '1 000+ employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Wimpy has been a South African institution since 1967, serving all-day breakfast, burgers, and coffee across 460+ restaurants. Part of Famous Brands, Wimpy is one of the most geographically diverse restaurant brands in SA — from airports to small towns. It's a warm, family-oriented brand with a loyal following.",
    overall_rating: 3.2,
    ratings: { work_life_balance: 3.3, culture: 3.4, management: 3.2, career_growth: 3.2, compensation: 3.0 },
    benefits: ['Staff meals', 'Tips kept by waiter', 'Famous Brands training', 'Uniform provided', 'Flexible hours'],
    website: 'wimpy.co.za',
    logo_url: 'https://logo.clearbit.com/wimpy.co.za',
    reviews: [
      { id: 'wimpy-r1', role: 'Waiter', employment_status: 'Current', rating: 3, date: '2025-11', pros: 'Regular customers are loyal and tip well — some have been coming for 20 years. The breakfast shift tips can be solid. The brand is everywhere so it\'s easy to transfer between towns.', cons: 'Pay is low. Breakfast shift starts very early. POS system at older branches is outdated.', anonymous: true, helpful_count: 13, salary: 'R5 000/month + tips' },
      { id: 'wimpy-r2', role: 'Chef', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'Good foundational cooking experience. All-day breakfast menu teaches efficiency. Stable employment.', cons: 'Menu is not challenging after the first month. Limited creativity.', anonymous: true, helpful_count: 6, salary: 'R7 500/month' },
    ],
  },

  {
    id: 'debonairs-pizza',
    name: 'Debonairs Pizza',
    industry: 'Pizza Chain',
    size: '1 000+ employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Debonairs Pizza is South Africa's leading pizza chain with 650+ outlets, part of Famous Brands. Famous for Triple-Decker pizza and fast delivery, Debonairs has a particularly strong township and suburban presence and is known for quick service and bold flavours.",
    overall_rating: 3.1,
    ratings: { work_life_balance: 3.0, culture: 3.3, management: 3.0, career_growth: 3.2, compensation: 3.0 },
    benefits: ['Staff discount on pizza', 'Delivery vehicle provided', 'Flexible hours', 'Training programme', 'Tips for drivers'],
    website: 'debonairs.co.za',
    logo_url: 'https://logo.clearbit.com/debonairs.co.za',
    reviews: [
      { id: 'deb-r1', role: 'Pizza Maker', employment_status: 'Current', rating: 3, date: '2025-11', pros: 'Fast-paced and you learn speed quickly. The team is usually young and the atmosphere is upbeat. Free pizza discount is great.', cons: 'Friday nights are chaotic. Late closing hours are tough. Pay is minimum wage.', anonymous: true, helpful_count: 9, salary: 'R4 800/month' },
      { id: 'deb-r2', role: 'Delivery Driver', employment_status: 'Current', rating: 3, date: '2025-08', pros: 'Tips from deliveries supplement the base salary. Flexible hours. Good way to learn the area.', cons: 'Fuel costs eat into earnings. Driving at night in some areas carries risk.', anonymous: true, helpful_count: 7, salary: 'R5 200/month + tips' },
    ],
  },

  {
    id: 'chicken-licken',
    name: 'Chicken Licken',
    industry: 'Fast Food Chain',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "Chicken Licken is one of South Africa's most beloved home-grown fast food chains, famous for Soul Fire chicken and iconic advertising. With 280+ restaurants, it's a distinctly South African brand that resonates deeply with local culture. Founded in 1981, Chicken Licken remains proudly independent.",
    overall_rating: 3.2,
    ratings: { work_life_balance: 3.0, culture: 3.5, management: 3.1, career_growth: 3.2, compensation: 3.0 },
    benefits: ['Staff meals', 'Uniform provided', 'Training', 'Promotion from within'],
    website: 'chickenlicken.co.za',
    logo_url: 'https://logo.clearbit.com/chickenlicken.co.za',
    reviews: [
      { id: 'cl2-r1', role: 'Counter Staff', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'Customers love the brand so the mood is usually good. Free meals are a real benefit. Night shift pay supplement is helpful.', cons: 'Night shifts are challenging. Peak hours are very demanding. Staff turnover is high.', anonymous: true, helpful_count: 10, salary: 'R4 700/month + meals' },
      { id: 'cl2-r2', role: 'Team Leader', employment_status: 'Former', rating: 3, date: '2025-06', pros: 'Good home-grown brand to have on the CV. Training is decent and management does promote internally.', cons: 'Inconsistency between franchise owners. Pay for team leaders is not significantly above crew.', anonymous: true, helpful_count: 6, salary: 'R7 000/month' },
    ],
  },

  {
    id: 'roman-pizza',
    name: "Roman's Pizza",
    industry: 'Pizza Chain',
    size: '500–1 000 employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "Roman's Pizza is a South African pizza delivery and takeaway brand with 270+ outlets, known for affordable prices and reliable delivery. A strong presence in middle-income areas and townships across SA, Roman's Pizza is a high-volume operation offering stable employment for both kitchen and delivery roles.",
    overall_rating: 3.2,
    ratings: { work_life_balance: 3.1, culture: 3.2, management: 3.1, career_growth: 3.2, compensation: 3.0 },
    benefits: ['Staff discount', 'Delivery vehicle or transport allowance', 'Training', 'Flexible hours'],
    website: 'romanspizza.co.za',
    logo_url: 'https://logo.clearbit.com/romanspizza.co.za',
    reviews: [
      { id: 'roman-r1', role: 'Pizza Maker', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'Great first job in the food industry. Easy to learn and the team is generally supportive. Good discounts on pizza.', cons: 'Late-night closing shifts are tiring. Pay is at minimum wage level.', anonymous: true, helpful_count: 8, salary: 'R4 800/month' },
      { id: 'roman-r2', role: 'Store Manager', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'Good franchise support from head office. The brand is well-known in townships which drives consistent volume.', cons: 'Tight margins mean minimal staff budget. Managing late-night operations in some areas carries safety concerns.', anonymous: true, helpful_count: 5, salary: 'R13 000/month' },
    ],
  },

  {
    id: 'burger-king-sa',
    name: 'Burger King South Africa',
    industry: 'Fast Food Chain',
    size: '500–1 000 employees',
    location: 'Cape Town (HQ) · Major Cities',
    description: "Burger King entered South Africa in 2013 and has grown to 90+ restaurants, making it one of the fastest-growing international QSR brands in the country. Known for the flame-grilled Whopper and a commitment to fresh, never-frozen beef, Burger King is rapidly expanding in major South African cities and offers genuine career growth in a global brand environment.",
    overall_rating: 3.5,
    ratings: { work_life_balance: 3.2, culture: 3.7, management: 3.4, career_growth: 4.0, compensation: 3.2 },
    benefits: ['Staff meals', 'International brand training', 'Career growth in expanding brand', 'Uniform provided', 'Flexible hours'],
    website: 'burgerking.co.za',
    logo_url: 'https://logo.clearbit.com/burgerking.co.za',
    reviews: [
      { id: 'bk-r1', role: 'Team Member', employment_status: 'Current', rating: 3, date: '2025-11', pros: 'Burger King is growing fast in SA so there are real promotion opportunities as new stores open. International brand training is structured and professional. The food quality is genuinely better than many competitors.', cons: 'Pay is minimum wage at crew level. Some stores are very understaffed during peak periods.', anonymous: true, helpful_count: 13, salary: 'R5 000/month + meals' },
      { id: 'bk-r2', role: 'Restaurant Manager', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Being part of a rapidly expanding brand means real opportunity. International Burger King management training is excellent and globally portable.', cons: 'Rapid expansion means some stores open without fully trained teams — pressure falls on managers.', anonymous: false, author_name: 'Palesa D.', helpful_count: 16, salary: 'R18 000/month' },
    ],
  },

  {
    id: 'fishaways',
    name: 'Fishaways',
    industry: 'Fast Food Chain',
    size: '500–1 000 employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Fishaways is South Africa's leading fish-and-chips chain, part of Famous Brands, with 250+ outlets. Specialising in affordable fresh seafood, Fishaways holds a loyal customer base across the country and offers consistent employment in both kitchen and service roles.",
    overall_rating: 3.1,
    ratings: { work_life_balance: 3.2, culture: 3.2, management: 3.0, career_growth: 3.0, compensation: 2.9 },
    benefits: ['Staff meals', 'Famous Brands training', 'Uniform', 'Flexible hours'],
    website: 'fishaways.co.za',
    logo_url: 'https://logo.clearbit.com/fishaways.co.za',
    reviews: [
      { id: 'fish-r1', role: 'Counter Staff', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'Regular customers and decent tips on busy days. The brand is well-known. Free fish meals are actually great.', cons: 'Seafood smell is unavoidable. Pay is entry-level. Some outlet equipment is old.', anonymous: true, helpful_count: 7, salary: 'R4 700/month + tips' },
      { id: 'fish-r2', role: 'Fryer Chef', employment_status: 'Former', rating: 2, date: '2025-05', pros: 'Good for very first job in a kitchen. Teaches speed and repetition.', cons: 'The work is extremely repetitive. Oil fryer heat is intense. Minimal career development beyond the frying station.', anonymous: true, helpful_count: 4, salary: 'R5 200/month' },
    ],
  },

  // ─── CASUAL DINING (ADDITIONAL) ─────────────────────────────────────────────

  {
    id: 'panarottis',
    name: "Panarottis Pizza Pasta",
    industry: 'Casual Dining Chain',
    size: '201–500 employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Panarottis is a South African casual dining brand known for its all-you-can-eat salad bar, deep-dish and thin-crust pizzas, and pasta. Part of the Spur Corporation group, Panarottis operates 80+ restaurants, primarily in shopping malls, and targets family diners seeking Italian-inspired comfort food.",
    overall_rating: 3.2,
    ratings: { work_life_balance: 3.1, culture: 3.4, management: 3.1, career_growth: 3.2, compensation: 3.0 },
    benefits: ['Staff meals', 'Tips kept by waiter', 'Spur Corporation group benefits', 'Training programme'],
    website: 'panarottis.co.za',
    logo_url: 'https://logo.clearbit.com/panarottis.co.za',
    reviews: [
      { id: 'pan-r1', role: 'Waiter', employment_status: 'Current', rating: 3, date: '2025-11', pros: 'Family-friendly atmosphere with good tips at the weekend. Customers in a good mood — pizza and pasta makes people happy. Spur group structure means there are policies in place.', cons: 'Kids create mess at the salad bar which falls on waiters to manage. Mall hours mean trading through all public holidays.', anonymous: true, helpful_count: 8, salary: 'R5 200/month + tips' },
      { id: 'pan-r2', role: 'Pizza Chef', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'Good basics in pizza making. Spur Corporation training structure is well-organised. Consistent busy periods keep the kitchen moving.', cons: 'Menu has not evolved much in years. Limited creativity. All-you-can-eat model puts pressure on kitchen throughput.', anonymous: true, helpful_count: 5, salary: 'R8 000/month' },
    ],
  },

  {
    id: 'john-dorys',
    name: "John Dory's Fish & Grill",
    industry: 'Casual Dining Chain',
    size: '201–500 employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "John Dory's is South Africa's premier casual seafood dining brand, part of the Spur Corporation portfolio. With 70+ restaurants across SA and internationally, the brand focuses on fresh fish and shellfish in a relaxed, coastal-inspired environment. John Dory's is well-regarded within the Spur Corporation family for its slightly more upmarket positioning.",
    overall_rating: 3.5,
    ratings: { work_life_balance: 3.3, culture: 3.7, management: 3.4, career_growth: 3.5, compensation: 3.4 },
    benefits: ['Staff meals', 'Tips kept by waiter', 'Spur group benefits', 'Seafood training', 'Public holiday premium'],
    website: 'johndorys.co.za',
    logo_url: 'https://logo.clearbit.com/johndorys.co.za',
    reviews: [
      { id: 'jd-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Seafood customers are generally upmarket and tip well. John Dory\'s positioning is slightly above Spur so the clientele is better. Good brand to develop table service skills.', cons: 'Seafood knowledge is expected but not always properly trained before you hit the floor. Weekend rushes are intense.', anonymous: true, helpful_count: 15, salary: 'R6 000/month + tips' },
      { id: 'jd-r2', role: 'Seafood Chef', employment_status: 'Former', rating: 3, date: '2025-08', pros: 'Good seafood preparation fundamentals. Fresh fish programme is well-managed at better-run franchise locations.', cons: 'Fish sourcing can be inconsistent at some franchise locations. Repetition gets to you after a while.', anonymous: true, helpful_count: 9, salary: 'R10 000/month' },
    ],
  },

  {
    id: 'primi-piatti',
    name: 'Primi Piatti',
    industry: 'Italian Casual Dining',
    size: '201–500 employees',
    location: 'Johannesburg · Cape Town',
    description: "Primi Piatti is a South African Italian-inspired restaurant brand known for quality gourmet pizza, fresh pasta, and a vibrant atmosphere. Positioned at the premium end of casual dining, Primi Piatti operates across upmarket shopping centres in Johannesburg and Cape Town and attracts a design-conscious, food-loving clientele.",
    overall_rating: 3.8,
    ratings: { work_life_balance: 3.4, culture: 3.9, management: 3.7, career_growth: 3.6, compensation: 3.7 },
    benefits: ['Staff meals', 'Tips kept by waiter', 'Wine and food training', 'Uniform provided'],
    website: 'primipiatti.co.za',
    logo_url: 'https://logo.clearbit.com/primipiatti.co.za',
    reviews: [
      { id: 'primi-r1', role: 'Waiter', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Upmarket Italian atmosphere means good tips. Customers arrive in a good mood. The food is quality which makes it easy to sell enthusiastically.', cons: 'Shopping centre hours are long. High standards required consistently. Management can be demanding.', anonymous: true, helpful_count: 11, salary: 'R6 500/month + tips' },
      { id: 'primi-r2', role: 'Pasta Chef', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'Proper Italian pasta techniques learned here. Quality ingredients. Great recipe to have on your CV.', cons: 'Pasta demand during lunch rush is relentless. Kitchen can be hot and cramped.', anonymous: true, helpful_count: 7, salary: 'R10 500/month' },
    ],
  },

  // ─── WINE ESTATES ─────────────────────────────────────────────────────────────

  {
    id: 'babylonstoren',
    name: 'Babylonstoren',
    industry: 'Wine Estate & Hotel',
    size: '201–500 employees',
    location: 'Franschhoek Valley, Western Cape',
    description: "Babylonstoren is one of the oldest Cape Dutch farms in the Winelands, dating to 1692. Today it is one of South Africa's most celebrated hospitality destinations — a working farm estate with award-winning wines, two restaurants (Babel and Greenhouse), a spa, a farm shop, and luxury cottages. Known for its extraordinary farm garden and a philosophy of growing, cooking, and sharing.",
    overall_rating: 4.5,
    ratings: { work_life_balance: 3.9, culture: 4.7, management: 4.4, career_growth: 4.1, compensation: 3.8 },
    benefits: ['Estate accommodation available for some roles', 'Staff meals from farm kitchen', 'Wine allocation', 'Seasonal produce from the garden', 'World-class environment', 'Annual leave bonus'],
    website: 'babylonstoren.com',
    logo_url: 'https://logo.clearbit.com/babylonstoren.com',
    reviews: [
      { id: 'bab-r1', role: 'Restaurant Host', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Working among the farm garden and vineyards with mountain views is genuinely magical. Guests arrive full of joy. The food grown on the estate and served in Babel is extraordinary. Management has real passion for what they do.', cons: 'Remote location requires your own transport or estate accommodation. Peak season (December–February) is demanding.', anonymous: true, helpful_count: 33, salary: 'R7 500/month + tips' },
      { id: 'bab-r2', role: 'Bakery Chef', employment_status: 'Current', rating: 5, date: '2025-09', pros: 'Baking with flour milled on the estate from heritage grains is extraordinary. The standard of baking at Babylonstoren is world-class. Management invests in the craft.', cons: 'Early morning starts are non-negotiable in a bakery. The farm is remote from Cape Town social life.', anonymous: false, author_name: 'Elsa D.', helpful_count: 24, salary: 'R12 000/month' },
      { id: 'bab-r3', role: 'Tasting Room Host', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'The wine programme is excellent and you learn a great deal. Guests come specifically to Babylonstoren for the experience which makes them engaged and appreciative.', cons: 'Tourist-heavy December tests your patience and stamina. Winelands heat in January is very intense.', anonymous: true, helpful_count: 15 },
    ],
  },

  {
    id: 'spier-wine-farm',
    name: 'Spier Wine Farm',
    industry: 'Wine Estate',
    size: '201–500 employees',
    location: 'Stellenbosch, Western Cape',
    description: "Spier is one of the Cape's oldest wine estates, founded in 1692, operating restaurants, wine tasting facilities, a luxury hotel, eagle encounters, and accommodation across its expansive Stellenbosch property. Spier is known for its commitment to sustainability, B Corp principles, and social impact — making it one of the most values-driven employers in the Winelands.",
    overall_rating: 4.1,
    ratings: { work_life_balance: 3.8, culture: 4.5, management: 4.0, career_growth: 3.8, compensation: 3.6 },
    benefits: ['Staff accommodation option', 'Wine allocation', 'Sustainability training', 'Staff meals', 'Annual social development bonus'],
    website: 'spier.co.za',
    logo_url: 'https://logo.clearbit.com/spier.co.za',
    reviews: [
      { id: 'spier-r1', role: 'Restaurant Manager', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'The sustainability focus makes this a purposeful place to work — you feel like your work means something. The estate is beautiful and management genuinely cares about staff wellbeing. Real management development.', cons: 'Spier can be overwhelming in peak season. Multiple restaurants operating simultaneously requires strong coordination.', anonymous: true, helpful_count: 20, salary: 'R22 000/month' },
      { id: 'spier-r2', role: 'Wine Tasting Host', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Excellent wine education and tasting notes training. Spier\'s wine range is broad so you become knowledgeable fast. Guests are enthusiastic about wine which makes it enjoyable.', cons: 'December tourist season is relentless with back-to-back tastings. Weekends are extremely busy.', anonymous: false, author_name: 'Ayanda M.', helpful_count: 15, salary: 'R7 000/month + tips' },
      { id: 'spier-r3', role: 'Sous Chef (Eight Restaurant)', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'Cooking with farm-grown produce at Spier is deeply satisfying. The head chef allows genuine creative input. B Corp ethos filters into the kitchen.', cons: 'Remote from Cape Town. Supply logistics from the farm kitchen occasionally creates challenges.', anonymous: true, helpful_count: 11 },
    ],
  },

  {
    id: 'boschendal-estate',
    name: 'Boschendal Wine Estate',
    industry: 'Wine Estate',
    size: '201–500 employees',
    location: 'Franschhoek, Western Cape',
    description: 'Boschendal is a historic 300-year-old wine estate in the Franschhoek Valley, offering multiple restaurants (including the iconic Werf restaurant), wine tasting, farm shop, and luxury accommodation. One of the Cape Winelands\' most celebrated destinations, Boschendal has recently undergone a major revitalisation under new ownership and is building one of the most ambitious farm-to-table food programmes in South Africa.',
    overall_rating: 4.2,
    ratings: { work_life_balance: 3.8, culture: 4.4, management: 4.0, career_growth: 3.9, compensation: 3.7 },
    benefits: ['Estate accommodation option', 'Wine allocation', 'Farm-to-table food education', 'Staff meals', 'Annual estate bonus'],
    website: 'boschendal.com',
    logo_url: 'https://logo.clearbit.com/boschendal.com',
    reviews: [
      { id: 'bosch-r1', role: 'Werf Chef', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Boschendal\'s farm-to-table programme is the most ambitious in the Cape. Cooking with ingredients grown on a 300-year-old estate is extraordinary. The head chef is passionate and generous with knowledge.', cons: 'Event catering during peak season adds significant pressure. Franschhoek heat in January is intense.', anonymous: true, helpful_count: 26, salary: 'R13 000/month' },
      { id: 'bosch-r2', role: 'Wine Tasting Sommelier', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'The wine cellar is one of the finest in SA. Historic estate makes every tasting feel significant. Guests are wine enthusiasts which means interesting conversations.', cons: 'December volume is extreme. Managing large tour groups through tastings requires real crowd management skills.', anonymous: false, author_name: 'Brendan W.', helpful_count: 18, salary: 'R9 500/month + tips' },
      { id: 'bosch-r3', role: 'Accommodation Host', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'The cottages and manor house at Boschendal are beautiful to manage. Guests are in a holiday mindset and very appreciative. Estate setting is magnificent.', cons: 'Remote from Cape Town and Stellenbosch. Evening activities on the estate are limited for staff.', anonymous: true, helpful_count: 10 },
    ],
  },

  {
    id: 'delaire-graff-estate',
    name: 'Delaire Graff Estate',
    industry: 'Luxury Wine Estate',
    size: '101–200 employees',
    location: 'Stellenbosch, Western Cape',
    description: "Delaire Graff Estate is one of the Cape Winelands' most spectacular properties, owned by diamond magnate Laurence Graff and perched on the Helshoogte Pass with views across the Valley of the Vines. Featuring two fine dining restaurants (Indochine and Delaire Graff Restaurant), an ultra-luxury spa, boutique hotel, and an extraordinary art collection, Delaire Graff is recognised as one of the finest wine estates in the world.",
    overall_rating: 4.6,
    ratings: { work_life_balance: 3.5, culture: 4.7, management: 4.5, career_growth: 4.3, compensation: 4.2 },
    benefits: ['Fine dining training', 'Wine allocation (significant)', 'Art exposure', 'Staff meals', 'Medical aid', 'Accommodation for suitable candidates'],
    website: 'delaire.co.za',
    logo_url: 'https://logo.clearbit.com/delaire.co.za',
    reviews: [
      { id: 'del-r1', role: 'Sommelier (Indochine)', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'The wine cellar at Delaire Graff is extraordinary — curated by a world-class winemaking team. Guest profile is the most sophisticated in the Winelands. Tips are substantial. The art collection you work among every day is like no other workplace in SA.', cons: 'The drive up Helshoogte Pass is not something you want every day in poor weather. Guest expectations at this price point are absolute.', anonymous: false, author_name: 'Nina P.', helpful_count: 37, salary: 'R16 000/month + tips' },
      { id: 'del-r2', role: 'Chef de Partie (Delaire Restaurant)', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'Cooking at Delaire with produce from the estate kitchen garden and access to the best proteins in the Cape. Chef Mark Kroger\'s creative influence is extraordinary. This role transformed my cooking.', cons: 'The standard expected is world-class and uncompromising. Hours are long during peak wine estate season.', anonymous: true, helpful_count: 28, salary: 'R14 000/month' },
      { id: 'del-r3', role: 'Spa Therapist', employment_status: 'Former', rating: 5, date: '2025-07', pros: 'The spa at Delaire Graff is among the finest in Africa. Equipment and product are exceptional. Tips from the international guest profile are transformative. The vineyard views from treatment rooms are something else.', cons: 'Very high treatment standards required from day one. Helshoogte location adds transport challenge.', anonymous: true, helpful_count: 21 },
    ],
  },

  {
    id: 'waterford-estate',
    name: 'Waterford Estate',
    industry: 'Wine Estate',
    size: '51–100 employees',
    location: 'Stellenbosch, Western Cape',
    description: 'Waterford Estate is an award-winning boutique wine estate in Stellenbosch known for its acclaimed Bordeaux-style red blends and innovative chocolate and wine pairing experience. A family-owned estate with a strong commitment to excellence in both winemaking and hospitality, Waterford attracts a wine-educated, discerning clientele.',
    overall_rating: 4.3,
    ratings: { work_life_balance: 4.0, culture: 4.5, management: 4.3, career_growth: 3.7, compensation: 3.7 },
    benefits: ['Wine allocation', 'Chocolate pairing training', 'Estate setting', 'Staff meals', 'Winemaking education'],
    website: 'waterfordestate.co.za',
    logo_url: 'https://logo.clearbit.com/waterfordestate.co.za',
    reviews: [
      { id: 'water-r1', role: 'Tasting Room Host', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'The chocolate and wine pairing concept is unique and guests genuinely love it. Excellent wine education from the winemaking team. Family-owned estate means you feel genuinely valued.', cons: 'Smaller estate means limited career advancement pathways. December volume is challenging for the tasting room team size.', anonymous: true, helpful_count: 17, salary: 'R7 500/month + tips' },
      { id: 'water-r2', role: 'Events Coordinator', employment_status: 'Former', rating: 4, date: '2025-08', pros: 'Estate weddings and private events here are spectacular. Excellent wines and food for guests. Owner family is warm and involved.', cons: 'Event days are very long. Remote Stellenbosch location requires a vehicle.', anonymous: false, author_name: 'Carel N.', helpful_count: 11, salary: 'R11 000/month' },
    ],
  },

  {
    id: 'jordan-wine-estate',
    name: 'Jordan Wine Estate',
    industry: 'Wine Estate',
    size: '51–200 employees',
    location: 'Stellenbosch, Western Cape',
    description: "Jordan Wine Estate is a family-owned Stellenbosch estate renowned for its premium Bordeaux-style reds and Chardonnay, a celebrated restaurant (Jordan Restaurant), and extraordinary views across False Bay and Table Mountain from its hilltop cellar.",
    overall_rating: 4.2,
    ratings: { work_life_balance: 4.0, culture: 4.4, management: 4.2, career_growth: 3.7, compensation: 3.8 },
    benefits: ['Wine allocation', 'Restaurant training', 'Vineyard views', 'Staff meals', 'Family-owned environment'],
    website: 'jordanwines.com',
    logo_url: 'https://logo.clearbit.com/jordanwines.com',
    reviews: [
      { id: 'jordan-r1', role: 'Restaurant Waiter', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'The views from Jordan Restaurant are among the best in the Winelands. Wine education is exceptional — the Jordan family know their product inside out. Tips from the international guests are great.', cons: 'The hillside location makes getting to work challenging without a car. Busy season in summer is demanding for a boutique team.', anonymous: true, helpful_count: 14, salary: 'R7 000/month + tips' },
      { id: 'jordan-r2', role: 'Kitchen Chef', employment_status: 'Former', rating: 4, date: '2025-07', pros: 'Cooking in Jordan Restaurant with estate-grown produce and world-class wines is a privilege. The head chef has high standards and teaches properly.', cons: 'Small kitchen team carries a lot during a full restaurant service.', anonymous: true, helpful_count: 9, salary: 'R12 000/month' },
    ],
  },

  // ─── COFFEE & SPECIALTY ───────────────────────────────────────────────────────

  {
    id: 'truth-coffee',
    name: 'Truth Coffee Roasting',
    industry: 'Specialty Coffee Roastery',
    size: '51–100 employees',
    location: 'Cape Town, CBD',
    description: "Truth Coffee Roasting is one of the world's most celebrated specialty coffee destinations, named world's best coffee shop by Thrillist. Its Cape Town CBD flagship is a stunning steampunk-themed roastery and café where single-origin coffees are roasted in-house and served by some of the most highly skilled baristas in South Africa.",
    overall_rating: 4.4,
    ratings: { work_life_balance: 3.7, culture: 4.8, management: 4.3, career_growth: 4.2, compensation: 3.5 },
    benefits: ['Specialty coffee education', 'Competition team entry', 'Free coffee on shift', 'Barista certification', 'International recognition on CV'],
    website: 'truthcoffee.com',
    logo_url: 'https://logo.clearbit.com/truthcoffee.com',
    reviews: [
      { id: 'truth-r1', role: 'Barista', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'The coffee knowledge you gain here is truly world-class. The steampunk environment is extraordinary. Colleagues are genuinely the best baristas in SA. The specialty coffee fundamentals you build at Truth open every coffee door globally.', cons: 'Pay is not commensurate with the skill and global reputation. Peak tourist periods mean relentless queues. The hype attracts customers who don\'t always understand specialty coffee.', anonymous: true, helpful_count: 39, salary: 'R6 500/month' },
      { id: 'truth-r2', role: 'Head Barista', employment_status: 'Current', rating: 5, date: '2025-09', pros: 'Training the team here is the most rewarding barista education experience in SA. World\'s best coffee shop recognition is not small — it changes your professional standing internationally.', cons: 'Managing expectations from a world-famous café is intense. Social media attention on every cup.', anonymous: false, author_name: 'Carla A.', helpful_count: 27, salary: 'R9 500/month' },
      { id: 'truth-r3', role: 'Roastery Assistant', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'Learning to roast single-origin beans at Truth transforms your understanding of coffee. Extraordinary education.', cons: 'Roastery work involves early starts. Pay is low for the skill level.', anonymous: true, helpful_count: 15 },
    ],
  },

  {
    id: 'kauai-sa',
    name: 'Kauai',
    industry: 'Health Food Café',
    size: '501–1 000 employees',
    location: 'Cape Town (HQ) · Nationwide',
    description: "Kauai is South Africa's leading health-food café brand, with 140+ outlets across shopping centres, gyms, and airports. Known for smoothie bowls, wraps, salads, and health-conscious meals, Kauai attracts an active, wellness-focused clientele. The brand is part of the Rand Merchant Investment Holdings portfolio and offers stable, structured employment in a growing segment.",
    overall_rating: 3.7,
    ratings: { work_life_balance: 3.6, culture: 3.8, management: 3.6, career_growth: 3.6, compensation: 3.5 },
    benefits: ['Healthy meals on shift', 'Smoothie training', 'Staff discount', 'Flexible student-friendly hours', 'Uniform provided'],
    website: 'kauai.co.za',
    logo_url: 'https://logo.clearbit.com/kauai.co.za',
    reviews: [
      { id: 'kauai-r1', role: 'Smoothie Barista', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'The product is genuinely healthy and you feel good about what you serve. Active gym-going clientele are usually in great moods. Healthy staff meals every day.', cons: 'Morning gym crowd between 6–9am is the most intense period. Pay is on the lower side for the skill involved.', anonymous: true, helpful_count: 18, salary: 'R5 500/month' },
      { id: 'kauai-r2', role: 'Store Manager', employment_status: 'Current', rating: 3, date: '2025-09', pros: 'Growing brand with good operational support. Healthy industry to be in with tailwinds. Systems are structured.', cons: 'Margins on health food are tight which limits staffing. Managing diet-conscious customers who have very specific needs all day is mentally demanding.', anonymous: false, author_name: 'Jessica T.', helpful_count: 12, salary: 'R16 000/month' },
      { id: 'kauai-r3', role: 'Kitchen Assistant', employment_status: 'Former', rating: 3, date: '2025-05', pros: 'Good healthy food every shift. Clean kitchen environment. Nice, health-conscious colleagues.', cons: 'Pay is low. The early starts for breakfast shift are tough. Limited tips in a health café environment.', anonymous: true, helpful_count: 7, salary: 'R5 000/month' },
    ],
  },

  {
    id: 'bootlegger-coffee',
    name: 'Bootlegger Coffee Company',
    industry: 'Specialty Coffee Café',
    size: '51–200 employees',
    location: 'Cape Town · Sea Point, Kloof St & More',
    description: "Bootlegger Coffee Company is one of Cape Town's most beloved specialty coffee and brunch brands, with multiple locations across the city. Known for exceptional single-origin espresso, seasonal food menus, and beautifully designed spaces, Bootlegger is a serious specialty coffee destination that attracts coffee enthusiasts and brunch lovers in equal measure.",
    overall_rating: 4.2,
    ratings: { work_life_balance: 3.8, culture: 4.6, management: 4.1, career_growth: 3.9, compensation: 3.5 },
    benefits: ['Specialty coffee education', 'Staff coffee', 'Tips kept by staff', 'Barista competition support', 'Creative work environment'],
    website: 'bootlegger.co.za',
    logo_url: 'https://logo.clearbit.com/bootlegger.co.za',
    reviews: [
      { id: 'boot-r1', role: 'Barista', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Best specialty coffee culture in Cape Town. The barista team genuinely cares about craft. Management invests in competitions and education. Coffee is exceptional quality. The work environment is beautiful.', cons: 'Saturday brunch rush is absolutely relentless. Pay is low relative to the skill and passion required.', anonymous: true, helpful_count: 30, salary: 'R6 000/month + tips' },
      { id: 'boot-r2', role: 'Kitchen Chef', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Seasonal menu changes keep the cooking interesting. Management listens to chef input on the menu. The crowd is food-educated which means genuine appreciation.', cons: 'Weekend brunch service in Sea Point is peak intensity. Small kitchen team.', anonymous: false, author_name: 'Michael A.', helpful_count: 20, salary: 'R10 500/month' },
    ],
  },

  // ─── INTERNATIONAL HOTELS (ADDITIONAL) ───────────────────────────────────────

  {
    id: 'marriott-protea-hotels',
    name: 'Marriott Hotels & Protea Hotels',
    industry: 'International Hotel Group',
    size: '1 000+ employees',
    location: 'Cape Town (SA HQ) · Nationwide',
    description: "Marriott International acquired South Africa's Protea Hotels in 2014, making it the largest hotel brand in Africa. The combined group operates 100+ properties across South Africa under brands including Protea Hotels by Marriott, Marriott Hotels, Westin, Sheraton, and Autograph Collection. South Africa is one of Marriott's most significant markets globally, with a major hub for African operations.",
    overall_rating: 3.9,
    ratings: { work_life_balance: 3.6, culture: 3.9, management: 3.8, career_growth: 4.3, compensation: 3.7 },
    benefits: ['Marriott Bonvoy employee travel rates (globally)', 'Medical aid', 'Provident fund', 'Marriott global training programmes', 'International transfer opportunities', 'Staff meals', 'Annual recognition awards'],
    website: 'marriott.com',
    logo_url: 'https://logo.clearbit.com/marriott.com',
    reviews: [
      { id: 'mar-r1', role: 'F&B Manager', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'Marriott Bonvoy employee rates are extraordinary — I\'ve stayed at Marriott properties in New York, London, and Singapore at minimal cost. The international network and transfer pathways are real. Training through Marriott\'s global programmes is excellent.', cons: 'Large corporate structure means slow decision-making. Reporting requirements are heavy. The Protea integration created some culture tensions that still linger in older properties.', anonymous: true, helpful_count: 27, salary: 'R26 000/month' },
      { id: 'mar-r2', role: 'Rooms Division Manager', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Managing a Marriott property develops globally portable skills. International brand standards are genuinely excellent. Real management career pathway exists within the group.', cons: 'Corporate KPI culture can feel disconnected from actual guest service. Month-end reporting is relentless.', anonymous: false, author_name: 'Kefilwe S.', helpful_count: 19, salary: 'R32 000/month' },
      { id: 'mar-r3', role: 'Kitchen Chef', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'International brand means access to global menu development resources. Good ingredients and proper equipment at all properties.', cons: 'Creativity is limited by brand standards. High-volume hotel kitchens prioritise efficiency over craft.', anonymous: true, helpful_count: 12, salary: 'R13 000/month' },
    ],
  },

  {
    id: 'four-seasons-westcliff',
    name: 'Four Seasons Hotel The Westcliff',
    industry: 'Ultra-Luxury Hotel',
    size: '101–300 employees',
    location: 'Johannesburg, Westcliff Ridge',
    description: "The Four Seasons Hotel The Westcliff is Johannesburg's most prestigious address — a terraced luxury property on the Westcliff Ridge with sweeping views over the Johannesburg Zoo and beyond. Part of the globally acclaimed Four Seasons Hotels & Resorts group, The Westcliff operates to the most exacting standards of luxury hospitality in the world and attracts heads of state, celebrities, and ultra-high-net-worth travellers.",
    overall_rating: 4.6,
    ratings: { work_life_balance: 3.4, culture: 4.7, management: 4.5, career_growth: 4.6, compensation: 4.4 },
    benefits: ['Four Seasons global employee stay rates', 'Medical aid', 'Provident fund', 'World-class training', 'International transfer across 120+ properties', 'Staff meals of exceptional quality', 'Recognition and annual awards'],
    website: 'fourseasons.com',
    logo_url: 'https://logo.clearbit.com/fourseasons.com',
    reviews: [
      { id: 'fs-r1', role: 'Concierge', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'Four Seasons service culture is the gold standard of the global hotel industry — working here transforms your hospitality philosophy permanently. The global employee rate for stays at 120+ properties worldwide is a life-changing benefit. Guests are extraordinary people. International transfer to London, Bali, Paris, or New York is a real possibility.', cons: 'The expectation of absolute perfection is non-negotiable and unrelenting. Mistakes are taken very seriously. The Westcliff neighbourhood is expensive to reach daily.', anonymous: true, helpful_count: 49, salary: 'R16 000/month' },
      { id: 'fs-r2', role: 'Executive Chef', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'Leading the kitchen at the Four Seasons Westcliff is the pinnacle of hotel F&B in Johannesburg. Resources are without compromise — the produce budget, equipment, and team size are all exceptional. Four Seasons chef culture is rigorous and deeply educational.', cons: 'The standard demanded is absolute and pressure is constant. Work-life balance at this level is the trade-off for the prestige.', anonymous: false, author_name: 'Stefan V.', helpful_count: 38, salary: 'R65 000/month' },
      { id: 'fs-r3', role: 'Spa Therapist', employment_status: 'Former', rating: 5, date: '2025-08', pros: 'The Four Seasons Westcliff spa is world-class. Products and equipment are the finest available. Guest gratuities are extraordinary. Four Seasons on the CV opens every global spa door.', cons: 'Physical demands of a full day of treatments are significant. The location is challenging without personal transport.', anonymous: true, helpful_count: 29 },
    ],
  },

  {
    id: 'ihg-south-africa',
    name: 'IHG Hotels South Africa',
    industry: 'International Hotel Group',
    size: '501–1 000 employees',
    location: 'Johannesburg · Cape Town · Durban',
    description: 'InterContinental Hotels Group (IHG) operates multiple properties across South Africa under brands including InterContinental, Crowne Plaza, Holiday Inn, and voco. Key SA properties include the InterContinental Johannesburg OR Tambo and multiple Crowne Plaza and Holiday Inn locations across major cities. IHG offers strong international career pathways and globally recognised hospitality training.',
    overall_rating: 3.8,
    ratings: { work_life_balance: 3.6, culture: 3.9, management: 3.7, career_growth: 4.2, compensation: 3.6 },
    benefits: ['IHG employee hotel rate programme', 'Medical aid', 'Provident fund', 'IHG Academy training', 'International transfer', 'Staff meals'],
    website: 'ihg.com',
    logo_url: 'https://logo.clearbit.com/ihg.com',
    reviews: [
      { id: 'ihg-r1', role: 'Front Office Manager', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'IHG\'s global network means real international career mobility. The IHG employee rate programme allows affordable stays at properties worldwide. Training is structured and internationally recognised.', cons: 'Airport hotel locations can feel isolating. Shift rotation including overnight audit is demanding.', anonymous: true, helpful_count: 19, salary: 'R20 000/month' },
      { id: 'ihg-r2', role: 'Food & Beverage Supervisor', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'International brand experience is valuable on a SA CV. Good operational systems. Employee rate programme used to travel during leave was exceptional value.', cons: 'Corporate bureaucracy in a large group can slow even simple decisions. Creativity limited by brand standards.', anonymous: true, helpful_count: 11, salary: 'R13 500/month' },
    ],
  },

  // ─── LOCAL HOTELS (ADDITIONAL) ────────────────────────────────────────────────

  {
    id: 'peermont-hotels',
    name: 'Peermont Hotels & Resorts',
    industry: 'Hotel & Casino Group',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: 'Peermont Hotels & Resorts is a South African hotel and casino group operating major entertainment complexes including Emperors Palace, Metcourt Hotels, and D\'oreale Grande across SA and Botswana. As one of the most prominent Black-owned entertainment companies in South Africa, Peermont offers both casino and hotel hospitality employment with strong BBBEE credentials.',
    overall_rating: 3.7,
    ratings: { work_life_balance: 3.4, culture: 3.7, management: 3.5, career_growth: 3.8, compensation: 3.7 },
    benefits: ['Medical aid', 'Provident fund', 'Casino employee benefits', 'Staff canteen', 'Hotel discounts across portfolio', 'BBBEE employer'],
    website: 'peermont.com',
    logo_url: 'https://logo.clearbit.com/peermont.com',
    reviews: [
      { id: 'peer-r1', role: 'Banqueting Coordinator', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Emperors Palace hosts some of the largest events in South Africa — the scale of experience gained is remarkable. Management is supportive. BBBEE commitment makes it a good long-term employer for career development.', cons: '24-hour casino operation means unsociable hours filter into the hotel and F&B teams. The Kempton Park location can be challenging for commuters.', anonymous: true, helpful_count: 16, salary: 'R15 000/month' },
      { id: 'peer-r2', role: 'Waiter (Emperors Palace)', employment_status: 'Current', rating: 3, date: '2025-09', pros: 'Good tips from casino guests who are celebrating. Large banqueting operation means constant work. Job security in a large group.', cons: '24-hour casino environment disrupts normal rhythms. Night shift rotation is inevitable. Smoke in casino areas drifts into some restaurant zones.', anonymous: false, author_name: 'Simphiwe T.', helpful_count: 11, salary: 'R7 000/month + tips' },
    ],
  },

  {
    id: 'premier-hotels',
    name: 'Premier Hotels & Resorts',
    industry: 'Hotel Group',
    size: '201–500 employees',
    location: 'East London (HQ) · Nationwide',
    description: 'Premier Hotels & Resorts is a South African hotel group with 20+ properties across SA, including resort and business hotels in major cities and coastal destinations. Known for its community focus, strong BBBEE credentials, and growing portfolio of mid-to-upmarket properties.',
    overall_rating: 3.6,
    ratings: { work_life_balance: 3.7, culture: 3.7, management: 3.5, career_growth: 3.5, compensation: 3.4 },
    benefits: ['Medical aid option', 'Provident fund', 'Staff accommodation discount', 'Training programme', 'BBBEE employer'],
    website: 'premierhotels.co.za',
    logo_url: 'https://logo.clearbit.com/premierhotels.co.za',
    reviews: [
      { id: 'prem-r1', role: 'Front Desk Receptionist', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'Good stable employment with a growing South African group. BBBEE focus and community investment make it meaningful. Good for building a hotel career in smaller cities.', cons: 'Systems are less sophisticated than the international brands. Pay is below Tsogo Sun and City Lodge for equivalent roles.', anonymous: true, helpful_count: 10, salary: 'R7 500/month' },
      { id: 'prem-r2', role: 'F&B Supervisor', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'Good management experience with a South African group. Community hotel clientele is friendly. Stable work environment.', cons: 'Properties vary significantly in quality and management style. Slower investment in infrastructure.', anonymous: true, helpful_count: 6, salary: 'R12 000/month' },
    ],
  },

  // ─── LUXURY BOUTIQUE (ADDITIONAL) ────────────────────────────────────────────

  {
    id: 'ellerman-house',
    name: 'Ellerman House',
    industry: 'Luxury Boutique Hotel',
    size: '51–100 employees',
    location: 'Bantry Bay, Cape Town',
    description: 'Ellerman House is a legendary 11-suite luxury boutique hotel perched above Bantry Bay, with extraordinary views of the Atlantic. Featuring one of South Africa\'s finest private art collections, an exceptional wine cellar, and an intimate butler-led service model, Ellerman House is consistently ranked among the finest small hotels in Africa.',
    overall_rating: 4.8,
    ratings: { work_life_balance: 3.5, culture: 4.9, management: 4.7, career_growth: 4.2, compensation: 4.5 },
    benefits: ['Fine wine education (one of SA\'s finest cellars)', 'Art exposure', 'Premium staff meals', 'Medical aid', 'International luxury hotel network access'],
    website: 'ellerman.co.za',
    logo_url: 'https://logo.clearbit.com/ellerman.co.za',
    reviews: [
      { id: 'eller-r1', role: 'Butler', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'Only 11 suites means you truly know each guest and deliver transformatively personal service. The art collection, the wine cellar, the Atlantic views — it is the finest workplace I have ever encountered. Guest gratuities at this level are life-changing. The knowledge and relationships you build are priceless.', cons: 'The responsibility per staff member is immense in a property of this size and price point. Bantry Bay requires personal transport. Complete discretion is the rule — not the exception.', anonymous: true, helpful_count: 43, salary: 'R14 000/month + gratuities' },
      { id: 'eller-r2', role: 'Cellar Master', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'The Ellerman wine cellar is among the finest curated private collections in Africa. Managing it and educating guests is a privilege that sharpens your wine expertise beyond any traditional route.', cons: 'The knowledge depth expected requires continuous self-study. Small team means broad responsibilities.', anonymous: false, author_name: 'Douglas W.', helpful_count: 31, salary: 'R18 000/month' },
    ],
  },

  {
    id: 'leeu-collection',
    name: 'Leeu Collection',
    industry: 'Luxury Boutique Hotels',
    size: '101–200 employees',
    location: 'Franschhoek, Western Cape',
    description: "Leeu Collection is an intimate luxury hotel group owned by businessman Analjit Singh, operating properties in Franschhoek (Leeu House, Leeu Estates, and Akademie Street Boutique Hotel), London, and India. Known for extraordinary food and wine, art curation, and deeply personalised service, Leeu Collection is among the finest boutique luxury hotel groups in Africa.",
    overall_rating: 4.5,
    ratings: { work_life_balance: 3.7, culture: 4.7, management: 4.4, career_growth: 4.1, compensation: 4.1 },
    benefits: ['Accommodation assistance in Franschhoek', 'Wine education', 'Fine dining training', 'Staff meals', 'International transfer opportunities (London, India)'],
    website: 'leeucollection.com',
    logo_url: 'https://logo.clearbit.com/leeucollection.com',
    reviews: [
      { id: 'leeu-r1', role: 'Head Chef', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Creative freedom to build a world-class menu in the most beautiful valley in South Africa. Leeu Collection\'s commitment to excellence matches my own. The wine access for chef development is extraordinary. International transfer to London is real.', cons: 'Franschhoek is small — social life is limited. The intimate scale of the property means every service is high-visibility.', anonymous: false, author_name: 'Florian M.', helpful_count: 34, salary: 'R35 000/month' },
      { id: 'leeu-r2', role: 'Room Attendant', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Working in beautiful Franschhoek properties is genuinely uplifting. The management team respects housekeeping staff here unlike at many other properties. Staff meals are of excellent quality.', cons: 'Franschhoek is small and the drive from surrounding areas can be long. Very high room preparation standards required.', anonymous: true, helpful_count: 17, salary: 'R8 000/month' },
    ],
  },

  // ─── GAME LODGES (ADDITIONAL) ────────────────────────────────────────────────

  {
    id: 'londolozi',
    name: 'Londolozi Game Reserve',
    industry: 'Luxury Safari Lodge',
    size: '101–300 employees',
    location: 'Sabi Sand Game Reserve, Mpumalanga',
    description: "Londolozi is the birthplace of responsible ecotourism in South Africa. The Varty family's Sabi Sand reserve has pioneered the model of luxury lodge safari that has been replicated across Africa. Famous for habituated leopards and extraordinary Big Five sightings, Londolozi consistently wins the world's most prestigious travel awards and attracts guests from every corner of the globe.",
    overall_rating: 4.8,
    ratings: { work_life_balance: 3.8, culture: 4.9, management: 4.7, career_growth: 4.5, compensation: 4.2 },
    benefits: ['Full bush accommodation', 'All meals provided', 'Game drive access', 'Conservation and tracking education', 'Guest gratuities', 'International recognition on CV'],
    website: 'londolozi.com',
    logo_url: 'https://logo.clearbit.com/londolozi.com',
    reviews: [
      { id: 'lond-r1', role: 'Game Ranger', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'Tracking leopards at Londolozi every day is an extraordinary privilege. The Varty family ethos permeates the whole lodge — this is genuinely the birthplace of responsible ecotourism and you feel that history every day. Guest gratuities from the international clientele are life-changing. The team culture is the most close-knit I\'ve ever experienced.', cons: 'Rotation lifestyle means extended time away from family in the city. Mobile signal is minimal on reserve.', anonymous: true, helpful_count: 51, salary: 'R14 000/month + accommodation + meals + gratuities' },
      { id: 'lond-r2', role: 'Lodge Chef', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'Cooking the finest meals for guests who have just had a leopard sighting is indescribable. The kitchen at Londolozi has full creative support. Access to outstanding produce. The international food writers who visit keep standards high in the best way.', cons: 'Bush logistics require planning far in advance. Rotation can be lonely if family is far.', anonymous: false, author_name: 'Anna V.', helpful_count: 38, salary: 'R16 000/month + accommodation + meals' },
      { id: 'lond-r3', role: 'Lodge Host', employment_status: 'Former', rating: 5, date: '2025-07', pros: 'The most life-affirming hospitality work I have ever done. Londolozi\'s values are real and the environment is genuinely transformative. CV value is extraordinary — every luxury lodge in Africa recognises the name.', cons: 'Remote lifestyle is not for everyone. The 21-on-7-off rotation means missing significant family events.', anonymous: true, helpful_count: 26 },
    ],
  },

  {
    id: 'shamwari-group',
    name: 'Shamwari Private Game Reserve',
    industry: 'Luxury Safari Lodge',
    size: '201–500 employees',
    location: 'Eastern Cape, South Africa',
    description: "Shamwari Private Game Reserve in the Eastern Cape is one of South Africa's most celebrated Big Five game reserves, operating six lodges across 25 000 hectares of malaria-free wilderness. Home to the Born Free Big Cat Sanctuary, Shamwari offers a unique wildlife rehabilitation dimension alongside world-class safari hospitality.",
    overall_rating: 4.5,
    ratings: { work_life_balance: 3.9, culture: 4.7, management: 4.4, career_growth: 4.2, compensation: 4.0 },
    benefits: ['Full board and accommodation', 'Conservation training', 'Born Free education', 'Game drive access', 'Guest gratuities', 'Annual reserve bonus'],
    website: 'shamwari.com',
    logo_url: 'https://logo.clearbit.com/shamwari.com',
    reviews: [
      { id: 'sham-r1', role: 'Game Ranger', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Eastern Cape wildlife density is exceptional. The Born Free connection gives the work a conservation dimension that goes beyond hospitality. Malaria-free reserve is a significant lifestyle benefit. Guest profile is outstanding.', cons: 'Six lodges across a vast reserve means considerable driving between sections. Peak season (June–October) is relentlessly busy.', anonymous: true, helpful_count: 30, salary: 'R13 000/month + accommodation + meals + gratuities' },
      { id: 'sham-r2', role: 'F&B Manager', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Managing F&B across six lodges gives extraordinary operational breadth. Shamwari\'s guest profile is international and discerning. Conservation mission makes the work meaningful.', cons: 'Coordinating F&B across lodges of different sizes requires constant movement. Bush logistics are challenging.', anonymous: false, author_name: 'Carl K.', helpful_count: 21, salary: 'R22 000/month + accommodation + meals' },
    ],
  },

  {
    id: 'tswalu-kalahari',
    name: 'Tswalu Kalahari Reserve',
    industry: 'Ultra-Luxury Safari Lodge',
    size: '101–200 employees',
    location: 'Northern Cape, South Africa',
    description: "Tswalu Kalahari Reserve is South Africa's largest private game reserve — 110 000 hectares of red Kalahari dunes — owned by the Oppenheimer family. With a maximum of 40 guests across two lodges (Tarkuni and Motse), Tswalu offers the most exclusive private safari experience in Africa. Rare Kalahari species, extraordinary meerkats, aardvark tracking, and a dedicated research station make this unlike any other reserve.",
    overall_rating: 4.9,
    ratings: { work_life_balance: 3.8, culture: 5.0, management: 4.8, career_growth: 4.4, compensation: 4.7 },
    benefits: ['Full board and accommodation in reserve', 'Conservation and research exposure', 'World-class wine programme', 'Premium staff meals', 'Guest gratuities (extraordinary)', 'Oppenheimer family culture of excellence'],
    website: 'tswalu.com',
    logo_url: 'https://logo.clearbit.com/tswalu.com',
    reviews: [
      { id: 'tswal-r1', role: 'Lodge Manager', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'Tswalu is unlike any other workplace on earth. Managing for a maximum of 40 guests across Africa\'s largest private reserve means absolute focus on individual perfection. The Oppenheimer family\'s commitment to the land, wildlife, and team is extraordinary. Guest gratuities at this level are life-defining. The Northern Cape skies are unlike anything I\'ve ever seen.', cons: 'The remoteness is total — hours from the nearest city. The standard expected is absolute with no exceptions. Kalahari summer heat is extreme.', anonymous: true, helpful_count: 56, salary: 'R38 000/month + accommodation + meals + gratuities' },
      { id: 'tswal-r2', role: 'Executive Chef', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'Cooking for 40 ultra-high-net-worth guests with unlimited resources is the ultimate culinary challenge. Kitchen garden, local sourcing philosophy, and the wine programme make this the most inspiring kitchen in Africa. Guests include billionaires, heads of state, and global thought leaders.', cons: 'Supply deliveries to the Northern Cape require meticulous planning. Isolation is real and takes getting used to.', anonymous: false, author_name: 'Robert S.', helpful_count: 42, salary: 'R42 000/month + accommodation + meals' },
      { id: 'tswal-r3', role: 'Field Guide', employment_status: 'Former', rating: 5, date: '2025-08', pros: 'Tracking meerkats, aardvark, and Kalahari lions for guests from around the world is extraordinary. The research station gives your guiding a scientific depth unavailable elsewhere. This role changed my life.', cons: 'Kalahari is genuinely remote — the adjustment on your rotation break back to normal life takes days each time.', anonymous: true, helpful_count: 35 },
    ],
  },

  {
    id: 'bushmans-kloof',
    name: "Bushmans Kloof Wilderness Reserve",
    industry: 'Luxury Wilderness Lodge',
    size: '51–200 employees',
    location: 'Cederberg, Western Cape',
    description: "Bushmans Kloof Wilderness Reserve & Wellness Retreat is a Relais & Châteaux property in the Cederberg mountains of the Western Cape, featuring over 130 ancient San rock art sites, pristine fynbos wilderness, guided hikes, wellness experiences, and award-winning cuisine. Multiple World Travel Award wins and a global following make this one of the most celebrated small lodges in Africa.",
    overall_rating: 4.8,
    ratings: { work_life_balance: 4.0, culture: 4.9, management: 4.6, career_growth: 4.2, compensation: 4.1 },
    benefits: ['Full board and accommodation', 'Relais & Châteaux training standards', 'San rock art education', 'Wellness access', 'Guest gratuities', 'Cederberg wilderness immersion'],
    website: 'bushmanskloof.co.za',
    logo_url: 'https://logo.clearbit.com/bushmanskloof.co.za',
    reviews: [
      { id: 'bush-r1', role: 'Chef', employment_status: 'Current', rating: 5, date: '2025-11', pros: 'Cooking at a Relais & Châteaux property in the Cederberg surrounded by ancient rock art is profoundly meaningful. The produce programme from the farm garden is extraordinary. Guest profile is exceptional — adventurous, culturally curious, and deeply appreciative. Relais & Châteaux standards are the finest in the world.', cons: 'The Cederberg is 3+ hours from Cape Town. Rotation lifestyle means planning your city time carefully.', anonymous: true, helpful_count: 32, salary: 'R14 000/month + accommodation + meals + gratuities' },
      { id: 'bush-r2', role: 'Wellness Guide', employment_status: 'Current', rating: 5, date: '2025-09', pros: 'Leading guests through 130+ San rock art sites in the Cederberg is spiritually enriching work. The wilderness setting is pristine and the guest gratitude is profound.', cons: 'Remoteness from Cape Town can be isolating on longer rotations. Fynbos season is magnificent but allergy-inducing.', anonymous: false, author_name: 'Elsa T.', helpful_count: 23, salary: 'R11 000/month + accommodation + meals + gratuities' },
    ],
  },

  // ─── LUXURY RAIL & CRUISE ─────────────────────────────────────────────────────

  {
    id: 'rovos-rail',
    name: 'Rovos Rail',
    industry: 'Luxury Train',
    size: '101–200 employees',
    location: 'Pretoria (HQ) · Routes across Southern & East Africa',
    description: "Rovos Rail operates the most luxurious train in the world — restored vintage carriages dating from the early 1900s, pulled through some of Africa's most breathtaking landscapes. Journeys run from Cape Town to Dar es Salaam, Pretoria to Victoria Falls, and across the continent. With only 72 passengers per journey in absolute vintage luxury, hospitality roles at Rovos require the finest service sensibility in the rail industry.",
    overall_rating: 4.8,
    ratings: { work_life_balance: 3.6, culture: 4.9, management: 4.7, career_growth: 4.0, compensation: 4.2 },
    benefits: ['Travel across Southern and East Africa', 'Full board while on train', 'Unique hospitality experience', 'Vintage train culture immersion', 'Guest gratuities', 'Pretoria accommodation facility'],
    website: 'rovos.com',
    logo_url: 'https://logo.clearbit.com/rovos.com',
    reviews: [
      { id: 'rov-r1', role: 'Train Host', employment_status: 'Current', rating: 5, date: '2025-12', pros: 'I\'ve crossed the Zambian bush, the Tanzanian highlands, and the Karoo desert while working. Rovos Rail attracts the most extraordinary guests — passionate travellers from across the world who have saved years for this journey. Serving in a 1920s dining car at sunset in Africa is something no hotel or restaurant can match. Guest gratuities are exceptional.', cons: 'Long journeys (some 10–14 days) means extended time away from home. Living in a small cabin space for the duration is an acquired taste. Wifi is minimal or non-existent on many routes.', anonymous: true, helpful_count: 48, salary: 'R13 000/month + gratuities' },
      { id: 'rov-r2', role: 'Train Chef', employment_status: 'Current', rating: 5, date: '2025-10', pros: 'Producing five-star cuisine in a moving Victorian kitchen is the ultimate test of a chef\'s adaptability and skill. The guests\' appreciation after a 4-course dinner through the African bushveld is unlike anything in conventional hospitality.', cons: 'Kitchen space is extremely limited. Managing ingredients for a 14-day journey requires extraordinary logistics planning.', anonymous: false, author_name: 'Alistair B.', helpful_count: 34, salary: 'R16 000/month + gratuities' },
    ],
  },

  {
    id: 'blue-train',
    name: 'The Blue Train',
    industry: 'Luxury Train',
    size: '51–200 employees',
    location: 'Pretoria (HQ) · Cape Town route',
    description: "The Blue Train is one of the world's most iconic luxury trains, running between Pretoria and Cape Town through the Karoo and Hex River Mountains. A national heritage institution operated by Transnet, The Blue Train offers all-suite travel with butler service, fine dining, and the romance of the golden age of rail travel. Working on The Blue Train is a career-defining experience in South African hospitality history.",
    overall_rating: 4.4,
    ratings: { work_life_balance: 3.7, culture: 4.6, management: 4.1, career_growth: 3.8, compensation: 3.9 },
    benefits: ['Travel between Pretoria and Cape Town', 'Full board while on train', 'Heritage institution recognition', 'Government employee benefits (Transnet)', 'Guest gratuities'],
    website: 'bluetrain.co.za',
    logo_url: 'https://logo.clearbit.com/bluetrain.co.za',
    reviews: [
      { id: 'blue-r1', role: 'Train Attendant', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Travelling through the South African interior between Pretoria and Cape Town as part of your job is genuinely extraordinary. The Blue Train is a national icon and guests arrive full of excitement and nostalgia. Transnet benefits are properly administered.', cons: 'Government Transnet ownership means bureaucratic processes. The journey is 27 hours which is long to be away from home. Overnight service means no normal sleeping rhythm.', anonymous: true, helpful_count: 24, salary: 'R8 500/month + gratuities' },
      { id: 'blue-r2', role: 'Head Chef', employment_status: 'Current', rating: 4, date: '2025-09', pros: 'Cooking fine dining for 72 guests in a moving train dining car is extraordinary. The South African landscapes passing the kitchen window are unforgettable. Guest reaction to fine food at 120km/h through the Karoo is priceless.', cons: 'Kitchen space is very confined. Restocking at journey end and beginning requires intense logistics. Transnet bureaucracy slows ingredient procurement.', anonymous: false, author_name: 'Werner N.', helpful_count: 18, salary: 'R19 000/month' },
    ],
  },

  // ─── CASINO & ENTERTAINMENT ───────────────────────────────────────────────────

  {
    id: 'montecasino',
    name: 'Montecasino',
    industry: 'Casino & Entertainment',
    size: '1 000+ employees',
    location: 'Fourways, Johannesburg',
    description: "Montecasino is Johannesburg's most celebrated entertainment destination, a Tuscan village-inspired complex in Fourways housing a casino, 20+ restaurants and bars, two theatres (Teatro and Teatro on the Square), a hotel, cinema complex, and the famous Bird Gardens. Part of Tsogo Sun Gaming, Montecasino attracts millions of visitors annually and is one of the most dynamic hospitality employment environments in Johannesburg.",
    overall_rating: 3.7,
    ratings: { work_life_balance: 3.3, culture: 3.7, management: 3.5, career_growth: 3.8, compensation: 3.8 },
    benefits: ['Medical aid', 'Provident fund', 'Shift premium pay', 'Entertainment access', 'Staff canteen', 'Annual incentive'],
    website: 'montecasino.co.za',
    logo_url: 'https://logo.clearbit.com/montecasino.co.za',
    reviews: [
      { id: 'monte-r1', role: 'Restaurant Supervisor', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Montecasino is unlike any other work environment in Johannesburg. The scale and energy are extraordinary. Multiple dining concepts under one roof means variety. Night shift premiums add meaningfully to income. The theatrical and entertainment events bring special occasion spending.', cons: 'The casino environment operates 24/7 — there is no such thing as "quiet" at Montecasino. Night shift rotation takes adjustment. The Fourways traffic can add an hour to your commute.', anonymous: true, helpful_count: 21, salary: 'R13 500/month' },
      { id: 'monte-r2', role: 'Casino Dealer', employment_status: 'Current', rating: 3, date: '2025-09', pros: 'Dealer gratuities on a good night can be substantial. Constant guest interaction builds communication skills. Job security in a large establishment is good.', cons: 'Standing for an entire shift dealing cards is physically demanding. Smoke in the casino floor is unavoidable. Night shifts are difficult for family life.', anonymous: false, author_name: 'Neo M.', helpful_count: 15, salary: 'R9 500/month + gratuities' },
      { id: 'monte-r3', role: 'Events Coordinator', employment_status: 'Former', rating: 4, date: '2025-06', pros: 'The scale of events at Montecasino is extraordinary — managing Theatre of Magic and major concerts is career-building. Exposure to large-scale event production is invaluable.', cons: 'Events calendar means no consistent schedule. High-pressure event days leave little room for error.', anonymous: true, helpful_count: 12 },
    ],
  },

  {
    id: 'grandwest',
    name: 'GrandWest Casino & Entertainment World',
    industry: 'Casino & Entertainment',
    size: '1 000+ employees',
    location: 'Goodwood, Cape Town',
    description: "GrandWest is Cape Town's largest entertainment complex, part of Tsogo Sun Gaming. Featuring 2 800 slot machines, 79 gaming tables, an ice skating rink, bowling alley, multiple restaurants, a hotel, and a movie complex — GrandWest is a major employer in the Cape Town hospitality and entertainment sector.",
    overall_rating: 3.6,
    ratings: { work_life_balance: 3.3, culture: 3.6, management: 3.4, career_growth: 3.8, compensation: 3.7 },
    benefits: ['Medical aid', 'Provident fund', 'Night shift premiums', 'Staff canteen', 'Entertainment benefits', 'Annual incentive'],
    website: 'grandwest.co.za',
    logo_url: 'https://logo.clearbit.com/grandwest.co.za',
    reviews: [
      { id: 'gw-r1', role: 'Waiter (GrandCafé)', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'Good tips from the casino crowd, especially when guests are winning. Job security in a large group. Night shift supplement makes a real difference.', cons: 'Smoke in the casino environment drifts. Night shift rotation disrupts normal life. 24-hour operation means there\'s always a shift to cover.', anonymous: true, helpful_count: 14, salary: 'R7 000/month + tips' },
      { id: 'gw-r2', role: 'Kitchen Chef', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'Large-scale production teaches efficiency. Tsogo Sun benefits are properly administered. Good for high-volume cooking experience.', cons: '24/7 kitchen operation means irregular hours. Limited creativity in a high-volume entertainment setting.', anonymous: true, helpful_count: 8, salary: 'R10 500/month' },
    ],
  },

  {
    id: 'gold-reef-city',
    name: 'Gold Reef City Theme Park & Casino',
    industry: 'Casino & Entertainment',
    size: '501–1 000 employees',
    location: 'Johannesburg South',
    description: "Gold Reef City is a Johannesburg heritage theme park and casino built on historic Crown Mines gold mine shafts, with a Victorian gold rush theme. The complex includes a casino, multiple restaurants, a hotel, and amusement rides. It is a family and tourist destination managed under the Tsogo Sun Gaming portfolio.",
    overall_rating: 3.4,
    ratings: { work_life_balance: 3.3, culture: 3.5, management: 3.3, career_growth: 3.4, compensation: 3.4 },
    benefits: ['Medical aid', 'Provident fund', 'Theme park access for staff', 'Staff canteen', 'Shift premiums'],
    website: 'goldreefcity.co.za',
    logo_url: 'https://logo.clearbit.com/goldreefcity.co.za',
    reviews: [
      { id: 'grc-r1', role: 'Restaurant Staff', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'Family and tourist atmosphere means customers are generally in a positive mood. Theme park access is a fun perk. Tsogo group benefits are stable.', cons: 'School holiday and weekend volumes are very high. Old infrastructure at some F&B outlets needs upgrading. Public transport to Joburg South can be challenging.', anonymous: true, helpful_count: 10, salary: 'R6 500/month + tips' },
      { id: 'grc-r2', role: 'Events Manager', employment_status: 'Former', rating: 3, date: '2025-06', pros: 'Unique historic venue creates memorable events. The casino backdrop is interesting for corporate events. Good events experience in a large group.', cons: 'Infrastructure is aging. Event planning within the heritage framework limits modern set designs.', anonymous: true, helpful_count: 6, salary: 'R19 000/month' },
    ],
  },

  {
    id: 'sun-coast-casino',
    name: 'Sun Coast Casino',
    industry: 'Casino & Entertainment',
    size: '501–1 000 employees',
    location: 'Durban, KwaZulu-Natal',
    description: "Sun Coast Casino is Durban's premier entertainment destination, situated directly on the beachfront in Durban North. With a casino, hotel, multiple restaurants, a beach club, and a wave pool, Sun Coast offers Durban's most complete entertainment and hospitality experience. Part of Sun International.",
    overall_rating: 3.7,
    ratings: { work_life_balance: 3.5, culture: 3.8, management: 3.6, career_growth: 3.8, compensation: 3.7 },
    benefits: ['Medical aid', 'Provident fund', 'Beachfront location', 'Staff canteen', 'Sun International benefits', 'Shift premiums'],
    website: 'suncost.co.za',
    logo_url: 'https://logo.clearbit.com/suninternational.com',
    reviews: [
      { id: 'sc-r1', role: 'Restaurant Supervisor', employment_status: 'Current', rating: 4, date: '2025-11', pros: 'Working on the Durban beachfront is genuinely enjoyable — the setting is beautiful. KZN hospitality market is warm and tips are good. Sun International benefits are properly managed.', cons: 'Durban humidity in summer can make the beachfront work uncomfortable. 24-hour casino operation means no consistent quiet periods.', anonymous: true, helpful_count: 16, salary: 'R14 000/month' },
      { id: 'sc-r2', role: 'Waiter (Beach Club)', employment_status: 'Current', rating: 4, date: '2025-08', pros: 'Beach club service on the Durban beachfront is the most enjoyable F&B setting in KZN. Summer tourists tip generously. The wave pool draws a high-spending crowd.', cons: 'Summer crowds are extremely intense. Sun and heat are challenging for outdoor service in December–January.', anonymous: false, author_name: 'Sipho Z.', helpful_count: 11, salary: 'R7 500/month + tips' },
    ],
  },

  // ─── CONTRACT CATERING (ADDITIONAL) ──────────────────────────────────────────

  {
    id: 'bidvest-catering',
    name: 'Bidvest Catering Services',
    industry: 'Contract Catering',
    size: '1 000+ employees',
    location: 'Johannesburg (HQ) · Nationwide',
    description: "Bidvest Catering Services is part of the Bidvest Group, one of South Africa's largest and most diversified JSE-listed companies. Providing catering services to mining operations, healthcare facilities, schools, and corporate clients across SA, Bidvest Catering brings the stability and resources of a major listed company to contract food service employment.",
    overall_rating: 3.5,
    ratings: { work_life_balance: 3.7, culture: 3.5, management: 3.4, career_growth: 3.6, compensation: 3.5 },
    benefits: ['Medical aid', 'Provident fund', 'Bidvest Group benefits', 'Structured training', 'JSE-listed employer stability', 'Long-service awards'],
    website: 'bidvest.co.za',
    logo_url: 'https://logo.clearbit.com/bidvest.co.za',
    reviews: [
      { id: 'bidv-r1', role: 'Site Chef', employment_status: 'Current', rating: 3, date: '2025-10', pros: 'Bidvest stability means you know you\'ll be paid on time and benefits are properly administered. Large group means real promotion pathways. Mining site contracts pay above average for chefs.', cons: 'Mining site catering can mean living on site for weeks at a time in remote areas. Volume cooking limits creativity. Institutional environment is not for everyone.', anonymous: true, helpful_count: 13, salary: 'R13 500/month' },
      { id: 'bidv-r2', role: 'Catering Manager', employment_status: 'Former', rating: 3, date: '2025-07', pros: 'Bidvest Group name on CV opens doors. Strong operational systems. Real advancement to area manager level for performers.', cons: 'Contract catering can feel like a step removed from real hospitality. Client politics add a layer of complexity beyond the cooking.', anonymous: true, helpful_count: 8, salary: 'R20 000/month' },
    ],
  },

  {
    id: 'salt-restaurant-group',
    name: 'Salt Restaurant Group',
    industry: 'Restaurant Group',
    size: '51–200 employees',
    location: 'Cape Town, Sea Point',
    description: "Salt Restaurant Group operates a portfolio of casual dining and upmarket restaurants across Cape Town's Atlantic Seaboard, with flagship locations in Sea Point and Clifton. Known for its Mediterranean-inspired menus and sea-facing locations, the group has grown significantly and offers career progression for motivated staff.",
    overall_rating: 4.0,
    ratings: { work_life_balance: 3.6, culture: 4.2, management: 4.0, career_growth: 4.1, compensation: 3.8 },
    benefits: ['Dining discounts across all group restaurants', 'Internal promotion pathway', 'Staff meals', 'Annual incentive bonus for managers', 'Monthly team events'],
    reviews: [
      { id: 'salt-r1', role: 'Restaurant Manager', employment_status: 'Current', rating: 4, date: '2025-12', pros: 'One of the best-run restaurant groups in the Cape. Proper KPIs, structured performance reviews, real support from the group operations team.', cons: 'December in Sea Point is unrelenting. The salary for managers is competitive but should be higher given the responsibility.', anonymous: false, author_name: 'Ryan O.', helpful_count: 24, salary: 'R24 000/month' },
      { id: 'salt-r2', role: 'Senior Waiter', employment_status: 'Current', rating: 4, date: '2025-10', pros: 'Best tips I\'ve earned in my waitering career. Sea Point clientele are generous. Management doesn\'t micromanage the floor.', cons: 'Parking and transport to Sea Point from the southern suburbs is an issue without a car.', anonymous: true, helpful_count: 18, salary: 'R8 000/month + tips (R3 000–R6 000/month in season)' },
    ],
  },
]
