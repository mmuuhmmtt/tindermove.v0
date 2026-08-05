import './App.css'
import MovieCard from './components/MovieCard'
import MovieModal from './components/MovieModal'
import RoomEntry, { JoinRoomScreen } from './components/RoomEntry'
import { useState, useEffect } from 'react'
import { db } from './firebase'
import { getUserId, getRoomFromUrl } from './roomUtils'
import { collection, doc, setDoc, onSnapshot, query, where } from 'firebase/firestore'

function App() {
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [page, setPage] = useState(1)
  const [showLiked, setShowLiked] = useState(false)

  const [likedMovies, setLikedMovies] = useState(() => {
    const saved = localStorage.getItem('likedMovies')
    return saved ? JSON.parse(saved) : []
  })

  // Oda yönetimi
  const [screen, setScreen] = useState('entry') // 'entry' | 'joinPrompt' | 'active'
  const [roomCode, setRoomCode] = useState(null)
  const [matches, setMatches] = useState([])
  const userId = getUserId()

  // Sayfa açılışında URL'de oda kodu var mı kontrol et
  useEffect(() => {
    const urlRoom = getRoomFromUrl()
    if (urlRoom) {
      setRoomCode(urlRoom)
      setScreen('joinPrompt')
    }
  }, [])

  // Film çekme (TMDB)
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=tr-TR&page=${page}`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovies((prevMovies) => [...prevMovies, ...data.results])
      })
      .catch((error) => {
        console.error('Film verisi çekilirken hata oluştu:', error)
      })
  }, [page])

  useEffect(() => {
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies))
  }, [likedMovies])

  // Oda içindeyken Firestore'u gerçek zamanlı dinle (eşleşmeleri bulmak için)
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

      setMatches(foundMatches.map((m) => m.movie))
    })

    return () => unsubscribe()
  }, [roomCode, screen])

  const handleSwipe = (direction) => {
    const currentMovie = movies[currentIndex]

    if (direction === 'right') {
      setLikedMovies([...likedMovies, currentMovie])

      // Oda modundaysak Firestore'a yaz
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

  // Ekran 1: Giriş (Oda Oluştur / Solo)
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

  // Ekran 2: Link ile gelen kullanıcıya katılma onayı
  if (screen === 'joinPrompt') {
    return (
      <JoinRoomScreen
        roomCode={roomCode}
        onJoin={() => setScreen('active')}
      />
    )
  }

  // Ekran 3: Asıl swipe uygulaması
  return (
    <div className="app">
      <div className="top-bar">
        <h1 className="logo">🔥 SwipeMovie</h1>
      </div>

      {roomCode && (
        <p className="room-badge">
          🏠 Oda: <strong>{roomCode}</strong> — bu linki arkadaşına gönder:
          <br />
          <code>{window.location.href}</code>
        </p>
      )}

      <button className="liked-counter" onClick={() => setShowLiked(!showLiked)}>
        {showLiked ? '⬅ Geri Dön' : `❤️ Beğenilen: ${likedMovies.length}`}
      </button>

      {roomCode && matches.length > 0 && (
        <div className="match-banner">
          🎉 {matches.length} ortak eşleşme bulundu!
        </div>
      )}

      {showLiked ? (
        <div className="liked-grid">
          {likedMovies.length === 0 ? (
            <p>Henüz beğendiğin film yok.</p>
          ) : (
            likedMovies.map((movie) => (
              <img
                key={movie.id}
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="liked-poster"
                onClick={() => setSelectedMovie(movie)}
              />
            ))
          )}
        </div>
      ) : (
        <>
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

         <div className="buttons">
          <button onClick={() => handleSwipe('left')} className="icon-button nope-button">✕</button>
          <button onClick={() => handleSwipe('right')} className="icon-button like-button">♥</button>
        </div>
        </>
      )}

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

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  )
}

export default App