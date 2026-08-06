# 🎬 SwipeMovie (TinderMove) - Detaylı Proje Dokümantasyonu

> **Bu doküman hem insan geliştiriciler hem de yapay zeka (LLM / YZ) ajanları için uygulamanın amacını, mimarisini, veri yapısını, bileşenlerini ve geliştirme süreçlerini eksiksiz açıklamak amacıyla hazırlanmıştır.**

---

## 📌 1. Projenin Amacı ve Vizyonu

**SwipeMovie**, arkadaş gruplarının veya çiftlerin *"Ne izlesek?"* kararsızlığını ortadan kaldırmak için geliştirilmiş **Tinder tarzı film eşleşme platformudur**.

Kullanıcılar tıpkı Tinder'da olduğu gibi film kartlarını sağa (beğen) veya sola (pas geç) kaydırır. Aynı odadaki iki veya daha fazla kişi aynı filmi beğendiğinde anında **Eşleşme (Match)** bildirimi tetiklenir ve ortak izlenecek film belirlenmiş olur.

---

## 🛠️ 2. Teknoloji Yığını (Tech Stack)

| Alan | Kullanılan Teknolojiler |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) (Modüler & Hızlı HMR) |
| **Animasyon & Gestures** | [Framer Motion 12](https://www.framer.com/motion/) (Tinder kart sürükleme, modal ve transition efektleri) |
| **Real-time Veritabanı** | [Firebase Firestore 12](https://firebase.google.com/docs/firestore) (Canlı oda senkronizasyonu & swipe dinleyicileri) |
| **Film Veri Kaynağı** | [TMDB API (The Movie Database)](https://www.themoviedb.org/documentation/api) (Trend filmler, kategoriler, puanlar, afişler, fragmanlar) |
| **Mobil Uygulama** | [Capacitor 8](https://capacitorjs.com/) (Android / Cross-platform mobil paketleme) |
| **Tasarım & UI** | Pure CSS3 (Glassmorphism, Dark Mode UI, Mobil Uyumlu Responsive Tasarım) |
| **Kimlik Belirleme** | `sessionStorage` tabanlı benzersiz anonim kullanıcı ID (`usr_xxxx`) ve profil ayarları |

---

## 🌟 3. Temel Özellikler ve Çalışma Mantığı

### 🍿 A. Kullanıcı Profili ve Odalar
- **Profil Özelleştirme:** Kullanıcılar isimlerini girebilir ve eğlenceli emojilerden oluşan avatar seçebilir.
- **Oda Kodları:** 6 haneli benzersiz oda kodları (`generateRoomCode()`) üretilir. URL parametresi (`?room=ABCDEF&mode=couple`) üzerinden oda paylaşılabilir.
- **Solo Modu:** Odaya ihtiyaç duymadan kişisel film keşfi ve liste oluşturma olanağı sağlar.

### 🔥 B. Tinder Tarzı Film Kartları (Swiping)
- **Sürükle & Bırak:** `MovieCard.jsx` bileşeninde `framer-motion` sürükleme yetenekleriyle kartlar sağa (Beğen), sola (Pas) veya yukarı kaydırılabilir.
- **Geri Al (Rewind):** Son yapılan kaydırma işlemini geri alıp bir önceki filme dönme imkanı sağlar.
- **Film Detay Modalı:** Karta tıklandığında filmin özeti, kategorileri, IMDb puanı, yayın tarihi ve fragman butonu açılır.

### ⚡ C. Canlı Firestore Oda Senkronizasyonu (Group Matching)
- Bir odaya girildiğinde Firestore üzerindeki `rooms/{roomCode}/swipes` koleksiyonu `onSnapshot` ile canlı dinlenir.
- Bir film 2 veya daha fazla oda katılımcısı tarafından sağa kaydırıldığında:
  - **`MatchModal`** pop-up'ı ekranda belirir.
  - Eşleşen filmler üst paneldeki eşleşme alanına eklenir.

### 👩‍❤️‍👨 D. Çift Modu (Couple Mode - 3'er Seçim Algoritması)
- Çiftlerin hızlıca ortak karar alması için tasarlanmış özel moddur.
- Her iki taraf da en beğendiği **3 filmi** seçer.
- İki taraf da 3 film seçimini tamamladığında `CoupleModeModal` açılır.
- **Deterministik Kazanan Algoritması (`getDeterministicWinningMovie`):**
  - İki kullanıcının seçtiği 6 filmlik havuzdan, `roomCode` ve film ID'leri ile oluşturulan seed hash sayesinde tarafsız ve adil bir kazanan film belirlenir.

### 🎲 E. İnteraktif Çarkıfelek (Spin Wheel)
- Beğenilen filmler arasından veya mevcut film listesinden rasgele film seçmek için HTML5 Canvas ile çizilen animasyonlu çarkıfelek bileşeni (`SpinWheelModal.jsx`).

### 🎯 F. Zevk Uyumu (Compatibility Calculator)
- Oda içerisindeki eşleşme sayısı ve kaydırma istatistiklerine dayanarak kullanıcıların film zevki uyum yüzdesini hesaplayan bileşen (`CompatibilityModal.jsx`).

### 🏆 H. "Elenmiş Final" Modu (Turnuva / Bracket Mode)
- 8 filmin ikili eşleşmeler halinde "Bu mu, bu mu?" seçimi yaptırılarak 3 turda (Çeyrek Final → Yarı Final → Final) hızlıca tek bir şampiyon filme ulaşmasını sağlayan mod bileşeni (`TournamentModal.jsx`).
- Sadece 7 etkileşimde kesin seçim olanağı sağlar.
- Sonuç ekranında Turnuva Şampiyonu kutlama kartı, Fragman izleme ve "Nerede İzlenir?" platform arama butonları yer alır.

### 🎬 I. YouTube Fragman Desteği
- TMDB API'den film fragmanı YouTube video key'i çekilir (`getMovieTrailerKey`).
- Öncelikle Türkçe fragman aranır, bulunamazsa İngilizce orijinal fragman çekilip `TrailerModal` içinde oynatılır.

---

## 📁 4. Proje Klasör ve Dosya Yapısı

```
tindermove.v0/
├── public/                 # Statik görsel ve favicon varlıkları
├── src/
│   ├── assets/             # İkon ve medya dosyaları
│   ├── components/         # Modüler React UI Bileşenleri
│   │   ├── AvatarSelector.jsx     # Profil avatar seçim menüsü
│   │   ├── CompatibilityModal.jsx # Zevk uyum yüzdesi hesaplayıcı modal
│   │   ├── CoupleModeModal.jsx    # Çift modu 3'er seçim ve kazanan gösterim modalı
│   │   ├── FilterModal.jsx        # Tür, minimum puan ve süre filtreleme modalı
│   │   ├── MatchModal.jsx         # Eşleşme tebrik ekranı animasyonu
│   │   ├── MovieCard.jsx          # Swipe animasyonlu film kartı bileşeni
│   │   ├── MovieModal.jsx         # Film detay ve içerik modalı
│   │   ├── QuickMoods.jsx         # Hızlı ruh hali (Mood) filtre çubuğu
│   │   ├── RoomEntry.jsx          # Oda oluşturma/katılma ve isim giriş ekranları
│   │   ├── SpinWheelModal.jsx     # Canvas çarkıfelek bileşeni
│   │   └── TrailerModal.jsx       # YouTube fragman oynatıcı modal
│   ├── App.css             # Uygulama geneli Dark-mode & Glassmorphism stilleri
│   ├── App.jsx             # Ana durum yönetimi, Firestore & TMDB entegrasyonu
│   ├── firebase.js         # Firebase App ve Firestore veritabanı başlatıcı
│   ├── index.css           # Global reset & CSS variable tanımları
│   ├── main.jsx            # React root mount noktası
│   └── roomUtils.js        # Yardımcı fonksiyonlar (ID üretimi, URL temizleme, Hash algoritması)
├── android/                # Capacitor Android native proje çıktıları
├── capacitor.config.json   # Capacitor mobil uygulama konfigürasyonu
├── index.html              # HTML ana şablonu
├── package.json            # Bağımlılıklar ve npm scriptleri
└── vite.config.js          # Vite yapılandırması
```

---

## 🗄️ 5. Firebase Firestore Veri Yapısı Schema

Firebase Firestore koleksiyon ve doküman mimarisi aşağıdaki gibidir:

### `rooms/{roomCode}`
Oda temel bilgilerini içerir.
```json
{
  "mode": "normal" | "couple",
  "createdAt": "Timestamp"
}
```

### `rooms/{roomCode}/swipes/{swipeId}`
Kullanıcıların kaydırma (swipe) hareketlerini tutar. `swipeId` formatı: `${userId}_${movieId}`
```json
{
  "userId": "usr_abc123",
  "userName": "🍿 Muhammet",
  "movieId": 550,
  "direction": "right",
  "movie": {
    "id": 550,
    "title": "Fight Club",
    "poster_path": "/pB8BMsqvQwM107JuChSTU84P2P5.jpg",
    "overview": "...",
    "release_date": "1999-10-15",
    "vote_average": 8.4
  }
}
```

### `rooms/{roomCode}/coupleSelections/{userId}`
Çift modunda her kullanıcının seçtiği 3 filmi tutar. `docId` formatı: `${userId}`
```json
{
  "userId": "usr_abc123",
  "userName": "🍿 Muhammet",
  "selections": [
    { "id": 550, "title": "Fight Club", "poster_path": "...", "overview": "...", "release_date": "...", "vote_average": 8.4 },
    { "id": 27205, "title": "Inception", "poster_path": "...", "overview": "...", "release_date": "...", "vote_average": 8.4 },
    { "id": 157336, "title": "Interstellar", "poster_path": "...", "overview": "...", "release_date": "...", "vote_average": 8.6 }
  ],
  "updatedAt": 1754520000000
}
```

---

## ⚙️ 6. Geliştirme Ortamı ve Kurulum

### Ortam Değişkenleri (`.env`)
Proje kök dizininde yer alan `.env` dosyası aşağıdaki anahtarları içerir:

```env
VITE_TMDB_API_KEY=164bcd014a73abb83232a29f536ee142
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=swipemovie-ac752.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=swipemovie-ac752
VITE_FIREBASE_STORAGE_BUCKET=swipemovie-ac752.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=305914851008
VITE_FIREBASE_APP_ID=1:305914851008:web:559c779feff43d852d8725
```

### Kurulum ve Çalıştırma Adımları

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirici Sunucusunu (Dev Server) Başlatın:**
   ```bash
   npm run dev
   ```

3. **Production Build Alın:**
   ```bash
   npm run build
   ```

4. **Android Mobil Çıktısı Alın (Capacitor):**
   ```bash
   npx cap sync
   npx cap open android
   ```

---

## 🤖 7. Yapay Zeka (AI Agent / LLM) Geliştirici Kılavuzu

**Proje üzerinde çalışacak diğer Yapay Zeka modellerinin (Claude, ChatGPT, Gemini vb.) dikkat etmesi gereken önemli kurallar:**

1. **Durum Yönetimi (State Management):**
   - Tüm uygulama durumu (`movies`, `currentIndex`, `likedMovies`, `roomCode`, `roomMode`, `matches`, `coupleSelections`) [App.jsx](file:///c:/repo/tindermove.v0/src/App.jsx) bileşeninde yönetilmektedir.
   - Yeni bir modal veya özellik eklendiğinde `App.jsx` üzerindeki state yapısına uyum sağlanmalıdır.

2. **Firestore Abonelikleri (Subscriptions):**
   - Real-time dinleyiciler (`onSnapshot`) `useEffect` içerisinde tanımlanmalı ve bileşen unmount olduğunda veya bağımlılıklar değiştiğinde mutlaka `unsubscribe()` çağrısı döndürülmelidir.
   - Oda kodları büyük harfe (`toUpperCase()`) ve `trim()` işlemine tabi tutularak queried edilmelidir.

3. **Film Veri Formatı (Data Sanitization):**
   - Firestore'a kaydedilecek film objeleri için mutlaka `roomUtils.js` içerisindeki `sanitizeMovie(movie)` fonksiyonu kullanılmalıdır. Bu sayede dairesel referanslar veya lüzumsuz büyük objeler Firestore'a yazılmaz.

4. **Stil ve Tasarım Dili (CSS Rules):**
   - Stil müdahalelerinde [App.css](file:///c:/repo/tindermove.v0/src/App.css) içerisindeki renk paletine (`--bg-primary`, `--accent-pink`, `--accent-orange`, vb.) sadık kalınmalıdır.
   - Mobil dokunmatik deneyimi bozmamak için touch event'ler ve gesture sınırlamaları dikkate alınmalıdır.

5. **Deterministik Seçim Algoritması:**
   - Çift Modu kazanan belirleme mantığı [roomUtils.js](file:///c:/repo/tindermove.v0/src/roomUtils.js) içindeki `getDeterministicWinningMovie` fonksiyonunda tanımlıdır. Bu fonksiyon saf (pure) bir fonksiyondur ve her iki istemcide (client) aynı hash sonucunu üreterek senkronize kazananı bulur.

---

### 📝 Lisans ve Notlar
Bu proje eğlence ve ortak karar alma süreçlerini kolaylaştırmak amacıyla açık kaynak prensipleriyle geliştirilmiştir.
