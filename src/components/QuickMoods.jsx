import { motion } from 'framer-motion'

const MOOD_PRESETS = [
  { id: 'all', name: '🔥 Popüler', filters: { genre: null, minRating: 0, maxRuntime: null } },
  { id: 'short', name: '⏱️ 90 Dk Altı', filters: { genre: null, minRating: 6.5, maxRuntime: 95 } },
  { id: 'top', name: '🍿 IMDb 8+', filters: { genre: null, minRating: 8.0, maxRuntime: null } },
  { id: 'comedy', name: '😂 Komedi', filters: { genre: 35, minRating: 6.0, maxRuntime: null } },
  { id: 'thriller', name: '🤯 Beyin Yakan', filters: { genre: 53, minRating: 7.0, maxRuntime: null } },
  { id: 'romance', name: '❤️ Romantik', filters: { genre: 10749, minRating: 6.5, maxRuntime: null } }
]

function QuickMoods({ activeMood, onSelectMood }) {
  return (
    <div className="quick-moods-wrapper">
      <div className="quick-moods-container">
        <div className="quick-moods-scroll">
          {MOOD_PRESETS.map((m) => {
            const isActive = activeMood === m.id
            return (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mood-chip ${isActive ? 'active' : ''}`}
                onClick={() => onSelectMood(m.id, m.filters)}
              >
                {m.name}
              </motion.button>
            )
          })}
        </div>
      </div>
      <div className="scroll-fade-right" />
    </div>
  )
}

export default QuickMoods
