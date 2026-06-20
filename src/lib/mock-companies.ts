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
