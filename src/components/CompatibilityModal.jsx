import { motion, AnimatePresence } from 'framer-motion'

function CompatibilityModal({ isOpen, onClose, userNames, matchesCount, totalSwipesCount, likedMovies }) {
  if (!isOpen) return null

  // Uyum yüzdesi hesaplama (Varsayılan %75 - %95 arası tatlı bir eğlenceli oran)
  const basePercent = totalSwipesCount > 0
    ? Math.min(99, Math.max(65, Math.round((matchesCount / Math.max(1, totalSwipesCount / 2)) * 100)))
    : 88

  const namesText = userNames && userNames.length > 0 ? userNames.slice(0, 2).join(' & ') : 'İkiniz'

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex: 250 }}
      >
        <motion.div
          className="compatibility-card-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <button className="modal-close" onClick={onClose}>✕</button>

          <div className="compat-badge-header">
            <span>✨ SWIPEMOVIE MATCH SCORE ✨</span>
          </div>

          <h2 className="compat-names">{namesText}</h2>
          <p className="compat-subtitle">Film Zevki Uyumu</p>

          <div className="compat-score-circle">
            <span className="compat-number">%{basePercent}</span>
            <span className="compat-label">MÜKEMMEL UYUM 🎯</span>
          </div>

          <div className="compat-stats-grid">
            <div className="compat-stat-item">
              <span className="stat-value">🎬 {matchesCount}</span>
              <span className="stat-desc">Ortak Eşleşme</span>
            </div>
            <div className="compat-stat-item">
              <span className="stat-value">🍿 {likedMovies ? likedMovies.length : 0}</span>
              <span className="stat-desc">Beğenilen Film</span>
            </div>
          </div>

          <p className="compat-footer-note">
            "Siz bu gece ne izleyeceğinizi çoktan buldunuz!"
          </p>

          <div className="compat-actions">
            <button
              className="primary-button compat-share-btn"
              onClick={() => {
                const text = `🍿 ${namesText} olarak SwipeMovie'de %${basePercent} Film Uyumuna eriştik! Odana katıl ve sinema geceni planla: https://tindermove-v0.vercel.app`
                if (navigator.share) {
                  navigator.share({ title: 'SwipeMovie Uyum Kartı', text })
                } else {
                  navigator.clipboard.writeText(text)
                  alert('✅ Uyum mesajı kopyalandı! Instagram Story veya WhatsApp\'ta paylaşabilirsin!')
                }
              }}
            >
              📸 Story'de Paylaş / Mesaj At
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CompatibilityModal
