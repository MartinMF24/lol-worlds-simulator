# Simulador Mundial de League of Legends (Worlds) • Versión 2.0

Aplicación web interactiva de alto rendimiento desarrollada con **Next.js 14 (App Router)**, **TypeScript** y **Tailwind CSS** para simular de forma integral el Campeonato Mundial de League of Legends: desde el sorteo oficial y la **Fase Suiza panorámica**, hasta el cuadro de **Playoffs (Eliminación Directa)**, incorporando **ratings competitivos** y un motor probabilístico de **Monte Carlo ($N=1.000$)** para predecir los resultados de cada cruce.

---

## 🌟 Novedades de la Versión 2.0

- 📅 **Integración de Datos Reales y Sorteo Oficial de Ronda 1**: Programación con horarios oficiales y partidos confirmados.
- 🏆 **Cuadro Completo de Playoffs (Knockout Stage)**: Sorteo automático reglamentario de Riot Games con series al mejor de 5 (Bo5), cuartos, semifinales y coronación del Campeón.
- ⚡ **Ratings Competitivos de Equipos**: Calificaciones en escala 1 a 100 para los 19 equipos (15 clasificados + 4 candidatos de Play-In) desglosadas en Macro, Micro y Estrategia.
- 🎲 **Calculadora de Probabilidades con Simulador de Monte Carlo**: Motor estocástico con $1.000$ simulaciones por cruce, perturbación gaussiana y semilla determinista para evitar fluctuaciones al recargar.
- 📊 **Barra de Probabilidad Inline Minimalista**: Visualización compacta en cada tarjeta de partido (equipo superior en amarillo vs equipo inferior en gris).
- 🕒 **Selector de Zonas Horarias y Estado "EN VIVO"**: Conversión dinámica a husos horarios de Argentina (ART), España (CET/CEST) y México (CST/CDT) con indicador LIVE en tiempo real.
- 🃏 **Fase de Play-In Interactiva**: Selección del cupo 16 con pila de eliminados ordenada cronológicamente.
- ⚡ **Auto-Pick Dual**: Autocompletado aleatorio clásico (50/50) o inteligente basado en el favorito de Monte Carlo.

---

## 🎯 Módulos Principales

### 1. 🎲 Calculadora de Probabilidades (Monte Carlo $N=1.000$)
El simulador predice el porcentaje de victoria de cada cruce mediante un modelo matemático avanzado:
- **Modelo Logístico (Bradley-Terry)**: Convierte la diferencia de rating compuesto entre ambos equipos en una probabilidad base de victoria por mapa.
- **Perturbación Gaussiana (Box-Muller, $\sigma = 2.5$)**: Introduce variabilidad competitiva en cada iteración para simular "el día" del equipo, el estado de forma y la preparación del draft.
- **Formato Dinámico (Bo1 vs Bo3)**:
  - **Bo1**: Simula una partida única para las rondas suizas regulares.
  - **Bo3**: Simula series al mejor de 3 (primero a 2 victorias) para partidos de clasificación a Playoffs o de eliminación.
- **Semilla Determinista (Mulberry32 PRNG)**: Cada partido genera una semilla matemática única basada en `matchId + team1Id + team2Id + formato`. Esto garantiza que los porcentajes permanezcan **100% estables e idénticos al recargar la página**, pero cambien de forma dinámica al volver a sortear la ronda.
- **Visualización en `MatchCard`**:
  ```text
  +-------------------------------------------------------+
  | BO1                                             14:00 |
  |-------------------------------------------------------|
  | [img] Gen.G LCK                                   0-0 |
  | [img] Invictus Gaming LPL                         0-0 |
  |-------------------------------------------------------|
  | 70%  [===========================  =========]     30% |
  +-------------------------------------------------------+
  ```
  - **Equipo superior (`team1`)**: Porcentaje a la izquierda en **amarillo** (`text-amber-400`).
  - **Barra Central**: Segmentos proporcionales separados por un gap de 1px.
  - **Equipo inferior (`team2`)**: Porcentaje a la derecha en **gris** (`text-zinc-400`).

