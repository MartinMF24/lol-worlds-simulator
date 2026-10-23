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

export interface RealTournamentConfig {
  playInWinnerId: string | null;
  rounds: RealRoundData[];
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
          scheduledTime: '2026-10-20T14:00:00-03:00',
          winnerId: 'gen',
        },
        {
          id: 'r1-m2',
          team1Id: 'tl',
          team2Id: 'cfo',
          scheduledTime: '2026-10-20T19:00:00-03:00',
          winnerId: null,
        },
        {
          id: 'r1-m3',
          team1Id: 'al',
          team2Id: 'kc',
          scheduledTime: '2026-10-20T17:00:00-03:00',
          winnerId: null,
        },
        {
          id: 'r1-m4',
          team1Id: 'g2',
          team2Id: 'dk',
          scheduledTime: '2026-10-20T18:00:00-03:00',
          winnerId: null,
        },
        {
          id: 'r1-m5',
          team1Id: 'hle',
          team2Id: 'tes',
          scheduledTime: '2026-10-20T15:00:00-03:00',
          winnerId: 'hle',
        },
        {
          id: 'r1-m6',
          team1Id: 'los',
          team2Id: 't1',
          scheduledTime: '2026-10-20T20:00:00-03:00',
          winnerId: null,
        },
        {
          id: 'r1-m7',
          team1Id: 'tsw',
          team2Id: 'lyon',
          scheduledTime: '2026-10-20T21:00:00-03:00',
          winnerId: null,
        },
        {
          id: 'r1-m8',
          team1Id: 'blg',
          team2Id: 'mkoi',
          scheduledTime: '2026-10-20T16:00:00-03:00',
          winnerId: null,
        },
      ],
    },
    {
      roundNumber: 2,
      isRealDraw: false,
      matches: [],
    },
    {
      roundNumber: 3,
      isRealDraw: false,
      matches: [],
    },
    {
      roundNumber: 4,
      isRealDraw: false,
      matches: [],
    },
    {
      roundNumber: 5,
      isRealDraw: false,
      matches: [],
    },
  ],
};

