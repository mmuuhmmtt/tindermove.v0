import { useState } from 'react'
import { generateRoomCode } from '../roomUtils'
import AvatarSelector from './AvatarSelector'

function RoomEntry({ onJoinSolo, onJoinRoom }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('swipemovie_userName') || '')
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('swipemovie_userAvatar') || '🍿')
  const [roomMode, setRoomMode] = useState('normal')

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

      <AvatarSelector
        selectedAvatar={userAvatar}
        onSelectAvatar={setUserAvatar}
      />

      <div className="mode-selector-box">
        <p className="mode-title">Oda Modunu Seçin:</p>
        <div className="mode-buttons-row">
          <button
            className={`mode-btn ${roomMode === 'normal' ? 'active' : ''}`}
            onClick={() => setRoomMode('normal')}
          >
            🍿 Normal Mod
          </button>
          <button
            className={`mode-btn ${roomMode === 'couple' ? 'active' : ''}`}
            onClick={() => setRoomMode('couple')}
          >
            👩‍❤️‍👨 Çift Modu (3'er Seçim)
          </button>
        </div>
      </div>

      <button onClick={handleCreateRoom} className="primary-button">
        🎉 Oda Oluştur
      </button>

      <button onClick={handleSolo} className="secondary-button" style={{ marginTop: '10px' }}>
        Tek başıma kullan
      </button>
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
      <p>Bir arkadaşın seni <strong>{roomCode}</strong> odasına davet etti!</p>

      {roomMode === 'couple' && (
        <div style={{ background: 'rgba(236, 72, 153, 0.2)', border: '1px solid rgba(236, 72, 153, 0.4)', padding: '6px 14px', borderRadius: '50px', color: '#f472b6', fontSize: '13px', fontWeight: '700', margin: '8px 0 16px', display: 'inline-block' }}>
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

      <AvatarSelector
        selectedAvatar={userAvatar}
        onSelectAvatar={setUserAvatar}
      />

      <button onClick={handleJoin} className="primary-button">
        Odaya Katıl
      </button>
    </div>
  )
}

export default RoomEntry