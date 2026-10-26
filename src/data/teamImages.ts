export const teamImages: Record<string, string> = {
  anyones_legend: '/assets/Anyones_Legend.webp',
  bilibili_gaming: '/assets/Bilibili_Gaming.webp',
  cblol_seed_2: '/assets/LOS.webp',
  los_grandes: '/assets/LOS.webp',
  los: '/assets/LOS.webp',
  ctbc_flying_oyster: '/assets/CTBC_Flying_Oysterlogo.webp',
  dplus_kia: '/assets/Dplus_Kia.webp',
  g2_esport: '/assets/G2_Esport.webp',
  geng: '/assets/Gen.G.webp',
  hanwha_life: '/assets/Hanwha_Life_Esports.webp',
  invictus_gaming: '/assets/Invictus_Gaming.webp',
  team_liquid: '/assets/Team_Liquid.webp',
  Team_Liquid: '/assets/Team_Liquid.webp',
  lyon: '/assets/LYON.webp',
  Lyon: '/assets/LYON.webp',
  movistar_koi: '/assets/Movistar_KOI.webp',
  playin_seed_4: '/assets/Play_in_seed_4.webp',
  t1: '/assets/T1.webp',
  team_secret_whales: '/assets/Team_Secret_Whales.webp',
  top_esports: '/assets/Top_Esports.webp',

  // Play-in Candidates
  karmine_corp: '/assets/Karmine_Corp.webp',
  Karmine_Corp: '/assets/Karmine_Corp.webp',
  mvk_esport: '/assets/MVK_Esports.webp',
  MVK_Esport: '/assets/MVK_Esports.webp',
  mvk_esports: '/assets/MVK_Esports.webp',
  MVK_Esports: '/assets/MVK_Esports.webp',
  cloud9: '/assets/Cloud9.webp',
  Cloud9: '/assets/Cloud9.webp',
  FURIA: '/assets/FURIA.webp',
  Furia: '/assets/FURIA.webp',
  furia: '/assets/FURIA.webp',

  // Branding
  worlds: '/assets/Worlds.webp',
  Worlds: '/assets/Worlds.webp',
};

export const getTeamImage = (imageKey: string): string => {
  if (typeof imageKey !== 'string') return '/assets/Gen.G.webp';
  const cleanKey = imageKey.trim();

  if (Object.prototype.hasOwnProperty.call(teamImages, cleanKey)) {
    const val = teamImages[cleanKey];
    if (typeof val === 'string') return val;
  }

  const lowerKey = cleanKey.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(teamImages, lowerKey)) {
    const val = teamImages[lowerKey];
    if (typeof val === 'string') return val;
  }

  return '/assets/Gen.G.webp';
};
