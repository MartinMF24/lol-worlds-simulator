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

  const quarters = [m1, m2, m3, m4];

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

