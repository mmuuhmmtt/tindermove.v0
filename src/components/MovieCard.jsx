import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

function MovieCard({ movie, onSwipe, onCardClick, isTop }) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  const year = movie.release_date ? movie.release_date.split('-')[0] : ''

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0])

  const handleDragEnd = async (event, info) => {
    const swipeDistance = info.offset.x

    if (swipeDistance > 100) {
      await animate(x, 500, { duration: 0.3 })
      onSwipe('right')
    } else if (swipeDistance < -100) {
      await animate(x, -500, { duration: 0.3 })
      onSwipe('left')
    } else {
      animate(x, 0, { duration: 0.3 })
    }
  }

  return (
    <motion.div
      className="movie-card"
      style={{ x, rotate, position: 'absolute' }}
      drag={isTop ? 'x' : false}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.03 }}
      onTap={() => isTop && onCardClick(movie)}
      initial={{ scale: 0.95, opacity: 0.6 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.6 }}
      transition={{ duration: 0.25 }}
    >
      {isTop && (
        <>
          <motion.div className="stamp like-stamp" style={{ opacity: likeOpacity }}>BEĞEN</motion.div>
          <motion.div className="stamp nope-stamp" style={{ opacity: nopeOpacity }}>GEÇ</motion.div>
        </>
      )}
      <img src={posterUrl} alt={movie.title} className="movie-poster" draggable="false" />
      <div className="card-gradient" />
      <div className="movie-info">
        <h2>{movie.title} <span className="year-tag">{year}</span></h2>
        <p className="card-overview">{movie.overview}</p>
      </div>
    </motion.div>
  )
}

export default MovieCard