# Simulador Fase Suiza - Worlds de League of Legends (Next.js & Tailwind CSS)

Aplicación web interactiva desarrollada con **Next.js 14 (App Router)**, **TypeScript** y **Tailwind CSS** para simular la **Fase Suiza** del Campeonato Mundial de League of Legends (Worlds) en un **Cuadro Suizo Panorámico horizontal**.

---

## 🎮 Características del Cuadro Suizo Panorámico

1. **Visualización Horizontal Simultánea (`overflow-x-auto`)**:
   - Muestra la progresión completa del torneo de izquierda a derecha.
   - Columnas independientes para cada **Ronda (1 a 5)**.
2. **Agrupación de Brackets por Récords**:
   - A partir de la Ronda 2, los partidos se organizan en sub-bloques visuales independientes según el récord de los equipos:
     - **Ronda 2**: Pool 1-0 y Pool 0-1.
     - **Ronda 3**: Pool 2-0 (🏆 Pase a Playoffs), Pool 1-1, Pool 0-2 (⚠️ Eliminación).
     - **Ronda 4**: Pool 2-1 (🏆 Pase a Playoffs), Pool 1-2 (⚠️ Eliminación).
     - **Ronda 5**: Pool 2-2 (⚡ Decisivo: 3V Clasifica / 3D Elimina).
3. **Historial de Rondas en Modo Solo Lectura**:
   - Las rondas pasadas permanecen siempre visibles a la izquierda con los ganadores resaltados y controles deshabilitados.
   - Solo la columna de la ronda activa permite interactuar haciendo click en los equipos para seleccionar al ganador.
4. **Zonas Finales (Extrema Derecha)**:
   - Dos columnas que se pueblan automáticamente conforme los equipos alcanzan el objetivo:
     - **🏆 Clasificados a Playoffs (8 equipos)**: Equipos que logran 3 victorias (3-0, 3-1, 3-2).
     - **💀 Eliminados (8 equipos)**: Equipos que sufren 3 derrotas (0-3, 1-3, 2-3).
5. **Algoritmo de Sorteo Suizo Estricto**:
   - **Ronda 1**: Bombos Seed 1 vs Seed 4 y Seed 2 vs Seed 3 sin cruces entre equipos de la misma región.
   - **Rondas 2 a 5**: Emparejamiento por mismo récord garantizando **0% de revanchas** mediante backtracking.

---

## 📁 Estructura del Proyecto

```
Simulador World 2026/
├── public/
│   └── assets/                     # Imágenes y logos de los 16 equipos
├── app/
│   ├── globals.css                 # Estilos Tailwind y scrollbar personalizada
│   ├── layout.tsx                  # Layout raíz y metadata
│   └── page.tsx                    # Canvas panorámico horizontal integrador
├── src/
│   ├── types/
│   │   └── swiss.ts                # Modelos de datos TypeScript (Team, Match, Round)
│   ├── data/
│   │   ├── teams.ts                # Arreglo inicial de los 16 equipos
│   │   └── teamImages.ts           # Mapeo estático a /assets/...
│   ├── utils/
│   │   └── swissDraw.ts            # Algoritmo de sorteo suizo con backtracking
│   ├── hooks/
│   │   └── useSwissSimulation.ts   # Hook con la máquina de estados del torneo
│   └── components/
│       ├── Navbar.tsx              # Barra de control y estadísticas en vivo
│       ├── RoundColumn.tsx         # Columna vertical por ronda (activa, pasada, futura)
│       ├── RecordPoolGroup.tsx     # Agrupación visual por récord (ej. Pool 2-0)
│       ├── MatchCard.tsx           # Tarjeta de partido web (interactiva o solo lectura)
│       └── FinalZoneColumn.tsx     # Columnas de los 8 Clasificados y 8 Eliminados
├── test/
│   └── test-swiss.js               # Pruebas automatizadas de 100 simulaciones
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Servidor de Desarrollo
Para iniciar la aplicación en tu navegador:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 2. Construcción de Producción
```bash
npm run build
npm run start
```

### 3. Pruebas Automatizadas del Algoritmo Suizo
Para verificar el cumplimiento del 100% de las restricciones en 100 torneos completos:

```bash
npm run test:swiss
```
