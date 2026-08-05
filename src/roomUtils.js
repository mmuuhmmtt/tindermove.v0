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

export function getCleanRoomUrl(roomCode) {
  let baseUrl = 'https://tindermove-v0.vercel.app'

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host.includes('vercel.app')) {
      baseUrl = window.location.origin
    }
  }

  return `${baseUrl}/?room=${roomCode}`
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