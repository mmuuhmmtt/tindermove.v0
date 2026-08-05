import './App.css'
import MovieCard from './components/MovieCard'
import MovieModal from './components/MovieModal'
import FilterModal from './components/FilterModal'
import MatchModal from './components/MatchModal'
import RoomEntry, { JoinRoomScreen } from './components/RoomEntry'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from './firebase'
import { getUserId, getRoomFromUrl } from './roomUtils'
import { collection, doc, setDoc, onSnapshot, query, where } from 'firebase/firestore'

function App() {
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [page, setPage] = useState(1)
  const [showLiked, setShowLiked] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ genre: null, minRating: 0 })

  const [likedMovies, setLikedMovies] = useState(() => {
    const saved = localStorage.getItem('likedMovies')
    return saved ? JSON.parse(saved) : []
  })

  const [screen, setScreen] = useState('entry')
  const [roomCode, setRoomCode] = useState(null)
  const [matches, setMatches] = useState([])
  const userId = getUserId()

  useEffect(() => {
    const urlRoom = getRoomFromUrl()
    if (urlRoom) {
      setRoomCode(urlRoom)
      setScreen('joinPrompt')
    }
  }, [])

  // Film çekme — filtrelere göre discover endpoint'i kullanıyoruz
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=tr-TR&page=${page}&sort_by=popularity.desc`

    if (filters.genre) {
      url += `&with_genres=${filters.genre}`
    }
    if (filters.minRating > 0) {
      url += `&vote_average.gte=${filters.minRating}&vote_count.gte=50`
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovies((prevMovies) => (page === 1 ? data.results : [...prevMovies, ...data.results]))
      })
      .catch((error) => {
        console.error('Film verisi çekilirken hata oluştu:', error)
      })
  }, [page, filters])

  // Filtre değişince baştan başla
  useEffect(() => {
    setCurrentIndex(0)
    setPage(1)
    setMovies([])
  }, [filters])

  useEffect(() => {
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies))
  }, [likedMovies])

  const [newMatchMovie, setNewMatchMovie] = useState(null)

  useEffect(() => {
    if (!roomCode || screen !== 'active') return

    const swipesRef = collection(db, 'rooms', roomCode, 'swipes')
    const rightSwipesQuery = query(swipesRef, where('direction', '==', 'right'))

    const unsubscribe = onSnapshot(rightSwipesQuery, (snapshot) => {
      const likesByMovie = {}

      snapshot.forEach((docSnap) => {
        const data = docSnap.data()
        if (!likesByMovie[data.movieId]) {
          likesByMovie[data.movieId] = { users: [], movie: data.movie }
        }
        likesByMovie[data.movieId].users.push(data.userId)
      })

      const foundMatches = Object.values(likesByMovie).filter(
        (entry) => entry.users.length >= 2
      )

      const foundMatchesList = foundMatches.map((m) => m.movie)

      setMatches((prevMatches) => {
        const prevIds = new Set(prevMatches.map((m) => m.id))
        const brandNew = foundMatchesList.find((m) => !prevIds.has(m.id))
        if (brandNew) {
          setNewMatchMovie(brandNew)
        }
        return foundMatchesList
      })
    })

    return () => unsubscribe()
  }, [roomCode, screen])

  const [history, setHistory] = useState([])

  const handleRemoveLiked = (movieId, e) => {
    if (e) e.stopPropagation()
    setLikedMovies((prev) => prev.filter((m) => m.id !== movieId))
    if (selectedMovie && selectedMovie.id === movieId) {
      setSelectedMovie(null)
    }
  }

  const handleSwipe = (direction) => {
    if (currentIndex >= movies.length) return
    const currentMovie = movies[currentIndex]

    setHistory((prev) => [...prev, { movie: currentMovie, direction, index: currentIndex }])

    if (direction === 'right' || direction === 'super') {
      setLikedMovies((prev) => {
        if (prev.some((m) => m.id === currentMovie.id)) return prev
        return [...prev, currentMovie]
      })

      if (roomCode) {
        const swipeDocRef = doc(db, 'rooms', roomCode, 'swipes', `${userId}_${currentMovie.id}`)
        setDoc(swipeDocRef, {
          userId,
          movieId: currentMovie.id,
          direction: 'right',
          movie: {
            id: currentMovie.id,
            title: currentMovie.title,
            poster_path: currentMovie.poster_path,
            overview: currentMovie.overview,
            release_date: currentMovie.release_date,
            vote_average: currentMovie.vote_average
          }
        })
      }
    }

    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)

    if (nextIndex >= movies.length - 5) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const handleRewind = () => {
    if (currentIndex > 0 && history.length > 0) {
      const last = history[history.length - 1]
      setHistory((prev) => prev.slice(0, -1))
      setCurrentIndex(last.index)
      if (last.direction === 'right' || last.direction === 'super') {
        setLikedMovies((prev) => prev.filter((m) => m.id !== last.movie.id))
      }
    }
  }

  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (screen === 'entry') {
    return (
      <RoomEntry
        onJoinSolo={() => {
          setRoomCode(null)
          setScreen('active')
        }}
      />
    )
  }

  if (screen === 'joinPrompt') {
    return (
      <JoinRoomScreen
        roomCode={roomCode}
        onJoin={() => setScreen('active')}
      />
    )
  }

  return (
    <div className="app">
      <div className="top-bar">
        <h1 className="logo">🔥 SwipeMovie</h1>
      </div>

      {roomCode && (
        <div className="room-badge">
          <span>🏠 Oda Kodu: <strong>{roomCode}</strong></span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`copy-link-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? '✅ Link Kopyalandı!' : '📋 Oda Linkini Kopyala'}
          </motion.button>
        </div>
      )}

      <div className="top-buttons-row">
        <button className="liked-counter" onClick={() => setShowLiked(!showLiked)}>
          {showLiked ? '⬅ Geri Dön' : `❤️ Beğenilen: ${likedMovies.length}`}
        </button>
      </div>

      {roomCode && matches.length > 0 && (
        <div className="match-banner">
          🎉 {matches.length} ortak eşleşme bulundu!
        </div>
      )}

      <AnimatePresence mode="wait">
        {showLiked ? (
          <motion.div
            key="liked-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="liked-grid"
          >
            {likedMovies.length === 0 ? (
              <p className="empty-liked-text">Henüz beğendiğin film yok.</p>
            ) : (
              likedMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  className="liked-item"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <button
                    className="remove-liked-btn"
                    onClick={(e) => handleRemoveLiked(movie.id, e)}
                    title="Beğenilerden Kaldır"
                  >
                    ✕
                  </button>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="liked-poster"
                    onClick={() => setSelectedMovie(movie)}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="cards-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div className="card-stack">
              {movies.slice(currentIndex, currentIndex + 2).reverse().map((movie, i, arr) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSwipe={handleSwipe}
                  onCardClick={setSelectedMovie}
                  isTop={i === arr.length - 1}
                />
              ))}
              {movies.length > 0 && currentIndex >= movies.length && (
                <p>Gösterilecek başka film kalmadı 🎉</p>
              )}
            </div>

            <div className="tinder-action-buttons">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={handleRewind}
                className="tinder-btn rewind-btn"
                title="Geri Al"
                disabled={currentIndex === 0 || history.length === 0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleSwipe('left')}
                className="tinder-btn nope-btn"
                title="Pas Geç"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleSwipe('right')}
                className="tinder-btn like-btn"
                title="Beğen"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => setShowFilters(true)}
                className="tinder-btn boost-btn"
                title="Filtrele"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {roomCode && matches.length > 0 && (
        <div className="liked-grid">
          {matches.map((movie) => (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="liked-poster match-poster"
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onRemoveLiked={handleRemoveLiked}
        isLiked={selectedMovie ? likedMovies.some((m) => m.id === selectedMovie.id) : false}
      />

      <FilterModal
        filters={filters}
        onApply={setFilters}
        onClose={() => setShowFilters(false)}
        isOpen={showFilters}
      />

      <MatchModal
        matchMovie={newMatchMovie}
        onClose={() => setNewMatchMovie(null)}
      />
    </div>
  )
}

export default App