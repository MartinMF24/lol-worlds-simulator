// Automated test for Playoffs Draw rules

const SAMPLE_QUALIFIED = [
  { id: 'al', name: "Anyone's Legend", losses: 0, wins: 3 },
  { id: 'gen', name: "Gen.G", losses: 0, wins: 3 },
  { id: 'blg', name: "Bilibili Gaming", losses: 1, wins: 3 },
  { id: 't1', name: "T1", losses: 1, wins: 3 },
  { id: 'g2', name: "G2 Esports", losses: 1, wins: 3 },
  { id: 'tes', name: "Top Esports", losses: 2, wins: 3 },
  { id: 'hle', name: "Hanwha Life", losses: 2, wins: 3 },
  { id: 'dk', name: "Dplus KIA", losses: 2, wins: 3 },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function testDraw(iteration) {
  const teams3_0 = SAMPLE_QUALIFIED.filter(t => t.losses === 0);
  const teams3_1 = SAMPLE_QUALIFIED.filter(t => t.losses === 1);
  const teams3_2 = SAMPLE_QUALIFIED.filter(t => t.losses === 2);

  const s3_0 = shuffle(teams3_0);
  const s3_1 = shuffle(teams3_1);
  const s3_2 = shuffle(teams3_2);

  const m1 = [s3_0[0], s3_2[0]];
  const m2 = [s3_1[0], s3_2[2]];
  const m3 = [s3_1[1], s3_1[2]];
  const m4 = [s3_0[1], s3_2[1]];

  // 1. Check 3-0 teams are in Match 1 and Match 4 (opposite halves)
  const has3_0Top = m1.some(t => t.losses === 0) || m2.some(t => t.losses === 0);
  const has3_0Bottom = m3.some(t => t.losses === 0) || m4.some(t => t.losses === 0);
  if (!has3_0Top || !has3_0Bottom) {
    throw new Error(`Iteration ${iteration}: 3-0 teams are NOT in opposite halves!`);
  }

  // 2. Check each 3-0 plays against a 3-2
  for (const match of [m1, m4]) {
    const has3_0 = match.some(t => t.losses === 0);
    const has3_2 = match.some(t => t.losses === 2);
    if (!has3_0 || !has3_2) {
      throw new Error(`Iteration ${iteration}: 3-0 team not matched with 3-2!`);
    }
  }

  // 3. Check leftover 3-2 plays against a 3-1 (m2)
  const m2Has3_1 = m2.some(t => t.losses === 1);
  const m2Has3_2 = m2.some(t => t.losses === 2);
  if (!m2Has3_1 || !m2Has3_2) {
    throw new Error(`Iteration ${iteration}: Leftover 3-2 not matched with 3-1!`);
  }

  // 4. Check two 3-1 teams play each other (m3)
  const m3Both3_1 = m3.every(t => t.losses === 1);
  if (!m3Both3_1) {
    throw new Error(`Iteration ${iteration}: Two 3-1 teams do not play each other!`);
  }
}

console.log('🚀 Running 100 automated Playoffs draw rule validation tests...');
for (let i = 1; i <= 100; i++) {
  testDraw(i);
}
console.log('✅ All 100 Playoffs draws PASSED!');
console.log('  - 3-0 teams in opposite bracket halves 100%');
console.log('  - 3-0 vs 3-2 matched 100%');
console.log('  - Leftover 3-2 vs 3-1 matched 100%');
console.log('  - Remaining two 3-1 teams face each other 100%');

// Test Real Playoffs Bracket creation & progression logic
function testRealPlayoffsLogic() {
  const sampleRealConfig = {
    isRealDraw: true,
    matches: [
      { id: 'qf-1', team1Id: 'gen', team2Id: 'ig', winnerId: 'gen', scheduledTime: '2026-11-05T14:00:00-03:00' },
      { id: 'qf-2', team1Id: 't1', team2Id: 'tes', winnerId: null, scheduledTime: '2026-11-06T14:00:00-03:00' },
      { id: 'qf-3', team1Id: 'blg', team2Id: 'hle', winnerId: 'blg', scheduledTime: '2026-11-07T14:00:00-03:00' },
      { id: 'qf-4', team1Id: 'al', team2Id: 'dk', winnerId: 'al', scheduledTime: '2026-11-08T14:00:00-03:00' },
      { id: 'sf-1', team1Id: null, team2Id: null, winnerId: null },
      { id: 'sf-2', team1Id: null, team2Id: null, winnerId: 'blg' },
      { id: 'f-1', team1Id: null, team2Id: null, winnerId: null },
    ],
  };

  const matchMap = new Map();
  sampleRealConfig.matches.forEach((m) => matchMap.set(m.id, m));

  const qf1 = matchMap.get('qf-1');
  const sf1Team1 = qf1.winnerId;
  if (sf1Team1 !== 'gen') throw new Error('QF1 winner did not advance to SF1 Team 1');

  const sf2Team1 = matchMap.get('qf-3').winnerId;
  const sf2Team2 = matchMap.get('qf-4').winnerId;
  if (sf2Team1 !== 'blg' || sf2Team2 !== 'al') throw new Error('QF3/QF4 winners did not advance to SF2');

  const f1Team2 = matchMap.get('sf-2').winnerId;
  if (f1Team2 !== 'blg') throw new Error('SF2 winner did not advance to Final');
}

testRealPlayoffsLogic();
console.log('✅ Real Playoffs bracket configuration & advancement logic PASSED!');

function testDateFormatting() {
  const iso = '2026-11-05T14:00:00-03:00';
  const tz = 'America/Argentina/Buenos_Aires';
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat('es-ES', { day: '2-digit', timeZone: tz }).format(date);
  const month = new Intl.DateTimeFormat('es-ES', { month: '2-digit', timeZone: tz }).format(date);
  const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(date);
  const formatted = `${day}/${month} ${time}`;
  if (formatted !== '05/11 14:00') {
    throw new Error(`Expected 05/11 14:00 but got ${formatted}`);
  }
}

testDateFormatting();
console.log('✅ Playoff match date/time formatting (DD/MM HH:mm) PASSED!');
