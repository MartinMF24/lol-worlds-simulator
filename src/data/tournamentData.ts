/**
 * REAL TOURNAMENT CONFIGURATION (Worlds 2026)
 *
 * En este archivo se configura la información real del torneo a medida que se desarrolla:
 * 1. playInWinnerId:
 *    - Si es string ('kc' | 'mvk' | 'c9' | 'cblol_pi'): La aplicación va DIRECTO a la Fase Suiza
 *      con ese equipo como clasificado del Play-in (slot 16).
 *    - Si es null: La aplicación mostrará la pantalla interactiva de selección de Play-in.
 *
 * 2. rounds (Rondas 1 a 5):
 *    - isRealDraw: true -> La ronda ya fue sorteada oficialmente en la vida real.
 *      Los partidos se cargan desde aquí y NO se permite volver a sortear con el botón de dados.
 *    - isRealDraw: false -> La ronda aún no se sorteó en la vida real; el simulador
 *      generará los cruces dinámicamente y permitirá re-sortearlos.
 *    - winnerId: Si se especifica el ID del equipo ganador en todos los partidos de una ronda,
 *      el simulador considerará esa ronda como YA JUGADA y avanzará automáticamente
 *      a la siguiente ronda.
 *
 * 3. playoffs (Cuadro de Eliminación Directa):
 *    - isRealDraw: true -> El sorteo oficial de Playoffs ya se realizó. La aplicación
 *      arranca DIRECTAMENTE en el cuadro de Playoffs y carga los cruces oficiales.
 *      No se permite re-sortear los emparejamientos con el botón de dados.
 *    - isRealDraw: false -> El sorteo oficial aún no se realizó; el simulador
 *      generará los cruces dinámicamente cuando concluya la Fase Suiza y permitirá re-sortearlos.
 *    - winnerId: Si se especifica el ID del equipo ganador en un partido de Playoffs,
 *      ese resultado se considera OFICIAL (check verde), queda bloqueado y avanza
 *      automáticamente a la siguiente fase (o corona al campeón).
 */

export interface RealMatchData {
  id: string;
  team1Id: string;
  team2Id: string;
  scheduledTime?: string; // Formato ISO 8601 (ej. '2026-10-20T14:00:00-03:00')
  winnerId?: string | null; // ID del equipo ganador ('gen', 't1', etc.) o null si aún no se jugó
}

export interface RealRoundData {
  roundNumber: number;
  isRealDraw: boolean;
  matches: RealMatchData[];
}

export interface RealPlayoffMatchData {
  id: string; // 'qf-1' | 'qf-2' | 'qf-3' | 'qf-4' | 'sf-1' | 'sf-2' | 'f-1'
  team1Id?: string | null;
  team2Id?: string | null;
  scheduledTime?: string; // Formato ISO 8601 (ej. '2026-11-05T14:00:00-03:00')
  winnerId?: string | null; // ID del equipo ganador o null si aún no se jugó
}

export interface RealPlayoffsData {
  isRealDraw: boolean;
  matches: RealPlayoffMatchData[];
}

export interface RealTournamentConfig {
  playInWinnerId: string | null;
  rounds: RealRoundData[];
  playoffs?: RealPlayoffsData;
}

