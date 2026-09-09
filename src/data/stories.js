import { images } from '../lib/images'

export const storyCategories = ['Trip Reports', 'Guides', 'Gear', 'Culture']

export const stories = [
  {
    id: 's1',
    slug: 'first-time-above-14000-feet',
    title: 'What Nobody Tells You About Your First 14,000ft Pass',
    category: 'Guides',
    author: 'Ananya Rao',
    authorRole: 'Trek Leader, 60+ expeditions',
    authorImage: images.portrait('ananya', 200, 80),
    date: '2026-03-02',
    readTime: '7 min read',
    heroImage: images.hero('story-altitude', 1400, 85),
    excerpt:
      'Altitude sickness has nothing to do with fitness, and everything to do with pace. Here is what actually happens to your body above 12,000ft, and how our trek leaders manage it.',
    content: [
      "The first thing that surprises most trekkers is that altitude sickness has almost nothing to do with fitness. We have had marathon runners turn back at 11,000ft and first-time trekkers summit at 15,000ft without a headache. The difference is almost always pace, hydration, and how honestly someone reports their own symptoms.",
      "Above roughly 8,000ft, the air holds meaningfully less oxygen, and your body needs time to adjust — producing more red blood cells, breathing faster, and shifting how efficiently your heart moves oxygen around. That adjustment, acclimatisation, cannot be rushed. It is why every one of our high-altitude itineraries builds in dedicated acclimatisation days, even when the terrain feels 'too easy' to justify a rest.",
      "The golden rule we drill into every trekker on day one: climb high, sleep low. If your itinerary allows a side hike to a higher viewpoint before returning to a lower camp for the night, take it — your body benefits from the exposure without paying for it in sleep quality.",
      "Watch for the early signs: a mild headache, a bit of nausea, unusual fatigue. These are normal and manageable with rest, fluids, and time. The signs that actually matter are a headache that gets worse with rest, confusion, or loss of coordination — those mean descend, immediately, no exceptions. Every trek leader we send into the field carries a pulse oximeter and is trained to make that call without waiting for you to ask.",
      "The most useful thing you can do as a trekker is talk. Tell your trek leader exactly how you feel, even if it feels like you're complaining. We would always rather turn back one person for one day than have anyone push through a warning sign at 14,000ft.",
    ],
    tags: ['Altitude', 'Safety', 'Beginner Guide'],
  },
  {
    id: 's2',
    slug: 'packing-list-himalayan-trek',
    title: 'The Only Himalayan Packing List You Actually Need',
    category: 'Gear',
    author: 'Vikram Sethi',
    authorRole: 'Gear & Logistics Lead',
    authorImage: images.portrait('vikram', 200, 80),
    date: '2026-02-14',
    readTime: '6 min read',
    heroImage: images.hero('story-gear', 1400, 85),
    excerpt:
      'Ignore the 40-item spreadsheets. After a decade of trekking, our gear lead has it down to a short, layered system that works from 6,000ft to 18,000ft.',
    content: [
      "Every new trekker asks for a packing list and gets handed a 40-item spreadsheet that stresses them out more than the trek itself. Here is the version we actually give our team: a layering system, not a shopping list.",
      "Base layer: one moisture-wicking thermal top and bottom. This sits against your skin and its only job is moving sweat away from you, so avoid cotton entirely — it holds moisture and will make you colder, not warmer.",
      "Mid layer: a fleece or light insulated jacket for regular walking warmth, plus a heavier down jacket that lives in your bag until camp, breaks, or summit mornings. Down compresses small and is the single best warmth-to-weight item you'll carry.",
      "Outer layer: a genuinely waterproof (not just water-resistant) jacket and a pair of waterproof trekking pants. Himalayan weather changes fast, and this layer is non-negotiable above 10,000ft regardless of forecast.",
      "Footwear is where people overspend or underspend. You need ankle-support trekking shoes that are already broken in — never wear a brand-new pair on trek day one. Pair with two sets of trekking socks and, for snow treks, gaiters to keep powder out of your boots.",
      "Everything else — headlamp, reusable bottle, basic first aid, sunscreen, sunglasses rated for UV and glare — fits in a small pouch. If your bag feels heavy, it's almost always because of 'just in case' items that never get used. Trust the system, not the spreadsheet.",
    ],
    tags: ['Gear', 'Packing', 'Beginner Guide'],
  },
  {
    id: 's3',
    slug: 'chadar-trek-diary',
    title: 'Eight Days on a Frozen River: A Chadar Trek Diary',
    category: 'Trip Reports',
    author: 'Meera Iyer',
    authorRole: 'Community Contributor',
    authorImage: images.portrait('meera', 200, 80),
    date: '2026-01-28',
    readTime: '9 min read',
    heroImage: images.hero('story-chadar', 1400, 85),
    excerpt:
      "The ice cracked under my second step and I nearly turned around right there. By day four, I was sleeping in a cave and couldn't imagine being anywhere else.",
    content: [
      "The ice cracked under my second step on the Chadar and I nearly turned around right there. Our guide, Tashi, just kept walking. 'It always sounds worse than it is,' he said, without looking back. I decided to trust a man who had crossed this river more times than I'd crossed a busy road.",
      "Day one is mostly disbelief. You are, quite literally, walking on a river. Underneath the ice — sometimes visibly, through cracks — the Zanskar is still moving, fast and black. The trail isn't marked; it's wherever the ice is thick enough that week, which changes daily, which is why nobody attempts this without a guide who has walked it in the last 48 hours.",
      "By day three, the disbelief turns into rhythm. Wake in the cave before sunrise, tea, walk while the ice is hardest (mornings), rest when the sun softens it midday, make camp by early afternoon. The caves themselves are extraordinary — carved by centuries of Zanskari traders who used this exact route before roads existed.",
      "Naerak, our turnaround point, has a frozen waterfall that looks less like ice and more like something poured mid-motion and stopped. We sat under it for twenty minutes just staring, nobody talking.",
      "The walk out felt different — not easier, but familiar. I'd learned to read the ice a little: the milky patches to avoid, the clear blue-black ice that's thickest and safest, the sound that means 'keep moving' versus the sound that means 'stop.' I still don't fully trust myself to make that call alone, and I don't think I'm supposed to. That's what Tashi is for.",
    ],
    tags: ['Ladakh', 'Winter', 'Trip Report'],
  },
  {
    id: 's4',
    slug: 'best-time-to-trek-himalayas',
    title: 'When to Trek Where: A Season-by-Season Himalayan Guide',
    category: 'Guides',
    author: 'Ananya Rao',
    authorRole: 'Trek Leader, 60+ expeditions',
    authorImage: images.portrait('ananya', 200, 80),
    date: '2026-01-09',
    readTime: '8 min read',
    heroImage: images.hero('story-seasons', 1400, 85),
    excerpt:
      "There is no single 'best' trekking season — there is a best season for each region. Here is how we plan our own calendar, region by region.",
    content: [
      "'When's the best time to trek?' is the most common question we get, and the honest answer is: it depends entirely on where. The Himalayas span multiple climate zones, and treating them as one season is the most common planning mistake we see.",
      "Spring (March–June) is prime time for lower and mid-altitude treks in Himachal and Uttarakhand — rhododendrons bloom, snow is retreating from the trails, and river crossings are manageable before peak snowmelt. It's also the window for Sikkim's Goecha La, timed around rhododendron season.",
      "Monsoon (July–September) shuts down most of the central Himalayas but opens the trans-Himalayan cold deserts — Ladakh and Spiti sit in the rain shadow and see their clearest, driest weather exactly when the rest of the range is under cloud. It's also, counterintuitively, when the Valley of Flowers is in full bloom, since the flowers depend on monsoon moisture.",
      "Autumn (September–December) is the most reliable window overall: clear skies, stable weather, and the best long-range mountain views of the year. Kashmir's Great Lakes trek and most Uttarakhand treks peak in this window before winter closes the higher passes.",
      "Winter (December–February) belongs to snow specialists: Kedarkantha for a beginner-friendly snow summit, and Chadar for the extreme end of the spectrum. Both require completely different gear and risk management than a summer trek, which is why we run them as distinct trip categories rather than off-season versions of the same trail.",
    ],
    tags: ['Planning', 'Seasons', 'Beginner Guide'],
  },
  {
    id: 's5',
    slug: 'living-root-bridges-meghalaya',
    title: "The Living Bridges of Meghalaya Are Still Being Grown",
    category: 'Culture',
    author: 'Rahul Basumatary',
    authorRole: 'Northeast India Specialist',
    authorImage: images.portrait('rahul', 200, 80),
    date: '2025-12-20',
    readTime: '6 min read',
    heroImage: images.hero('story-roots', 1400, 85),
    excerpt:
      'Khasi communities have been training rubber fig tree roots into living bridges for over 500 years. Some bridges being walked today were started before India existed as a modern state.',
    content: [
      "The double-decker root bridge at Nongriat takes roughly 15-20 years to become fully load-bearing, and some of the bridges Khasi communities still use today were started more than five centuries ago. This isn't restoration or preservation — it's an unbroken, living practice.",
      "The method itself is deceptively simple: young, flexible roots of the Ficus elastica tree are guided across a stream using betel nut trunks as temporary scaffolding, and trained, over decades, to interweave into a structure strong enough to hold dozens of people at once. As the tree grows, so does the bridge — literally getting stronger every year rather than weakening like built infrastructure does.",
      "What struck me most on my last visit wasn't the double-decker bridge itself, spectacular as it is, but a single-span bridge a few villages over that locals mentioned almost in passing — still 'young,' at just under 200 years old, and not yet considered fully mature.",
      "These bridges only exist because of an unusual continuity: the same clans have maintained the same crossings for generations, treating the practice as inherited responsibility rather than tourist infrastructure. Walking across one is walking across a piece of living, growing history that will outlast the bridge you'll find there on your next visit.",
    ],
    tags: ['Meghalaya', 'Culture', 'Offbeat'],
  },
  {
    id: 's6',
    slug: 'solo-female-trekker-guide',
    title: 'A Solo Female Trekker\'s Honest Guide to Group Treks in India',
    category: 'Guides',
    author: 'Meera Iyer',
    authorRole: 'Community Contributor',
    authorImage: images.portrait('meera', 200, 80),
    date: '2025-12-02',
    readTime: '7 min read',
    heroImage: images.hero('story-solo', 1400, 85),
    excerpt:
      "I've done eleven group treks solo. Here's what actually matters when you're choosing who to trek with, beyond the obvious safety checklist.",
    content: [
      "I booked my first trek solo because none of my friends could take the leave, and I almost cancelled twice out of nerves before day one. Eleven treks later, solo is now my default — but it took learning what actually matters when evaluating a trek operator, beyond the generic 'is it safe' checklist.",
      "Group composition matters more than group size. Ask how many solo travellers, and specifically solo women, typically join a given trip. A trek that regularly runs with 40-60% solo women tells you something a safety policy document can't.",
      "Ask about the trek leader directly, not just their certification. Certifications tell you they're trained; asking 'how long have they been leading this specific route' and 'what's their protocol if someone needs to turn back' tells you how they'll actually handle a bad moment on day four.",
      "Tent sharing policy should be explicit before you book, not something you discover at check-in. Good operators let you choose or default to same-gender sharing without you having to ask awkwardly in front of the group.",
      "The best sign, honestly, isn't anything an operator tells you — it's what past solo trekkers say unprompted in reviews. Look for specifics: 'our trek leader checked in with me every rest stop after I mentioned feeling off' tells you more than any star rating.",
    ],
    tags: ['Solo Travel', 'Safety', 'Community'],
  },
]

export function getStoryBySlug(slug) {
  return stories.find((s) => s.slug === slug)
}
