import { useState } from 'react'
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

function AvatarSelector({ selectedAvatar, onSelectAvatar }) {
  const [tab, setTab] = useState('male')

  return (
    <div className="avatar-selector-box">
      <p className="avatar-title">Profil Avataranı Seç:</p>
      
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
      </div>

      <div className="avatar-grid">
        {AVATARS[tab].map((item) => {
          const isSelected = selectedAvatar === item.emoji
          return (
            <motion.button
              key={item.emoji}
              whileHover={{ scale: 1.15 }}
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
    </div>
  )
}

export default AvatarSelector
