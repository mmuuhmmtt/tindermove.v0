function MovieModal({ movie, onClose }) {
  if (!movie) return null

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  const year = movie.release_date ? movie.release_date.split('-')[0] : ''

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={posterUrl} alt={movie.title} className="modal-poster" />
        <h2>{movie.title} ({year})</h2>
        <p className="modal-rating">⭐ {movie.vote_average?.toFixed(1)}</p>
        <p>{movie.overview}</p>
        <button onClick={onClose}>Kapat</button>
      </div>
    </div>
  )
}

export default MovieModal