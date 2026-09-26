export const teamImages: Record<string, string> = {
  anyones_legend: '/assets/Anyones_Legend.jpg',
  bilibili_gaming: '/assets/Bilibili_Gaming.jpg',
  cblol_seed_2: '/assets/CBLOL_seed_2.jpg',
  ctbc_flying_oyster: '/assets/CTBC_Flying_Oysterlogo.jpg',
  dplus_kia: '/assets/Dplus_Kia.jpg',
  g2_esport: '/assets/G2_Esport.jpg',
  geng: '/assets/Gen.G.jpg',
  hanwha_life: '/assets/Hanwha_Life_Esports.jpg',
  invictus_gaming: '/assets/Invictus_Gaming.jpg',
  lcs_seed_1: '/assets/Lcs_seed_1.jpg',
  lcs_seed_3: '/assets/Lcs_seed_3.jpg',
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
  lcs_play_in: '/assets/Lcs_play_in.jpg',
  LCS_play_in: '/assets/Lcs_play_in.jpg',
  cblol_play_in: '/assets/CBLOL_play_in.jpg',
  CBLOL_play_in: '/assets/CBLOL_play_in.jpg',

  // Branding
  worlds: '/assets/Worlds.jpg?v=2',
  Worlds: '/assets/Worlds.jpg?v=2',
};

export const getTeamImage = (imageKey: string): string => {
  return (
    teamImages[imageKey] ||
    teamImages[imageKey.toLowerCase()] ||
    '/assets/Gen.G.jpg'
  );
};
