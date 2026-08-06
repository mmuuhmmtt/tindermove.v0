import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLICE_OVERLAY_COLORS = [
  '#0066ff', // Electric Blue
  '#ec4899', // Rose Pink
  '#10b981', // Emerald Green
  '#f59e0b', // Amber Gold
  '#8b5cf6', // Vivid Purple
  '#06b6d4'  // Cyan Teal
]

function getPieSlicePath(cx, cy, radius, startAngleDegree, endAngleDegree) {
  const startRad = (startAngleDegree - 90) * (Math.PI / 180)
  const endRad = (endAngleDegree - 90) * (Math.PI / 180)

  const x1 = cx + radius * Math.cos(startRad)
  const y1 = cy + radius * Math.sin(startRad)
  const x2 = cx + radius * Math.cos(endRad)
  const y2 = cy + radius * Math.sin(endRad)

  const largeArcFlag = endAngleDegree - startAngleDegree > 180 ? 1 : 0

  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

function preloadPosters(items) {
  return Promise.all(
    items.map((m) => {
      return new Promise((resolve) => {
        if (!m || !m.poster_path) return resolve()
        const img = new Image()
        img.src = `https://image.tmdb.org/t/p/w200${m.poster_path}`
        img.onload = () => resolve()
        img.onerror = () => resolve()
      })
    })
  )
}

async function fetchWheelMovies(likedMovies, popularMovies) {
  const uniqueMap = new Map()

  if (Array.isArray(likedMovies)) {
    likedMovies.forEach((m) => {
      if (m && m.id && m.poster_path) uniqueMap.set(m.id, m)
    })
  }

  if (Array.isArray(popularMovies)) {
    popularMovies.forEach((m) => {
      if (m && m.id && m.poster_path) uniqueMap.set(m.id, m)
    })
  }

  // Arka planda minimum 6 posterli film havuzu garantile
  if (uniqueMap.size < 6) {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY || '164bcd014a73abb83232a29f536ee142'
    const randomPage = Math.floor(Math.random() * 20) + 1
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=tr-TR&page=${randomPage}&sort_by=popularity.desc&vote_count.gte=100`
      )
      const data = await res.json()
      if (data && Array.isArray(data.results)) {
        data.results.forEach((m) => {
          if (m && m.id && m.poster_path) uniqueMap.set(m.id, m)
        })
      }
    } catch (err) {
      console.error('Çark için film çekilirken hata:', err)
    }
  }

  const pool = Array.from(uniqueMap.values())
  if (pool.length < 6) return null

  // Fisher-Yates karıştırma ile rastgele 6 film seç
  const shuffled = [...pool]
  for (let pass = 0; pass < 3; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
  }

  return shuffled.slice(0, 6)
}

function SpinWheelModal({ isOpen, onClose, movies, likedMovies, onSelectWinner }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState(null)
  const [isSpinStarted, setIsSpinStarted] = useState(false)
  const [wheelItems, setWheelItems] = useState([])
  const [loadingWheel, setLoadingWheel] = useState(false)
  const [hasEnoughMovies, setHasEnoughMovies] = useState(true)

  const initWheelData = async () => {
    setLoadingWheel(true)
    const items = await fetchWheelMovies(likedMovies, movies)

    if (!items || items.length < 6) {
      setHasEnoughMovies(false)
      setWheelItems([])
      setLoadingWheel(false)
      return
    }

    await preloadPosters(items)

    setHasEnoughMovies(true)
    setWheelItems(items)
    setWinner(null)
    setSpinning(false)
    setIsSpinStarted(false) // Başlangıçta gizli/bulanık kalır
    setLoadingWheel(false)
  }

  useEffect(() => {
    if (isOpen) {
      initWheelData()
    }
  }, [isOpen])

  if (!isOpen) return null

  const items = wheelItems

  const handleSpin = () => {
    if (spinning || items.length < 6) return

    setIsSpinStarted(true)
    setSpinning(true)
    setWinner(null)

    // 5 tam tur + rastgele duruş açısı
    const randomDegree = 1800 + Math.floor(Math.random() * 360)
    const newRotation = rotation + randomDegree
    setRotation(newRotation)

    // Çarktaki mevcut 6 film üzerinden duruş açısı ve kazanan indeksini tam eşleştir
    const currentItems = [...items]
    const degreesPerItem = 360 / currentItems.length
    const normalizedDegree = (360 - (newRotation % 360)) % 360
    const selectedIndex = Math.floor(normalizedDegree / degreesPerItem) % currentItems.length
    const selectedMovie = currentItems[selectedIndex] || currentItems[0]

    setTimeout(() => {
      setSpinning(false)
      setWinner(selectedMovie)
    }, 5200)
  }

  const cx = 130
  const cy = 130
  const radius = 125
  const anglePerSlice = items.length > 0 ? 360 / items.length : 60

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
          className="wheel-modal-content clean-wheel-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>

          <h2 className="wheel-title">🎲 Kararsızlık Çarkı</h2>
          <p className="wheel-subtitle">
            {loadingWheel
              ? '🖼️ Sürpriz film posterleri çarka işleniyor...'
              : !isSpinStarted
              ? '🔒 Gizli çarkı çevir, film posterleri açılarak dönsün!'
              : winner
              ? '🎉 BU GECEKİ FİLMİNİZ SEÇİLDİ!'
              : '🌀 Çark yavaşlayıp duruyor...'}
          </p>

          {loadingWheel ? (
            <div className="wheel-loading-box">
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p>Film posterleri çark dilimlerine yerleştiriliyor...</p>
            </div>
          ) : !hasEnoughMovies ? (
            <div className="wheel-empty-box">
              <div className="empty-icon">🍿</div>
              <h3>Çark İçin Birkaç Film Daha Keşfet 🎬</h3>
              <p>Çarkın dönebilmesi için sistemde en az 6 posterli film bulunmalıdır.</p>
              <button className="primary-button" onClick={onClose} style={{ marginTop: '16px' }}>
                Anladım, Filmlere Dön
              </button>
            </div>
          ) : (
            <div className="clean-wheel-wrapper">
              {/* Poster Kırpmalı Vektör Çark */}
              <div className="wheel-container">
                <div className="wheel-pointer">▼</div>
                <motion.div
                  className="wheel-disc-svg"
                  animate={{
                    rotate: rotation,
                    filter: isSpinStarted ? 'blur(0px) brightness(1)' : 'blur(7px) brightness(0.65)'
                  }}
                  transition={{
                    rotate: { duration: 5.2, ease: [0.22, 0.7, 0.1, 1] },
                    filter: { duration: 0.8 }
                  }}
                >
                  <svg width="260" height="260" viewBox="0 0 260 260" style={{ display: 'block' }}>
                    <defs>
                      {items.map((movie, idx) => {
                        const startAngle = idx * anglePerSlice
                        const endAngle = (idx + 1) * anglePerSlice
                        const pathData = getPieSlicePath(cx, cy, radius, startAngle, endAngle)
                        return (
                          <clipPath id={`poster-clip-${idx}`} key={idx}>
                            <path d={pathData} />
                          </clipPath>
                        )
                      })}
                    </defs>

                    {items.map((movie, idx) => {
                      const startAngle = idx * anglePerSlice
                      const endAngle = (idx + 1) * anglePerSlice
                      const overlayColor = SLICE_OVERLAY_COLORS[idx % SLICE_OVERLAY_COLORS.length]
                      const pathData = getPieSlicePath(cx, cy, radius, startAngle, endAngle)
                      const posterUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`

                      const midAngle = (idx + 0.5) * anglePerSlice
                      const midRad = (midAngle - 90) * (Math.PI / 180)
                      const rCenter = radius * 0.52
                      const centerX = cx + rCenter * Math.cos(midRad)
                      const centerY = cy + rCenter * Math.sin(midRad)

                      const imgW = 170
                      const imgH = 220
                      const imgX = centerX - imgW / 2
                      const imgY = centerY - imgH / 2

                      return (
                        <g key={movie.id || idx}>
                          <image
                            href={posterUrl}
                            x={imgX}
                            y={imgY}
                            width={imgW}
                            height={imgH}
                            preserveAspectRatio="xMidYMin slice"
                            clipPath={`url(#poster-clip-${idx})`}
                          />

                          <path d={pathData} fill={overlayColor} opacity="0.14" />
                          <path d={pathData} fill="none" stroke="#0f172a" strokeWidth="2.5" />
                        </g>
                      )
                    })}

                    <circle cx={cx} cy={cy} r="22" fill="#0f172a" stroke="#00d2ff" strokeWidth="3.5" />
                    <circle cx={cx} cy={cy} r="8" fill="#00d2ff" />
                  </svg>
                </motion.div>

                {/* Gizli mod placeholder ikonu */}
                {!isSpinStarted && (
                  <motion.div
                    className="wheel-mystery-badge"
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                  >
                    🎭
                  </motion.div>
                )}
              </div>

              {!winner ? (
                <button
                  className="primary-button spin-btn"
                  onClick={handleSpin}
                  disabled={spinning}
                  style={{ marginTop: '18px', maxWidth: '280px' }}
                >
                  {spinning ? '🌀 Çark Dönüyor...' : '🎯 Çarkı Çevir!'}
                </button>
              ) : (
                <button
                  className="secondary-button"
                  onClick={handleSpin}
                  disabled={spinning}
                  style={{ marginTop: '14px', fontSize: '13px', padding: '10px 22px', width: 'auto' }}
                >
                  🔄 Tekrar Çevir 🎲
                </button>
              )}
            </div>
          )}

          {/* Sığma ve Taşma Sorunu Çözülmüş Sonuç Kartı */}
          {winner && (
            <motion.div
              className="wheel-winner-box"
              initial={{ scale: 0.82, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >
              <div className="winner-header-tag">🎉 BU GECEKİ FİLMİNİZ:</div>

              {/* Kompakt Görsel Rozet */}
              <div className="wheel-winner-poster-wrapper">
                <img
                  src={`https://image.tmdb.org/t/p/w500${winner.poster_path}`}
                  alt={winner.title}
                  className="wheel-winner-poster"
                />
              </div>

              <h3 className="winner-title">{winner.title}</h3>
              {winner.overview && <p className="winner-overview">{winner.overview}</p>}

              <button
                className="primary-button"
                onClick={() => {
                  onClose()
                  if (onSelectWinner) onSelectWinner(winner)
                }}
                style={{ marginTop: '10px', width: '100%', maxWidth: '240px' }}
              >
                🍿 Filmi İncele & İzle
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SpinWheelModal
