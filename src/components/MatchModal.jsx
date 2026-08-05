import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function MatchModal({ matchMovie, onClose }) {
  const [readyToWatch, setReadyToWatch] = useState(false)

  if (!matchMovie) return null

  const posterUrl = matchMovie.poster_path ? `https://image.tmdb.org/t/p/w500${matchMovie.poster_path}` : ''
  const userNamesText = matchMovie.userNames && matchMovie.userNames.length > 0
    ? matchMovie.userNames.slice(0, 2).join(' & ')
    : 'İkiniz'

  const movieSearchQuery = encodeURIComponent(`${matchMovie.title} izle`)
  const googleSearchUrl = `https://www.google.com/search?q=${movieSearchQuery}`

  return (
    <AnimatePresence>
      <motion.div
        className="match-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="match-modal-content"
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <div className="match-stars">🎉 ✨ 🎬 ✨ 🎉</div>
          <h1 className="match-title">IT'S A MATCH!</h1>
          <h2 className="match-subtitle">{userNamesText} Eşleştiniz!</h2>
          <p className="match-desc">
            İkiniz de bu filmi beğendiniz! Bu gece ne izleyeceğiniz belli oldu:
          </p>

          <div className="match-poster-wrapper">
            <img src={posterUrl} alt={matchMovie.title} className="match-modal-poster" />
            <div className="match-movie-title">{matchMovie.title}</div>
          </div>

          {!readyToWatch ? (
            <div className="match-modal-buttons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="primary-button match-watch-btn"
                onClick={() => setReadyToWatch(true)}
              >
                🍿 İzlemeye Hazır mısın?
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="secondary-button match-continue-btn"
                onClick={onClose}
              >
                🔥 Kaydırmaya Devam Et
              </motion.button>
            </div>
          ) : (
            <motion.div
              className="streaming-platforms-box"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="platform-title">🎉 Harika! Filmi İzleme Bağlantıları:</p>
              <div className="platform-buttons-row">
                <a
                  href={`https://www.netflix.com/search?q=${movieSearchQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="platform-btn netflix-btn"
                >
                  🔴 Netflix
                </a>
                <a
                  href={`https://www.primevideo.com/search/ref=atv_sr_sug?phrase=${movieSearchQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="platform-btn prime-btn"
                >
                  🔵 Prime Video
                </a>
                <a
                  href={googleSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="platform-btn google-btn"
                >
                  🔍 Google'da Bul
                </a>
              </div>

              <button className="secondary-button" onClick={onClose} style={{ marginTop: '16px' }}>
                Kapat & Kaydırmaya Devam Et
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MatchModal
