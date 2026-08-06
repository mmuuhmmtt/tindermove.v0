import { motion, AnimatePresence } from 'framer-motion'

function CoupleInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null

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
          className="couple-info-modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 25 }}
          transition={{ type: 'spring', stiffness: 320, damping: 25 }}
        >
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>

          <div className="couple-info-header">
            <span className="couple-info-icon">👩‍❤️‍👨</span>
            <h2 className="couple-info-title">Çift Moduna Hoş Geldiniz!</h2>
            <p className="couple-info-subtitle">Birlikte ne izleyeceğinize kararsız kalmaya son!</p>
          </div>

          <div className="couple-steps-list">
            <div className="couple-step-item">
              <div className="step-num-badge">1</div>
              <div className="step-text-content">
                <h4>🍿 3'er Film Beğenin</h4>
                <p>Sen ve partnerin filmleri sağa kaydırarak 3'er favori filminizi seçin.</p>
              </div>
            </div>

            <div className="couple-step-item">
              <div className="step-num-badge">2</div>
              <div className="step-text-content">
                <h4>🎯 Ortak Eşleşme Yakalayın</h4>
                <p>İkiniz de 3 hakkınızı doldurduğunda sistem ikinizin de beğendiği filmi otomatik belirler!</p>
              </div>
            </div>

            <div className="couple-step-item">
              <div className="step-num-badge">3</div>
              <div className="step-text-content">
                <h4>📋 Oda Linkini Paylaşın</h4>
                <p>Partnerin henüz odaya katılmadıysa, üstteki <strong>"📋 Link Kopyala"</strong> butonuyla linki gönder.</p>
              </div>
            </div>
          </div>

          <button
            className="primary-button couple-info-start-btn"
            onClick={onClose}
            style={{ marginTop: '20px', width: '100%' }}
          >
            💖 Anladım, Başlayalım!
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CoupleInfoModal
