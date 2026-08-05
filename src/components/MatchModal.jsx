import { motion, AnimatePresence } from 'framer-motion'

function MatchModal({ matchMovie, onClose }) {
  if (!matchMovie) return null

  const posterUrl = matchMovie.poster_path ? `https://image.tmdb.org/t/p/w500${matchMovie.poster_path}` : ''

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
          <h2 className="match-subtitle">EŞLEŞTİNİZ!</h2>
          <p className="match-desc">
            İkiniz de bu filmi beğendiniz! Bu gece ne izleyeceğiniz belli oldu:
          </p>

          <div className="match-poster-wrapper">
            <img src={posterUrl} alt={matchMovie.title} className="match-modal-poster" />
            <div className="match-movie-title">{matchMovie.title}</div>
          </div>

          <div className="match-modal-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="primary-button match-continue-btn"
              onClick={onClose}
            >
              🔥 Kaydırmaya Devam Et
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MatchModal
