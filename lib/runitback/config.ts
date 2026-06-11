// Season is derived from the current year so labels never need manual updates.
export const CURRENT_SEASON = new Date().getFullYear()
export const SEASON_LABEL = `SEASON ${CURRENT_SEASON}`

export interface Club {
  id: string
  name: string
  file: string
}

// Badge PNGs live in /public/runitback/badges/<file>, sourced from
// https://github.com/luukhopman/football-logos
export const CLUBS: Club[] = [
  { id: 'real-madrid', name: 'Real Madrid', file: 'real-madrid.png' },
  { id: 'barcelona', name: 'FC Barcelona', file: 'barcelona.png' },
  { id: 'atletico-madrid', name: 'Atletico Madrid', file: 'atletico-madrid.png' },
  { id: 'arsenal', name: 'Arsenal', file: 'arsenal.png' },
  { id: 'chelsea', name: 'Chelsea', file: 'chelsea.png' },
  { id: 'liverpool', name: 'Liverpool', file: 'liverpool.png' },
  { id: 'man-city', name: 'Manchester City', file: 'man-city.png' },
  { id: 'man-united', name: 'Manchester United', file: 'man-united.png' },
  { id: 'tottenham', name: 'Tottenham Hotspur', file: 'tottenham.png' },
  { id: 'newcastle', name: 'Newcastle United', file: 'newcastle.png' },
  { id: 'psg', name: 'Paris Saint-Germain', file: 'psg.png' },
  { id: 'bayern', name: 'Bayern Munich', file: 'bayern.png' },
  { id: 'dortmund', name: 'Borussia Dortmund', file: 'dortmund.png' },
  { id: 'ac-milan', name: 'AC Milan', file: 'ac-milan.png' },
  { id: 'inter-milan', name: 'Inter Milan', file: 'inter-milan.png' },
  { id: 'juventus', name: 'Juventus', file: 'juventus.png' },
  { id: 'napoli', name: 'Napoli', file: 'napoli.png' },
]

export function getClub(id: string | null | undefined): Club | undefined {
  if (!id) return undefined
  return CLUBS.find((c) => c.id === id)
}
