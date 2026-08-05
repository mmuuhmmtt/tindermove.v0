import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMovieTrailerKey } from '../roomUtils'

function CoupleModeModal({
  isOpen,
  onClose,
  mySelections,
  partnerDoc,
  winningData,
  onPlayTrailer
}) {
  const [showPlatforms, setShowPlatforms] = useState(false)

  if (!isOpen) return null

  const myCount = mySelections ? mySelections.length : 0
  const partnerName = partnerDoc ? partnerDoc.userName || 'Partnerin' : 'Partnerin'
  const partnerCount = partnerDoc && Array.isArray(partnerDoc.selections) ? partnerDoc.selections.length : 0

  const isBothReady = myCount >= 3 && partnerCount >= 3
  const winner = isBothReady ? winningData?.winner : null
  const posterUrl = winner?.poster_path ? `https://image.tmdb.org/t/p/w500${winner.poster_path}` : ''
  const movieSearchQuery = winner ? encodeURIComponent(`${winner.title} izle`) : ''

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

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex: 280 }}
      >
        <motion.div
          className="couple-modal-content"
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 320, damping: 25 }}
        >
          {winner ? (
            /* Kazanan Film Ekranı */
            <div className="couple-winner-view">
              <div className="match-stars">🎉 ✨ 👩‍❤️‍👨 ✨ 🎉</div>
              <h1 className="couple-winner-title">BU GECEKİ FİLMİNİZ!</h1>
              <p className="couple-winner-subtitle">İkiniz de 3'er film seçtiniz ve çark bu filmi belirledi:</p>

              <div className="match-poster-wrapper">
                <img src={posterUrl} alt={winner.title} className="match-modal-poster" />
                <div className="match-movie-title">🎬 {winner.title}</div>
              </div>

              <div className="couple-actions">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="primary-button match-watch-btn"
                  onClick={() => setShowPlatforms(!showPlatforms)}
                >
                  🍿 Filmi İzle (Platformlar)
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
                  <p className="platform-title">🎬 Filmi Yayınlayan Platformlar:</p>
                  <div className="platform-buttons-row">
                    <a
                      href={`https://www.netflix.com/search?q=${movieSearchQuery}`}
                      target="_blank"
                      rel="noreferrer"
                      className="platform-btn netflix-btn"
                    >
                      🔴 Netflix'te Arat
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

              <button className="secondary-button" onClick={onClose} style={{ marginTop: '16px' }}>
                Kapat
              </button>
            </div>
          ) : (
            /* Bekleme / İlerleme Ekranı */
            <div className="couple-waiting-view">
              <h2 className="couple-header">👩‍❤️‍👨 Çift Modu Seçimleri</h2>
              <p className="couple-desc">Her ikiniz de 3'er film seçtiğinde sistem kesin filminizi seçecek!</p>

              <div className="couple-progress-grid">
                <div className="couple-progress-card my-progress">
                  <span className="progress-user-title">Senin Seçimlerin</span>
                  <span className="progress-count">{myCount} / 3 🍿</span>
                  <div className="progress-bar-outer">
                    <div className="progress-bar-inner" style={{ width: `${(myCount / 3) * 100}%` }} />
                  </div>
                </div>

                <div className="couple-progress-card partner-progress">
                  <span className="progress-user-title">{partnerName}</span>
                  <span className="progress-count">{partnerCount} / 3 ⏳</span>
                  <div className="progress-bar-outer">
                    <div className="progress-bar-inner partner-bar" style={{ width: `${(partnerCount / 3) * 100}%` }} />
                  </div>
                </div>
              </div>

              {myCount >= 3 ? (
                <div className="couple-complete-box">
                  <div className="spinner" style={{ margin: '0 auto 10px' }} />
                  <p className="complete-msg">🎉 3 filmini seçtin! Partnerinin seçimleri bekleniyor...</p>
                </div>
              ) : (
                <p className="continue-hint">Filmleri sağa kaydırarak 3 hakkını kullanabilirsin ✨</p>
              )}

              <button className="secondary-button" onClick={onClose} style={{ marginTop: '16px' }}>
                Kaydırmaya Devam Et
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CoupleModeModal
