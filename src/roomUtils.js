export function getUserId() {
  let userId = localStorage.getItem('swipemovie_userId')
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 10)
    localStorage.setItem('swipemovie_userId', userId)
  }
  return userId
}

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function getRoomFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('room')
}

export function sanitizeMovie(movie) {
  if (!movie) return null
  return {
    id: movie.id || 0,
    title: movie.title || '',
    poster_path: movie.poster_path || '',
    overview: movie.overview || '',
    release_date: movie.release_date || '',
    vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0
  }
}

export function getCleanRoomUrl(roomCode, roomMode) {
  let baseUrl = 'https://tindermove-v0.vercel.app'

  const modeSuffix = roomMode === 'couple' ? '&mode=couple' : ''
  return `${baseUrl}/?room=${roomCode}${modeSuffix}`
}

export async function getMovieTrailerKey(movieId) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  try {
    let res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=tr-TR`)
    let data = await res.json()
    let trailer = data.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube')

    if (!trailer) {
      res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`)
      data = await res.json()
      trailer = data.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || data.results?.[0]
    }

    return trailer ? trailer.key : null
  } catch (err) {
    console.error('Fragman çekilirken hata oluştu:', err)
    return null
  }
}

export function getDeterministicWinningMovie(roomCode, userSelectionDocs) {
  if (!userSelectionDocs || userSelectionDocs.length === 0) return null

  const sortedDocs = [...userSelectionDocs].sort((a, b) => (a.userId || '').localeCompare(b.userId || ''))
  const pool = []

  sortedDocs.forEach((docData) => {
    if (Array.isArray(docData.selections)) {
      docData.selections.forEach((m) => {
        if (m && m.id) pool.push(m)
      })
    }
  })

  if (pool.length === 0) return null

  const seedStr = `${roomCode}_${pool.map((m) => m.id).join('_')}`
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i)
    hash |= 0
  }

  const index = Math.abs(hash) % pool.length
  return { winner: pool[index], pool, userSelectionDocs: sortedDocs }
}