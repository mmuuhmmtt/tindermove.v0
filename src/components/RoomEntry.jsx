import { useState } from 'react'
import { generateRoomCode } from '../roomUtils'

function RoomEntry({ onJoinSolo }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('swipemovie_userName') || '')

  const saveName = () => {
    const finalName = userName.trim() || 'Gizemli İzleyici'
    localStorage.setItem('swipemovie_userName', finalName)
  }

  const handleCreateRoom = () => {
    saveName()
    const newCode = generateRoomCode()
    window.location.search = `?room=${newCode}`
  }

  const handleSolo = () => {
    saveName()
    onJoinSolo()
  }

  return (
    <div className="room-entry">
      <h1>SwipeMovie 🎬</h1>
      <p>Arkadaşınla veya sevgilinle ortak film bul!</p>

      <div className="name-input-group">
        <input
          type="text"
          placeholder="İsminiz (Örn: Muhammet)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="name-input"
        />
      </div>

      <button onClick={handleCreateRoom} className="primary-button">
        🎉 Oda Oluştur
      </button>

      <button onClick={handleSolo} className="secondary-button">
        Tek başıma kullan
      </button>
    </div>
  )
}

export function JoinRoomScreen({ roomCode, onJoin }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('swipemovie_userName') || '')

  const handleJoin = () => {
    const finalName = userName.trim() || 'Davetli İzleyici'
    localStorage.setItem('swipemovie_userName', finalName)
    onJoin()
  }

  return (
    <div className="room-entry">
      <h1>SwipeMovie 🎬</h1>
      <p>Bir arkadaşın seni <strong>{roomCode}</strong> odasına davet etti!</p>

      <div className="name-input-group">
        <input
          type="text"
          placeholder="İsminiz (Örn: Ayşe)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="name-input"
        />
      </div>

      <button onClick={handleJoin} className="primary-button">
        Odaya Katıl
      </button>
    </div>
  )
}

export default RoomEntry