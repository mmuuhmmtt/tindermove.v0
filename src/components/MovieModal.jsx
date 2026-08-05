import { motion, AnimatePresence } from 'framer-motion'

function MovieModal({ movie, onClose, onRemoveLiked, isLiked }) {
  const posterUrl = movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''
  const year = movie?.release_date ? movie.release_date.split('-')[0] : ''

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
            <div className="modal-actions">
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