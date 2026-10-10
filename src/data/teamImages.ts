export const teamImages: Record<string, string> = {
  anyones_legend: '/assets/Anyones_Legend.jpg',
  bilibili_gaming: '/assets/Bilibili_Gaming.jpg',
  cblol_seed_2: '/assets/LOS.jpg',
  los_grandes: '/assets/LOS.jpg',
  los: '/assets/LOS.jpg',
  ctbc_flying_oyster: '/assets/CTBC_Flying_Oysterlogo.jpg',
  dplus_kia: '/assets/Dplus_Kia.jpg',
  g2_esport: '/assets/G2_Esport.jpg',
  geng: '/assets/Gen.G.jpg',
  hanwha_life: '/assets/Hanwha_Life_Esports.jpg',
  invictus_gaming: '/assets/Invictus_Gaming.jpg',
  team_liquid: '/assets/Team_Liquid.jpg',
  Team_Liquid: '/assets/Team_Liquid.jpg',
  lyon: '/assets/LYON.jpg',
  Lyon: '/assets/LYON.jpg',
  movistar_koi: '/assets/Movistar_KOI.jpg',
  playin_seed_4: '/assets/Play_in_seed_4.png',
  t1: '/assets/T1.jpg',
  team_secret_whales: '/assets/Team_Secret_Whales.jpg',
  top_esports: '/assets/Top_Esports.jpg',

  // Play-in Candidates
  karmine_corp: '/assets/Karmine_Corp.jpg',
  Karmine_Corp: '/assets/Karmine_Corp.jpg',
  mvk_esport: '/assets/MVK_Esports.jpg',
  MVK_Esport: '/assets/MVK_Esports.jpg',
  mvk_esports: '/assets/MVK_Esports.jpg',
  MVK_Esports: '/assets/MVK_Esports.jpg',
  cloud9: '/assets/Cloud9.jpg',
  Cloud9: '/assets/Cloud9.jpg',
  FURIA: '/assets/FURIA.jpg',
  Furia: '/assets/FURIA.jpg',
  furia: '/assets/FURIA.jpg',

  // Branding
  worlds: '/assets/Worlds.jpg',
  Worlds: '/assets/Worlds.jpg',
};

export const getTeamImage = (imageKey: string): string => {
  if (typeof imageKey !== 'string') return '/assets/Gen.G.jpg';
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

  return '/assets/Gen.G.jpg';
};
