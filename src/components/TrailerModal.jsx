import { motion, AnimatePresence } from 'framer-motion'

function TrailerModal({ videoKey, movieTitle, onClose }) {
  if (!videoKey) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex: 300 }}
      >
        <motion.div
          className="trailer-modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 25 }}
        >
          <div className="trailer-header">
            <h3>🎬 {movieTitle} - Fragman</h3>
            <button className="trailer-close-icon" onClick={onClose}>✕</button>
          </div>
          <div className="trailer-iframe-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title={`${movieTitle} Fragmanı`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TrailerModal
