const GENRES = [
  { id: null, name: 'Tümü' },
  { id: 28, name: 'Aksiyon' },
  { id: 35, name: 'Komedi' },
  { id: 27, name: 'Korku' },
  { id: 18, name: 'Dram' },
  { id: 10749, name: 'Romantik' },
  { id: 878, name: 'Bilim Kurgu' },
  { id: 16, name: 'Animasyon' },
  { id: 53, name: 'Gerilim' },
]

function FilterModal({ filters, onApply, onClose }) {
  const handleGenreClick = (genreId) => {
    onApply({ ...filters, genre: genreId })
  }

  const handleRatingChange = (e) => {
    onApply({ ...filters, minRating: Number(e.target.value) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Filtrele</h2>

        <p className="filter-label">Tür</p>
        <div className="genre-grid">
          {GENRES.map((g) => (
            <button
              key={g.id ?? 'all'}
              className={`genre-chip ${filters.genre === g.id ? 'active' : ''}`}
              onClick={() => handleGenreClick(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>

        <p className="filter-label">Minimum IMDb Puanı: {filters.minRating}</p>
        <input
          type="range"
          min="0"
          max="9"
          step="0.5"
          value={filters.minRating}
          onChange={handleRatingChange}
          className="rating-slider"
        />

        <button onClick={onClose} className="primary-button">Uygula</button>
      </div>
    </div>
  )
}

export default FilterModal