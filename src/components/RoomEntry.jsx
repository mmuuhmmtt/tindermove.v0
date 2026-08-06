import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateRoomCode } from '../roomUtils'
import AvatarSelector from './AvatarSelector'

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.28, ease: 'easeOut' }
  },
  exit: (direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2, ease: 'easeIn' }
  })
}

function RoomEntry({ onJoinSolo, onJoinRoom }) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)

  const [userName, setUserName] = useState(() => localStorage.getItem('swipemovie_userName') || '')
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('swipemovie_userAvatar') || '🍿')
  const [roomMode, setRoomMode] = useState('normal')

  const goToStep = (nextStep) => {
    setDirection(nextStep > step ? 1 : -1)
    setStep(nextStep)
  }

  const saveProfile = () => {
    const finalName = userName.trim() || 'Gizemli İzleyici'
    localStorage.setItem('swipemovie_userName', finalName)
    localStorage.setItem('swipemovie_userAvatar', userAvatar)
  }

  const handleCreateRoom = () => {
    saveProfile()
    const newCode = generateRoomCode()
    if (onJoinRoom) {
      onJoinRoom(newCode, roomMode)
    } else {
      window.location.search = `?room=${newCode}&mode=${roomMode}`
    }
  }

  const handleSolo = () => {
    saveProfile()
    onJoinSolo()
  }

  const handleAvatarSelect = (emoji) => {
    setUserAvatar(emoji)
    setTimeout(() => {
      goToStep(3)
    }, 280)
  }

  const isNameValid = userName.trim().length >= 2

  return (
    <div className="wizard-room-entry">
      <div className="wizard-card">
        {/* Step Progress Header */}
        <div className="wizard-header">
          {step > 1 && (
            <button className="wizard-back-btn" onClick={() => goToStep(step - 1)}>
              ◀ Geri
            </button>
          )}

          <div className="wizard-steps-indicator">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`wizard-step-dot ${s === step ? 'active' : s < step ? 'completed' : ''}`}
                onClick={() => {
                  if (s < step || (s === 2 && isNameValid)) {
                    goToStep(s)
                  }
                }}
              >
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* Animated Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <div className="wizard-badge">Adım 1/4</div>
              <h1 className="wizard-title">Merhaba! Sen kimsin? 👋</h1>
              <p className="wizard-subtitle">Film arkadaşların seni bu isimle tanıyacak.</p>

              <div className="name-input-group" style={{ marginTop: '24px', width: '100%' }}>
                <input
                  type="text"
                  placeholder="İsminiz (Örn: Muhammet)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isNameValid) {
                      goToStep(2)
                    }
                  }}
                  className="name-input wizard-input"
                  autoFocus
                />
              </div>

              <button
                className={`primary-button wizard-next-btn ${!isNameValid ? 'disabled' : ''}`}
                disabled={!isNameValid}
                onClick={() => isNameValid && goToStep(2)}
                style={{ marginTop: '24px' }}
              >
                Devam Et ➔
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <div className="wizard-badge">Adım 2/4</div>
              <h1 className="wizard-title">Bir avatar seç, {userName.trim()}! 🍿</h1>
              <p className="wizard-subtitle">Profilini temsil edecek eğlenceli bir emoji seç.</p>

              <div style={{ marginTop: '16px', width: '100%' }}>
                <AvatarSelector selectedAvatar={userAvatar} onSelectAvatar={handleAvatarSelect} />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <div className="wizard-badge">Adım 3/4</div>
              <h1 className="wizard-title">Nasıl bir deneyim istersin? ✨</h1>
              <p className="wizard-subtitle">Oda modunu seçerek başlayabilirsin.</p>

              <div className="wizard-mode-cards">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`wizard-mode-card ${roomMode === 'normal' ? 'selected' : ''}`}
                  onClick={() => {
                    setRoomMode('normal')
                    setTimeout(() => goToStep(4), 280)
                  }}
                >
                  <div className="mode-card-icon">🍿</div>
                  <div className="mode-card-info">
                    <h3>Normal Mod</h3>
                    <p>Film kaydır, ortak beğenilerde anında eşleş ve filmini seç!</p>
                  </div>
                  <div className="mode-card-radio">{roomMode === 'normal' ? '✓' : ''}</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`wizard-mode-card ${roomMode === 'couple' ? 'selected' : ''}`}
                  onClick={() => {
                    setRoomMode('couple')
                    setTimeout(() => goToStep(4), 280)
                  }}
                >
                  <div className="mode-card-icon">👩‍❤️‍👨</div>
                  <div className="mode-card-info">
                    <h3>Çift Modu (3'er Seçim)</h3>
                    <p>3'er film seçin, sistem adil kazananı otomatik belirlesin!</p>
                  </div>
                  <div className="mode-card-radio">{roomMode === 'couple' ? '✓' : ''}</div>
                </motion.div>
              </div>

              <button
                className="primary-button wizard-next-btn"
                onClick={() => goToStep(4)}
                style={{ marginTop: '20px' }}
              >
                Devam Et ➔
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <div className="wizard-badge">Son Adım</div>
              <h1 className="wizard-title">Hazırsın, {userName.trim()}! 🎬</h1>
              <p className="wizard-subtitle">Profilin oluşturuldu. Artık izleme macerasına başlayabilirsin!</p>

              {/* Profil Özet Kartı */}
              <div className="wizard-summary-card">
                {userAvatar && userAvatar.startsWith('data:image/') ? (
                  <img src={userAvatar} alt="Profil" className="summary-avatar-img" />
                ) : (
                  <span className="summary-avatar">{userAvatar}</span>
                )}
                <div className="summary-info">
                  <h3 className="summary-name">{userName.trim()}</h3>
                  <span className="summary-mode">
                    {roomMode === 'couple' ? '👩‍❤️‍👨 Çift Modu' : '🍿 Normal Mod'}
                  </span>
                </div>
              </div>

              <div className="wizard-action-buttons">
                <button onClick={handleCreateRoom} className="primary-button">
                  🎉 Oda Oluştur
                </button>

                {roomMode !== 'couple' && (
                  <button onClick={handleSolo} className="secondary-button" style={{ marginTop: '10px' }}>
                    Tek başıma kullan
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function JoinRoomScreen({ roomCode, roomMode, onJoin }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('swipemovie_userName') || '')
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('swipemovie_userAvatar') || '🍿')

  const handleJoin = () => {
    const finalName = userName.trim() || 'Davetli İzleyici'
    localStorage.setItem('swipemovie_userName', finalName)
    localStorage.setItem('swipemovie_userAvatar', userAvatar)
    onJoin()
  }

  return (
    <div className="room-entry">
      <h1>SwipeMovie 🎬</h1>
      <p>
        Bir arkadaşın seni <strong>{roomCode}</strong> odasına davet etti!
      </p>

      {roomMode === 'couple' && (
        <div
          style={{
            background: 'rgba(236, 72, 153, 0.2)',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            padding: '6px 14px',
            borderRadius: '50px',
            color: '#f472b6',
            fontSize: '13px',
            fontWeight: '700',
            margin: '8px 0 16px',
            display: 'inline-block'
          }}
        >
          👩‍❤️‍👨 Oda Modu: Çift Modu (3'er Film Seçimi)
        </div>
      )}

      <div className="name-input-group">
        <input
          type="text"
          placeholder="İsminiz (Örn: Ayşe)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="name-input"
        />
      </div>

      <AvatarSelector selectedAvatar={userAvatar} onSelectAvatar={setUserAvatar} />

      <button onClick={handleJoin} className="primary-button">
        Odaya Katıl
      </button>
    </div>
  )
}

export default RoomEntry