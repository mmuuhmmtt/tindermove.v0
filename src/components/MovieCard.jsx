import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

function MovieCard({ movie, onSwipe, onCardClick, isTop }) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  const year = movie.release_date ? movie.release_date.split('-')[0] : ''

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18])
  const likeOpacity = useTransform(x, [15, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, -15], [1, 0])
  const likeScale = useTransform(x, [15, 100], [0.85, 1.1])
  const nopeScale = useTransform(x, [-100, -15], [1.1, 0.85])

  const handleDragEnd = async (event, info) => {
    const swipeDistance = info.offset.x
    const velocity = info.velocity.x

    if (swipeDistance > 100 || velocity > 400) {
      await animate(x, 600, { type: 'spring', stiffness: 300, damping: 25, velocity })
      onSwipe('right')
    } else if (swipeDistance < -100 || velocity < -400) {
      await animate(x, -600, { type: 'spring', stiffness: 300, damping: 25, velocity })
      onSwipe('left')
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 28 })
    }
  }

  return (
    <motion.div
      className="movie-card"
      style={{
        x,
        rotate,
        position: 'absolute',
        transformTemplate: ({ x, rotate }) => `translate3d(${x}, 0px, 0px) rotate(${rotate})`
      }}
      drag={isTop ? 'x' : false}
      dragElastic={0.65}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.04, cursor: 'grabbing' }}
      initial={{ scale: 0.93, y: 12, opacity: 0.7 }}
      animate={{
        scale: isTop ? 1 : 0.94,
        y: isTop ? 0 : 12,
        opacity: isTop ? 1 : 0.7
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      {isTop && (
        <>
          <motion.div className="stamp like-stamp" style={{ opacity: likeOpacity, scale: likeScale }}>BEĞEN</motion.div>
          <motion.div className="stamp nope-stamp" style={{ opacity: nopeOpacity, scale: nopeScale }}>GEÇ</motion.div>
        </>
      )}

      {/* IMDb Rating Badge */}
      <div className="rating-badge">
        ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
      </div>

      <img src={posterUrl} alt={movie.title} className="movie-poster" draggable="false" />
      <div className="card-gradient" />

      <div className="movie-info">
        <div className="movie-header-row">
          <h2>
            {movie.title} <span className="year-tag">{year}</span>
          </h2>
          <button
            className="info-icon-btn"
            onClick={(e) => {
              e.stopPropagation()
              onCardClick(movie)
            }}
            title="Detaylar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>
        </div>
        <p className="card-overview">{movie.overview}</p>
      </div>
    </motion.div>
  )
}

export default MovieCard