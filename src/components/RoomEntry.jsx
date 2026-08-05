import { generateRoomCode } from '../roomUtils'

function RoomEntry({ onJoinSolo }) {
  const handleCreateRoom = () => {
    const newCode = generateRoomCode()
    window.location.search = `?room=${newCode}`
  }

  return (
    <div className="room-entry">
      <h1>SwipeMovie 🎬</h1>
      <p>Arkadaşınla ortak film bulun</p>

      <button onClick={handleCreateRoom} className="primary-button">
        🎉 Oda Oluştur
      </button>

      <button onClick={onJoinSolo} className="secondary-button">
        Tek başıma kullan
      </button>
    </div>
  )
}

export function JoinRoomScreen({ roomCode, onJoin }) {
  return (
    <div className="room-entry">
      <h1>SwipeMovie 🎬</h1>
      <p>Bir arkadaşın seni <strong>{roomCode}</strong> odasına davet etti!</p>
      <button onClick={onJoin} className="primary-button">
        Odaya Katıl
      </button>
    </div>
  )
}

export default RoomEntry