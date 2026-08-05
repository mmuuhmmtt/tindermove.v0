import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMovieTrailerKey } from '../roomUtils'

function MovieModal({ movie, onClose, onRemoveLiked, isLiked, onPlayTrailer }) {
  const [showPlatforms, setShowPlatforms] = useState(false)

  if (!movie) return null

  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''
  const year = movie.release_date ? movie.release_date.split('-')[0] : ''
  const movieSearchQuery = encodeURIComponent(`${movie.title} izle`)

  const handleTrailerClick = async () => {
    if (onPlayTrailer) {
      onPlayTrailer(movie)
    } else {
      const key = await getMovieTrailerKey(movie.id)
      if (key) {
        window.open(`https://www.youtube.com/watch?v=${key}`, '_blank')
      } else {
        alert('Bu film için maalesef fragman bulunamadı.')
      }
    }
  }

  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.88, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <img src={posterUrl} alt={movie.title} className="modal-poster" />
            <h2>{movie.title} ({year})</h2>
            <p className="modal-rating">⭐ {movie.vote_average?.toFixed(1)}</p>
            <p className="modal-overview">{movie.overview}</p>

            {/* İzleme & Fragman Aksiyon Alanı */}
            <div className="modal-watch-section">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="primary-button modal-watch-now-btn"
                onClick={() => setShowPlatforms(!showPlatforms)}
              >
                🍿 Filmi İzle (Platformlar)
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="secondary-button modal-trailer-btn"
                onClick={handleTrailerClick}
              >
                ▶ Fragman İzle
              </motion.button>
            </div>

            {showPlatforms && (
              <motion.div
                className="streaming-platforms-box"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: '12px', width: '100%' }}
              >
                <p className="platform-title">🎬 Nereden İzleyebilirsin?</p>
                <div className="platform-buttons-row">
                  <a
                    href={`https://www.netflix.com/search?q=${movieSearchQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-btn netflix-btn"
                  >
                    🔴 Netflix'te Arit
                  </a>
                  <a
                    href={`https://www.primevideo.com/search/ref=atv_sr_sug?phrase=${movieSearchQuery}`}
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

            <div className="modal-actions" style={{ marginTop: '16px' }}>
              {isLiked && onRemoveLiked && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  className="modal-remove-button"
                  onClick={() => onRemoveLiked(movie.id)}
                >
                  🗑️ Beğenilerden Çıkar
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                className="modal-close-button"
                onClick={onClose}
              >
                Kapat
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MovieModal