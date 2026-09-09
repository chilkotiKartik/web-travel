// Curated, verified Unsplash source photos, grouped by subject so each
// section of the site can pull relevant, non-repeating imagery.
// Helper builds a sized/optimized URL on demand (auto=format, responsive width).

const build = (id) => (w = 1200, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`

const mountains = [
  '1506905925346-21bda4d32df4',
  '1469474968028-56623f02e42e',
  '1506197603052-3cc9c3a201bd',
  '1544735716-392fe2489ffa',
  '1476514525535-07fb3b4ae5f1',
  '1441974231531-c6227db76b6e',
  '1500534623283-312aade485b7',
  '1464822759023-fed622ff2c3b',
  '1548013146-72479768bada',
  '1546587348-d12660c30c50',
  '1585409677983-0f6c41ca9c3b',
  '1524492412937-b28074a5d7da',
  '1512100356356-de1b84283e18',
  '1449034446853-66c86144b0ad',
  '1533105079780-92b9be482077',
  '1520250497591-112f2f40a3f4',
  '1520962880247-cfaf541c8724',
  '1516426122078-c23e76319801',
].map(build)

const water = [
  '1626621341517-bbf3d9990a23',
  '1516483638261-f4dbaf036963',
  '1454496522488-7a8e488e8606',
  '1483728642387-6c3bdd6c93e5',
  '1506744038136-46273834b3fb',
  '1590523277543-a94d2e4eb00b',
  '1454789548928-9efd52dc4031',
  '1523906834658-6e24ef2386f9',
  '1465101162946-4377e57745c3',
].map(build)

const desertCulture = [
  '1519681393784-d120267933ba',
  '1571401835393-8c5f35328320',
  '1533130061792-64b345e4a833',
  '1533587851505-d119e13fa0d7',
  '1470770903676-69b98201ea1c',
  '1493246507139-91e8fad9978e',
  '1571407970349-bc81e7e96d47',
  '1573497019940-1c28c88b4f3e',
  '1520333789090-1afc82db536a',
  '1524850011238-e3d235c7d4c9',
  '1527631746610-bca00a040d60',
  '1583417319070-4a69db38a482',
  '1523592121529-f6dde35f079e',
  '1445019980597-93fa8acb246c',
  '1466442929976-97f336a657be',
  '1470252649378-9c29740c9fa8',
].map(build)

const portraits = [
  '1507003211169-0a1dd7228f2d',
  '1494790108377-be9c29b29330',
  '1500648767791-00dcc994a43e',
  '1438761681033-6461ffad8d80',
  '1544005313-94ddf0286df2',
  '1521572163474-6864f9cf17ab',
  '1552058544-f2b08422138a',
  '1531123897727-8f129e1688ce',
  '1512918728675-ed5a9ecdebfd',
  '1494526585095-c41746248156',
  '1544717302-de2939b7ef71',
].map(build)

const pool = [...mountains, ...water, ...desertCulture]

/** Deterministic pick so the same key always returns the same image (SSR-safe, no layout shift). */
function pick(list, seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return list[hash % list.length]
}

export const images = {
  mountains,
  water,
  desertCulture,
  portraits,
  pool,
  pick,
  hero: (seed, w, q) => pick(pool, seed)(w, q),
  portrait: (seed, w, q) => pick(portraits, seed)(w, q),
}