export const REAL_TOURNAMENT_DATA: RealTournamentConfig = {
  // Ganador oficial del Play-in. Cambiar a null para habilitar la pantalla de selección manual.
  playInWinnerId: 'kc',

  rounds: [
    {
      roundNumber: 1,
      isRealDraw: true,
      matches: [
        {
          id: 'r1-m1',
          team1Id: 'gen',
          team2Id: 'ig',
          scheduledTime: '2026-10-23T14:00:00-03:00',
          winnerId: 'gen',
        },
        {
          id: 'r1-m2',
          team1Id: 'tl',
          team2Id: 'cfo',
          scheduledTime: '2026-10-23T19:00:00-03:00',
          winnerId: 'cfo',
        },
        {
          id: 'r1-m3',
          team1Id: 'al',
          team2Id: 'kc',
          scheduledTime: '2026-10-23T17:00:00-03:00',
          winnerId: 'kc',
        },
        {
          id: 'r1-m4',
          team1Id: 'g2',
          team2Id: 'dk',
          scheduledTime: '2026-10-23T18:00:00-03:00',
          winnerId: 'dk',
        },
        {
          id: 'r1-m5',
          team1Id: 'hle',
          team2Id: 'tes',
          scheduledTime: '2026-10-23T15:00:00-03:00',
          winnerId: 'hle',
        },
        {
          id: 'r1-m6',
          team1Id: 'los',
          team2Id: 't1',
          scheduledTime: '2026-10-23T20:00:00-03:00',
          winnerId: 't1',
        },
        {
          id: 'r1-m7',
          team1Id: 'tsw',
          team2Id: 'lyon',
          scheduledTime: '2026-10-23T21:00:00-03:00',
          winnerId: 'lyon',
        },
        {
          id: 'r1-m8',
          team1Id: 'blg',
          team2Id: 'mkoi',
          scheduledTime: '2026-10-23T16:00:00-03:00',
          winnerId: 'mkoi',
        },
      ],
    },
    {
      roundNumber: 2,
      isRealDraw: true,
      matches: [
        {
          id: 'r2-m1',
          team1Id: 't1',
          team2Id: 'dk',
          scheduledTime: '2026-10-24T20:00:00-03:00',
          winnerId: 'dk',
        },
        {
          id: 'r2-m2',
          team1Id: 'mkoi',
          team2Id: 'cfo',
          scheduledTime: '2026-10-24T15:00:00-03:00',
          winnerId: 'mkoi',
        },
        {
          id: 'r2-m3',
          team1Id: 'hle',
          team2Id: 'gen',
          scheduledTime: '2026-10-24T19:00:00-03:00',
          winnerId: 'gen',
        },
        {
          id: 'r2-m4',
          team1Id: 'lyon',
          team2Id: 'kc',
          scheduledTime: '2026-10-24T17:00:00-03:00',
          winnerId: 'lyon',
        },
        {
          id: 'r2-m5',
          team1Id: 'g2',
          team2Id: 'los',
          scheduledTime: '2026-10-24T16:00:00-03:00',
          winnerId: 'g2',
        },
        {
          id: 'r2-m6',
          team1Id: 'ig',
          team2Id: 'tsw',
          scheduledTime: '2026-10-24T18:00:00-03:00',
          winnerId: 'ig',
        },
        {
          id: 'r2-m7',
          team1Id: 'tes',
          team2Id: 'al',
          scheduledTime: '2026-10-24T14:00:00-03:00',
          winnerId: 'tes',
        },
        {
          id: 'r2-m8',
          team1Id: 'tl',
          team2Id: 'blg',
          scheduledTime: '2026-10-24T21:00:00-03:00',
          winnerId: 'blg',
        },
      ],
    },
    {
      roundNumber: 3,
      isRealDraw: true,
      matches: [
        {
          id: 'r3-m1',
          team1Id: 'tes',
          team2Id: 'g2',
          scheduledTime: '2026-10-25T15:00:00-03:00',
          winnerId: 'tes',
        },
        {
          id: 'r3-m2',
          team1Id: 'hle',
          team2Id: 'ig',
          scheduledTime: '2026-10-25T14:00:00-03:00',
          winnerId: 'ig',
        },
        {
          id: 'r3-m3',
          team1Id: 'mkoi',
          team2Id: 'dk',
          scheduledTime: '2026-10-25T16:00:00-03:00',
          winnerId: 'dk',
        },
        {
          id: 'r3-m4',
          team1Id: 'lyon',
          team2Id: 'gen',
          scheduledTime: '2026-10-25T19:00:00-03:00',
          winnerId: 'gen',
        },
        {
          id: 'r3-m5',
          team1Id: 'kc',
          team2Id: 'blg',
          scheduledTime: '2026-10-26T15:00:00-03:00',
          winnerId: 'blg',
        },
        {
          id: 'r3-m6',
          team1Id: 'cfo',
          team2Id: 't1',
          scheduledTime: '2026-10-26T14:00:00-03:00',
          winnerId: 't1',
        },
        {
          id: 'r3-m7',
          team1Id: 'tl',
          team2Id: 'al',
          scheduledTime: '2026-10-26T19:00:00-03:00',
          winnerId: 'tl',
        },
        {
          id: 'r3-m8',
          team1Id: 'los',
          team2Id: 'tsw',
          scheduledTime: '2026-10-26T16:00:00-03:00',
          winnerId: 'los',
        },
      ],
    },
    {
      roundNumber: 4,
      isRealDraw: true,
      matches: [        
        {
          id: 'r4-m1',
          team1Id: 'tes',
          team2Id: 'blg',
          scheduledTime: '2026-10-29T20:00:00-03:00',
          winnerId: 'tes',
        },
        {
          id: 'r4-m2',
          team1Id: 'lyon',
          team2Id: 'ig',
          scheduledTime: '2026-10-28T20:00:00-03:00',
          winnerId: 'ig',
        },
        {
          id: 'r4-m3',
          team1Id: 'mkoi',
          team2Id: 't1',
          scheduledTime: '2026-10-28T17:00:00-03:00',
          winnerId: 't1',
        },
        {
          id: 'r4-m4',
          team1Id: 'kc',
          team2Id: 'cfo',
          scheduledTime: '2026-10-29T17:00:00-03:00',
          winnerId: 'kc',
        },
        {
          id: 'r4-m5',
          team1Id: 'tl',
          team2Id: 'los',
          scheduledTime: '2026-10-30T17:00:00-03:00',
          winnerId: 'los',
        },
        {
          id: 'r4-m6',
          team1Id: 'hle',
          team2Id: 'g2',
          scheduledTime: '2026-10-30T20:00:00-03:00',
          winnerId: 'hle',
        },
      ],
    },
    {
      roundNumber: 5,
      isRealDraw: true,
      matches: [
        {
          id: 'r5-m1',
          team1Id: 'los',
          team2Id: 'lyon',
          scheduledTime: '2026-10-31T17:00:00-03:00',
          winnerId: null,
        },
        {
          id: 'r5-m4',
          team1Id: 'kc',
          team2Id: 'mkoi',
          scheduledTime: '2026-10-31T14:00:00-03:00',
          winnerId: null,
        },
        {
          id: 'r5-m3',
          team1Id: 'blg',
          team2Id: 'hle',
          scheduledTime: '2026-10-31T20:00:00-03:00',
          winnerId: null,
        },
      ],
    },
  ],

  playoffs: {
    // Cambiar a true cuando se realice el sorteo oficial de cuartos de final
    isRealDraw: false,
    matches: [
      {
        id: 'qf-1',
        team1Id: '',
        team2Id: '',
        scheduledTime: '2026-11-03T19:00:00-03:00',
        winnerId: null,
      },
      {
        id: 'qf-2',
        team1Id: '',
        team2Id: '',
        scheduledTime: '2026-11-04T19:00:00-03:00',
        winnerId: null,
      },
      {
        id: 'qf-3',
        team1Id: '',
        team2Id: '',
        scheduledTime: '2026-11-05T19:00:00-03:00',
        winnerId: null,
      },
      {
        id: 'qf-4',
        team1Id: '',
        team2Id: '',
        scheduledTime: '2026-11-06T19:00:00-03:00',
        winnerId: null,
      },
      {
        id: 'sf-1',
        team1Id: '',
        team2Id: '',
        scheduledTime: '2026-11-07T19:00:00-03:00',
        winnerId: null,
      },
      {
        id: 'sf-2',
        team1Id: '',
        team2Id: '',
        scheduledTime: '2026-11-08T19:00:00-03:00',
        winnerId: null,
      },
      {
        id: 'f-1',
        team1Id: '',
        team2Id: '',
        scheduledTime: '2026-11-14T16:00:00-03:00',
        winnerId: null,
      },
    ],
  },
};

