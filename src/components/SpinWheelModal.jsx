import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SpinWheelModal({ isOpen, onClose, movies, onSelectWinner }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState(null)

  if (!isOpen) return null

  const items = movies && movies.length > 0 ? movies.slice(0, 8) : []

  const handleSpin = () => {
    if (spinning || items.length === 0) return

    setSpinning(true)
    setWinner(null)

    // 5 tam tur + rastgele açı (1800deg - 2160deg)
    const randomDegree = 1800 + Math.floor(Math.random() * 360)
    const newRotation = rotation + randomDegree
    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      const degreesPerItem = 360 / items.length
      const normalizedDegree = (360 - (newRotation % 360)) % 360
      const selectedIndex = Math.floor(normalizedDegree / degreesPerItem)
      const selectedMovie = items[selectedIndex] || items[0]
      setWinner(selectedMovie)
    }, 3200)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex: 260 }}
      >
        <motion.div
          className="wheel-modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <button className="modal-close" onClick={onClose}>✕</button>

          <h2 className="wheel-title">🎲 Kararsızlık Çarkı</h2>
          <p className="wheel-subtitle">Şansına ne çıkarsa bu gece onu izliyorsunuz!</p>

          {items.length === 0 ? (
            <p style={{ color: '#94a3b8', margin: '30px 0' }}>
              Çarkı çevirmek için önce en az 1 film beğenmelisiniz! 🍿
            </p>
          ) : (
            <>
              <div className="wheel-container">
                <div className="wheel-pointer">▼</div>
                <motion.div
                  className="wheel-disc"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 3.2, ease: [0.15, 0.85, 0.35, 1] }}
                >
                  {items.map((movie, idx) => {
                    const angle = (360 / items.length) * idx
                    return (
                      <div
                        key={movie.id}
                        className="wheel-slice"
                        style={{
                          transform: `rotate(${angle}deg)`
                        }}
                      >
                        <span className="wheel-slice-text">{movie.title}</span>
                      </div>
                    )
                  })}
                </motion.div>
              </div>

              {winner && (
                <motion.div
                  className="wheel-winner-box"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <p className="winner-label">🎉 BU GECEKİ FİLMİNİZ:</p>
                  <h3 className="winner-title">{winner.title}</h3>
                  <button
                    className="primary-button"
                    onClick={() => {
                      onClose()
                      if (onSelectWinner) onSelectWinner(winner)
                    }}
                    style={{ marginTop: '10px' }}
                  >
                    🍿 Filmi İncele & İzle
                  </button>
                </motion.div>
              )}

              {!winner && (
                <button
                  className="primary-button spin-btn"
                  onClick={handleSpin}
                  disabled={spinning}
                >
                  {spinning ? '🌀 Çark Dönüyor...' : '🎯 Çarkı Çevir!'}
                </button>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SpinWheelModal