---

### 2. ⚡ Ratings Competitivos de los Equipos (Power Rankings)
Calificaciones basadas en el meta y rendimiento regional para los 19 equipos participantes (escala 1 a 100):
- **40% Nivel de Equipo / Macro (`teamplay`)**: Coordinación en peleas grupales (*teamfights*), control de visión y rotaciones de mapa.
- **35% Nivel Individual / Micro (`individual`)**: Mecánicas individuales, fase de líneas y diferencial de oro temprano.
- **25% Nivel Estratégico (`strategy`)**: Lectura del meta, versatilidad de campeones y adaptabilidad de *drafts*.

#### 🔍 Tarjeta Informativa de Roster y Ratings (Popover)
Al posicionar el cursor sobre cualquier equipo, tras un delay de **medio segundo (500ms)** se despliega una tarjeta flotante que incluye:
- Roster titular completo (Top, Jungla, Mid, ADC, Soporte).
- **Rating Medio Ponderado** en la esquina superior derecha (`Rating 94`).
- **Desglose de los 3 Atributos** en tamaño reducido (`Ind: 94 • Eq: 96 • Est: 94`).

---

### 3. 🏆 Cuadro de Playoffs (Fase de Eliminación Directa)
Al concluir la Fase Suiza con los 8 clasificados, se habilita la pestaña de **Playoffs**:
- **Reglas Oficiales de Sorteo Riot Games**:
  - Los dos equipos que avanzan **3-0** son sembrados en lados opuestos del cuadro (no pueden cruzarse hasta una hipotética Gran Final).
  - Los equipos **3-0** se emparejan obligatoriamente contra equipos clasificados **3-2**.
  - El equipo **3-2** restante se empareja contra un equipo **3-1**.
  - Los dos equipos **3-1** restantes se enfrentan entre sí en Cuartos de Final.
- **Series Bo5 Interactivas**: Selección manual de ganadores o autocompletado en Cuartos, Semifinales y Final.
- **Lazy Loading**: El módulo de playoffs se carga dinámicamente mediante `next/dynamic` para mantener el bundle inicial ultraliviano.

---

### 4. 🎮 Cuadro Suizo Panorámico
- **Visualización Horizontal Continua (`overflow-x-auto`)**: Progresión completa de Rondas 1 a 5 de izquierda a derecha.
- **Agrupación por Récords**:
  - **Ronda 1**: 8 partidos (0-0) con bombos Seed 1 vs Seed 4 y Seed 2 vs Seed 3 sin cruces regionales.
  - **Ronda 2**: Pool 1-0 y Pool 0-1.
  - **Ronda 3**: Pool 2-0 (🏆 Clasificación Bo3), Pool 1-1, Pool 0-2 (⚠️ Eliminación Bo3).
  - **Ronda 4**: Pool 2-1 (🏆 Clasificación Bo3), Pool 1-2 (⚠️ Eliminación Bo3).
  - **Ronda 5**: Pool 2-2 (⚡ Decisivo Bo3: 3V Clasifica / 3D Elimina).
- **Algoritmo de Backtracking Estricto**: Garantiza **0% de revanchas** a lo largo de todo el torneo y cumple el 100% de las reglas de emparejamiento suizo.
- **Modo Historial**: Las rondas pasadas permanecen visibles en modo solo lectura con ganadores destacados.

---

### 5. 🌍 Horarios Reales, Selector de Timezone y Badge "EN VIVO"
- **Fechas Oficiales en Encabezados**: Si los partidos de una columna comparten la misma fecha, se muestra en la cabecera (ej. `20 de Octubre`).
- **Conversión de Husos Horarios**: Selector minimalista flotante en la esquina inferior derecha con soporte para:
  - 🇦🇷 **Argentina (ART - UTC-3)** [Predeterminado]
  - 🇪🇸 **España (CET/CEST - UTC+2)**
  - 🇲🇽 **México (CST/CDT - UTC-6)**
