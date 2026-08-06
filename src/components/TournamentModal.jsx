import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMovieTrailerKey } from '../roomUtils'

const ROUND_TITLES = [
  { name: 'Çeyrek Final', icon: '⚽', matchesCount: 4 },
  { name: 'Yarı Final', icon: '🔥', matchesCount: 2 },
  { name: 'Final', icon: '👑', matchesCount: 1 }
]

async function fetchRandomTournamentMovies(likedMovies, popularMovies) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY || '164bcd014a73abb83232a29f536ee142'
  // Rastgele 1 ile 20 arasında farklı bir sayfa çek (TMDB Keşif Endpoint'i)
  const randomPage = Math.floor(Math.random() * 20) + 1
  let freshMovies = []

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=tr-TR&page=${randomPage}&sort_by=popularity.desc&vote_count.gte=100`
    )
    const data = await res.json()
    if (data && Array.isArray(data.results)) {
      freshMovies = data.results
    }
  } catch (err) {
    console.error('Turnuva için taze film çekilirken hata:', err)
  }

  const uniqueMap = new Map()

  // 1. Beğenilen filmleri ekle
  if (Array.isArray(likedMovies)) {
    likedMovies.forEach((m) => {
      if (m && m.id) uniqueMap.set(m.id, m)
    })
  }

  // 2. O anki popüler filmleri ekle
  if (Array.isArray(popularMovies)) {
    popularMovies.forEach((m) => {
      if (m && m.id) uniqueMap.set(m.id, m)
    })
  }

  // 3. TMDB'den gelen taze rastgele filmleri ekle
  freshMovies.forEach((m) => {
    if (m && m.id) uniqueMap.set(m.id, m)
  })

  const pool = Array.from(uniqueMap.values())

  if (pool.length < 8) return null

  // 3 pasajlı Fisher-Yates karıştırma ile maksimum rastgelelik sağla
  const shuffled = [...pool]
  for (let pass = 0; pass < 3; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
  }

  return shuffled.slice(0, 8)
}

function TournamentModal({ isOpen, onClose, likedMovies, popularMovies, onPlayTrailer }) {
  const [currentRound, setCurrentRound] = useState(0) // 0: Çeyrek, 1: Yarı, 2: Final, 3: Şampiyon
  const [matchIndex, setMatchIndex] = useState(0)
  const [currentRoundMovies, setCurrentRoundMovies] = useState([])
  const [nextRoundWinners, setNextRoundWinners] = useState([])
  const [selectedWinnerId, setSelectedWinnerId] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [winner, setWinner] = useState(null)
  const [showPlatforms, setShowPlatforms] = useState(false)
  const [hasEnoughMovies, setHasEnoughMovies] = useState(true)
  const [loadingMovies, setLoadingMovies] = useState(false)

  const initializeTournament = async () => {
    setLoadingMovies(true)
    const initial8 = await fetchRandomTournamentMovies(likedMovies, popularMovies)
    setLoadingMovies(false)

    if (!initial8) {
      setHasEnoughMovies(false)
      return
    }

    setHasEnoughMovies(true)
    setCurrentRound(0)
    setMatchIndex(0)
    setCurrentRoundMovies(initial8)
    setNextRoundWinners([])
    setSelectedWinnerId(null)
    setIsAnimating(false)
    setWinner(null)
    setShowPlatforms(false)
  }

  useEffect(() => {
    if (isOpen) {
      initializeTournament()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSelectWinner = (movie) => {
    if (isAnimating) return

    setSelectedWinnerId(movie.id)
    setIsAnimating(true)

    setTimeout(() => {
      const updatedWinners = [...nextRoundWinners, movie]
      const nextMatchIndex = matchIndex + 1

      if (nextMatchIndex * 2 < currentRoundMovies.length) {
        // Aynı turda sonraki maç
        setNextRoundWinners(updatedWinners)
        setMatchIndex(nextMatchIndex)
        setSelectedWinnerId(null)
        setIsAnimating(false)
      } else {
        // Tur bitti
        if (updatedWinners.length === 1) {
          // Şampiyon belirlendi!
          setWinner(updatedWinners[0])
          setCurrentRound(3)
          setSelectedWinnerId(null)
          setIsAnimating(false)
        } else {
          // Sonraki tura geç
          setCurrentRound((prev) => prev + 1)
          setCurrentRoundMovies(updatedWinners)
          setNextRoundWinners([])
          setMatchIndex(0)
          setSelectedWinnerId(null)
          setIsAnimating(false)
        }
      }
    }, 450)
  }

  const handleTrailerClick = async () => {
    if (!winner) return
    if (onPlayTrailer) {
      onPlayTrailer(winner)
    } else {
      const key = await getMovieTrailerKey(winner.id)
      if (key) {
        window.open(`https://www.youtube.com/watch?v=${key}`, '_blank')
      } else {
        alert('Bu film için maalesef fragman bulunamadı.')
      }
    }
  }

  const movieSearchQuery = winner ? encodeURIComponent(`${winner.title} izle nerede var`) : ''

  // Eşleşmedeki 2 film
  const movieA = currentRoundMovies[matchIndex * 2]
  const movieB = currentRoundMovies[matchIndex * 2 + 1]
  const roundInfo = ROUND_TITLES[currentRound]

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex: 270 }}
      >
        <motion.div
          className="tournament-modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>

          {loadingMovies ? (
            <div className="tournament-empty-state" style={{ padding: '40px 10px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <h2>🎲 Sürpriz Filmler Hazırlanıyor...</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Turnuva için yepyeni 8 film çekiliyor ve eşleştiriliyor, lütfen bekleyin!
              </p>
            </div>
          ) : !hasEnoughMovies ? (
            <div className="tournament-empty-state">
              <div className="empty-icon">🏆</div>
              <h2>Turnuva İçin Yetersiz Film</h2>
              <p>Turnuva modunu başlatabilmek için sistemde en az 8 film bulunmalıdır.</p>
              <p className="empty-subtext">
                Lütfen ana sayfada birkaç film daha kaydırarak veya filmler yüklenirken bekleyerek tekrar deneyin! 🍿
              </p>

              <button className="primary-button" onClick={onClose} style={{ marginTop: '20px' }}>
                Anladım, Keşfetmeye Devam Et
              </button>
            </div>
          ) : winner && currentRound === 3 ? (
            /* CHAMPION RESULT VIEW */
            <div className="tournament-winner-view">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div className="champion-badge">🏆 TURNUVA ŞAMPİYONU! 🏆</div>
                <h1 className="champion-title">{winner.title}</h1>

                <div className="match-poster-wrapper champion-poster-box">
                  <img
                    src={winner.poster_path ? `https://image.tmdb.org/t/p/w500${winner.poster_path}` : ''}
                    alt={winner.title}
                    className="match-modal-poster champion-poster"
                  />
                  <div className="champion-rating-badge">
                    ⭐ {typeof winner.vote_average === 'number' ? winner.vote_average.toFixed(1) : '7.5'}
                  </div>
                </div>

                <p className="champion-overview">
                  {winner.overview || 'Bu harika film 8 aday arasından turnuvayı birincilikle tamamladı!'}
                </p>

                <div className="couple-actions" style={{ marginTop: '16px' }}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    className="primary-button match-watch-btn"
                    onClick={() => setShowPlatforms(!showPlatforms)}
                  >
                    🍿 Nerede İzlenir? (Platformlar)
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    className="secondary-button modal-trailer-btn"
                    onClick={handleTrailerClick}
                    style={{ marginTop: '8px' }}
                  >
                    ▶ Fragman İzle
                  </motion.button>
                </div>

                {showPlatforms && (
                  <motion.div
                    className="streaming-platforms-box"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '14px', width: '100%' }}
                  >
                    <p className="platform-title">🎬 Nerede İzleyebilirsin?</p>
                    <div className="platform-buttons-row">
                      <a
                        href={`https://www.netflix.com/search?q=${encodeURIComponent(winner.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="platform-btn netflix-btn"
                      >
                        🔴 Netflix'te Arat
                      </a>
                      <a
                        href={`https://www.primevideo.com/search/ref=atv_sr_sug?phrase=${encodeURIComponent(winner.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="platform-btn prime-btn"
                      >
                        🔵 Prime Video'da Arat
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${movieSearchQuery}`}
                        target="_blank"
                        rel="noreferrer"
                        className="platform-btn google-btn"
                      >
                        🔍 Google'da Arama Yap
                      </a>
                    </div>
                  </motion.div>
                )}

                <div className="tournament-footer-buttons">
                  <button className="primary-button restart-tournament-btn" onClick={initializeTournament}>
                    🔄 Yeniden Oyna (Yeni 8 Film)
                  </button>

                  <button className="secondary-button" onClick={onClose}>
                    ✕ Kapat
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            /* BRACKET MATCHVIEW */
            <div className="tournament-bracket-view">
              <div className="tournament-header">
                <h2>🏆 Film Turnuvası</h2>
                <div className="tournament-round-badge">
                  <span>
                    {roundInfo?.icon} {roundInfo?.name} — Maç {matchIndex + 1}/{roundInfo?.matchesCount}
                  </span>
                </div>

                <div className="tournament-progress-pills">
                  {ROUND_TITLES.map((r, idx) => (
                    <div
                      key={r.name}
                      className={`progress-pill ${idx === currentRound ? 'active' : idx < currentRound ? 'completed' : ''}`}
                    >
                      {r.name}
                    </div>
                  ))}
                </div>
              </div>

              <p className="tournament-prompt">Hangisini tercih edersin? Seçtiğin film tura devam eder!</p>

              <div className="matchup-container">
                {movieA && (
                  <motion.div
                    className={`tournament-card ${
                      selectedWinnerId === movieA.id
                        ? 'winner-selected'
                        : selectedWinnerId && selectedWinnerId !== movieA.id
                        ? 'loser-eliminated'
                        : ''
                    }`}
                    onClick={() => handleSelectWinner(movieA)}
                    whileHover={{ scale: isAnimating ? 1 : 1.03 }}
                    whileTap={{ scale: isAnimating ? 1 : 0.97 }}
                  >
                    <div className="card-poster-box">
                      <img
                        src={movieA.poster_path ? `https://image.tmdb.org/t/p/w400${movieA.poster_path}` : ''}
                        alt={movieA.title}
                        className="tournament-poster"
                      />
                      <div className="card-overlay-gradient"></div>
                      <div className="tournament-movie-info">
                        <span className="movie-title">{movieA.title}</span>
                        <span className="movie-rating">
                          ⭐ {typeof movieA.vote_average === 'number' ? movieA.vote_average.toFixed(1) : '7.0'}
                        </span>
                      </div>
                    </div>
                    <button className="select-movie-btn">Seç 🎬</button>
                  </motion.div>
                )}

                <div className="vs-badge-container">
                  <div className="vs-circle">VS</div>
                </div>

                {movieB && (
                  <motion.div
                    className={`tournament-card ${
                      selectedWinnerId === movieB.id
                        ? 'winner-selected'
                        : selectedWinnerId && selectedWinnerId !== movieB.id
                        ? 'loser-eliminated'
                        : ''
                    }`}
                    onClick={() => handleSelectWinner(movieB)}
                    whileHover={{ scale: isAnimating ? 1 : 1.03 }}
                    whileTap={{ scale: isAnimating ? 1 : 0.97 }}
                  >
                    <div className="card-poster-box">
                      <img
                        src={movieB.poster_path ? `https://image.tmdb.org/t/p/w400${movieB.poster_path}` : ''}
                        alt={movieB.title}
                        className="tournament-poster"
                      />
                      <div className="card-overlay-gradient"></div>
                      <div className="tournament-movie-info">
                        <span className="movie-title">{movieB.title}</span>
                        <span className="movie-rating">
                          ⭐ {typeof movieB.vote_average === 'number' ? movieB.vote_average.toFixed(1) : '7.0'}
                        </span>
                      </div>
                    </div>
                    <button className="select-movie-btn">Seç 🎬</button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TournamentModal
