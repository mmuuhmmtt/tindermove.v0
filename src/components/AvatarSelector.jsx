import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const AVATARS = {
  male: [
    { emoji: '👨‍💼', label: 'Jöntürk' },
    { emoji: '👨‍🎤', label: 'Rockstar' },
    { emoji: '🤠', label: 'Kovboy' },
    { emoji: '🕵️‍♂️', label: 'Dedektif' },
    { emoji: '🦸‍♂️', label: 'Süper Hero' },
    { emoji: '🤴', label: 'Prens' }
  ],
  female: [
    { emoji: '👩‍💼', label: 'Stil Sahibi' },
    { emoji: '👩‍🎤', label: 'Popstar' },
    { emoji: '💃', label: 'Kraliçe' },
    { emoji: '🕵️‍♀️', label: 'Gizemli' },
    { emoji: '🦸‍♀️', label: 'Süper Kadın' },
    { emoji: '👸', label: 'Prenses' }
  ],
  fun: [
    { emoji: '🍿', label: 'Mısır Canavarı' },
    { emoji: '🎬', label: 'Yönetmen' },
    { emoji: '😎', label: 'Cool' },
    { emoji: '👽', label: 'Uzaylı' },
    { emoji: '🦁', label: 'Aslan' },
    { emoji: '🚀', label: 'Astronot' }
  ]
}

function processImageFile(file, callback) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const targetSize = 140
      canvas.width = targetSize
      canvas.height = targetSize

      const minDim = Math.min(img.width, img.height)
      const sx = (img.width - minDim) / 2
      const sy = (img.height - minDim) / 2

      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
      callback(compressedDataUrl)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function AvatarSelector({ selectedAvatar, onSelectAvatar }) {
  const [tab, setTab] = useState(() => (selectedAvatar && selectedAvatar.startsWith('data:image/') ? 'upload' : 'male'))
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file, (dataUrl) => {
        onSelectAvatar(dataUrl)
      })
    }
  }

  const isCustomPhoto = selectedAvatar && selectedAvatar.startsWith('data:image/')

  return (
    <div className="avatar-selector-box">
      <div className="avatar-tabs">
        <button
          className={`avatar-tab ${tab === 'male' ? 'active' : ''}`}
          onClick={() => setTab('male')}
          title="Erkek Avatarları"
        >
          ♂️
        </button>
        <button
          className={`avatar-tab ${tab === 'female' ? 'active' : ''}`}
          onClick={() => setTab('female')}
          title="Kadın Avatarları"
        >
          ♀️
        </button>
        <button
          className={`avatar-tab ${tab === 'fun' ? 'active' : ''}`}
          onClick={() => setTab('fun')}
          title="Eğlenceli Avatarlar"
        >
          🍿
        </button>
        <button
          className={`avatar-tab ${tab === 'upload' ? 'active' : ''}`}
          onClick={() => {
            setTab('upload')
            if (!isCustomPhoto && fileInputRef.current) {
              fileInputRef.current.click()
            }
          }}
          title="Fotoğraf Yükle"
        >
          📷 Fotoğraf
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {tab === 'upload' ? (
        <div className="custom-photo-upload-box">
          {isCustomPhoto ? (
            <div className="custom-photo-preview-container">
              <img src={selectedAvatar} alt="Özel Avatar" className="custom-avatar-circle" />
              <div className="custom-photo-actions">
                <button
                  type="button"
                  className="secondary-button"
                  style={{ padding: '8px 16px', fontSize: '12px', width: 'auto', marginTop: 0 }}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  📸 Fotoğrafı Değiştir
                </button>
                <button
                  type="button"
                  className="avatar-reset-btn"
                  onClick={() => onSelectAvatar('🍿')}
                >
                  ✕ Emojiye Dön
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="upload-dropzone"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <div className="upload-icon">📸</div>
              <p className="upload-title">Galeriden Fotoğraf Seç</p>
              <span className="upload-subtitle">Profilinde görünmesini istediğin resmi yükle</span>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="avatar-grid">
          {AVATARS[tab].map((item) => {
            const isSelected = selectedAvatar === item.emoji
            return (
              <motion.button
                key={item.emoji}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                className={`avatar-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectAvatar(item.emoji)}
                title={item.label}
              >
                <span className="avatar-emoji">{item.emoji}</span>
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AvatarSelector
