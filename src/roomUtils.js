export function getUserId() {
  let userId = localStorage.getItem('swipemovie_userId')
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 10)
    localStorage.setItem('swipemovie_userId', userId)
  }
  return userId
}

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function getRoomFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('room')
}