- **Badge "EN VIVO" Automático**: Compara la hora del sistema en tiempo real. Un partido adquiere el estado `EN VIVO` (badge rojo parpadeante `animate-pulse`) si la hora actual es mayor o igual a su horario programado y menor a la del siguiente partido.

---

## 📁 Estructura del Proyecto

```
lol-worlds-simulator/
├── public/
│   └── assets/                     # Logos oficiales de equipos e íconos de roles
├── app/
│   ├── globals.css                 # Configuración de estilos y scrollbars Tailwind
│   ├── layout.tsx                  # Root layout y metadatos SEO
│   └── page.tsx                    # Orquestador principal, vistas Suiza y Playoffs
├── src/
│   ├── types/
│   │   ├── swiss.ts                # Interfaces de Team, Match, Round, Roster
│   │   ├── ratings.ts              # Modelos de TeamRatings, RatingWeights, MatchProbability
│   │   └── timezone.ts             # Definición de opciones y husos horarios
│   ├── data/
│   │   ├── teams.ts                # Equipos del torneo principal y candidatos de Play-In
│   │   ├── teamRatings.ts          # Calificaciones competitivas (Macro, Micro, Estrategia)
│   │   ├── teamImages.ts           # Mapeo estático a assets de imágenes
│   │   └── tournamentData.ts       # Datos oficiales del sorteo real de Ronda 1
│   ├── utils/
│   │   ├── monteCarlo.ts           # Motor de simulación estocástica (Mulberry32, Box-Muller, Bradley-Terry)
│   │   ├── swissDraw.ts            # Algoritmo de sorteo suizo con backtracking y 0 revanchas
│   │   ├── playoffDraw.ts          # Algoritmo de sorteo reglamentario de Playoffs (Riot Games)
│   │   ├── timezone.ts             # Formateadores con Intl.DateTimeFormat
│   │   └── security.ts             # Sanitización de strings contra inyección
│   ├── hooks/
│   │   └── useSwissSimulation.ts   # Máquina de estados integral de la Fase Suiza
│   └── components/
│       ├── Navbar.tsx              # Cabecera, pestañas de etapa, versión y Auto-Pick dual
│       ├── RoundColumn.tsx         # Columna vertical por ronda (memoizada)
│       ├── RecordPoolGroup.tsx     # Agrupación visual por récord (ej. Pool 2-0)
│       ├── MatchCard.tsx           # Tarjeta de partido con barra de probabilidades y estado LIVE
│       ├── FinalZoneColumn.tsx     # Columnas de Clasificados (arriba) y Eliminados (abajo)
│       ├── PlayInSelection.tsx     # Selector del clasificado de Play-In
│       ├── TeamRosterTooltip.tsx   # Wrapper con delay de 500ms
│       ├── TeamRosterPopover.tsx   # Popover con roster, rating medio y desglose
│       ├── TimezoneSelector.tsx    # Dropdown flotante de cambio de huso horario
│       └── playoffs/
│           ├── PlayoffsView.tsx    # Vista completa del cuadro de eliminación directa
│           └── PlayoffMatchCard.tsx# Tarjeta interactiva de serie Bo5 de playoffs
├── test/
│   ├── test-swiss.js               # Suite de 400 simulaciones completas de suizo
│   └── test-playoffs.js            # Suite de 100 sorteos reglamentarios de playoffs
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Instalación y Ejecución

### 1. Iniciar Entorno de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador web.

### 2. Ejecutar Pruebas Automatizadas
Verifica el cumplimiento de todas las restricciones del torneo (400 torneos suizos completos y 100 sorteos de playoffs):
```bash
npm test
```

### 3. Compilación de Producción
```bash
npm run build
npm run start
```
Compilación estática optimizada con 0 errores de TypeScript y soporte completo contra desajustes de hidratación.

---

## 📄 Licencia
Proyecto de código abierto desarrollado para la comunidad competitiva de League of Legends.
