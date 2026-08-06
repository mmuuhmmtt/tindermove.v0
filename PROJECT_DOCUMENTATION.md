#  SwipeMovie (TinderMove) - Kapsamlı Proje Dokümantasyonu 



---

##  1. Programın Amacı (Purpose of the Application)

**SwipeMovie**, arkadaş grupları, aile bireyleri veya çiftlerin ortak bir film izleme kararı verirken yaşadıkları kararsızlığı eğlenceli ve pratik bir şekilde çözer.

- **Mantık:** Tinder uygulamasındaki kaydırma mekanizmasından esinlenilmiştir.
- **Nasıl Çalışır?:** 
  1. Bir kullanıcı oda oluşturur (veya solo başlar).
  2. Arkadaşına/Eşine oda bağlantısını veya 6 haneli oda kodunu gönderir.
  3. Her iki taraf film kartlarını inceleyip sağa (beğen) veya sola (pas) kaydırır.
  4. Ortak olarak beğenilen ilk filmde sistem eşleşme (Match) uyarısı verir.
  5. Çift Modu'nda ise taraflar 3'er film seçer ve adil algoritma ortak kazananı belirler.

---

##  2. Kullanılan Teknolojiler & Kütüphaneler (Tech Stack & Dependencies)

- **[React 19](file:///c:/repo/tindermove.v0/package.json)**: Kullanıcı arayüzü bileşenleri.
- **[Vite 8](file:///c:/repo/tindermove.v0/vite.config.js)**: Yüksek hızlı frontend derleyici ve HMR dev sunucusu.
- **[Firebase Firestore 12](file:///c:/repo/tindermove.v0/src/firebase.js)**: Gerçek zamanlı (real-time) oda senkronizasyonu ve swipe eşleşmeleri.
- **[Framer Motion 12](file:///c:/repo/tindermove.v0/src/components/MovieCard.jsx)**: Tinder kart sürükleme jestleri (gestures), fizik bazlı animasyonlar, sayfa/modal geçişleri.
- **[TMDB API](file:///c:/repo/tindermove.v0/src/App.jsx)**: Film afişleri, konuları, IMDb puanları, kategoriler ve fragman videoları.
- **[Capacitor 8](file:///c:/repo/tindermove.v0/capacitor.config.json)**: Web uygulamasını Android native uygulamaya (APK/AAB) dönüştürme altyapısı.
- **Pure CSS3**: Glassmorphism efektleri, dinamik dark-mode renk paletleri ve mobil responsive tasarım.

---

##  3. Uygulamanın İşlevsel Özellikleri ve Modları

1. **Oda ve Profil Yönetimi (`RoomEntry.jsx`, `AvatarSelector.jsx`):**
   - Anonim profil (İsim + Emoji Avatar).
   - 6 haneli rastgele oda kodu üretimi (`generateRoomCode`).
   - URL parametreleri ile otomatik odaya katılma bağ kurma (`?room=XXXXXX`).

2. **Tinder Kart Kaydırma Mekanizması (`MovieCard.jsx`):**
   - Sağa kaydırma: Beğenme (Firestore'a `right` swipe yazar).
   - Sola kaydırma: Pas geçme.
   - Geri Al (Rewind): Son yapılan swipe işlemini geri alma.

3. **Gerçek Zamanlı Oda Eşleşmesi (`App.jsx` + Firestore `onSnapshot`):**
   - Bir oda içindeki kullanıcılardan 2 veya daha fazlası aynı filmi sağa kaydırdığında `MatchModal.jsx` tetiklenir.

4. **Çift Modu (`CoupleModeModal.jsx`):**
   - Kullanıcıların 3'er adet film seçmesini ister.
   - Her iki kullanıcı da 3 hakkını doldurunca seed hash tabanlı adil kazanan algoritması (`getDeterministicWinningMovie`) çalışır.

5. **İnteraktif Çarkıfelek (`SpinWheelModal.jsx`):**
   - Kararsız kalındığında beğenilen filmler çarka yerleştirilir ve Canvas animasyonu ile rastgele seçim yapılır.

6. **Zevk Uyumu (`CompatibilityModal.jsx`):**
   - Kullanıcıların beğendikleri filmler ve ortak eşleşme sayılarına dayanarak uyum yüzdesi hesaplar.

7. **Kategori & Mood Filtreleri (`QuickMoods.jsx`, `FilterModal.jsx`):**
   - Neşeli, Aksiyon, Romantik, Korku, Beyin Yakıcı gibi hazır ruh halleri.
   - Min IMDb puanı, maksimum film süresi ve film türü filtrelemesi.

8. **YouTube Fragman Oynatıcı (`TrailerModal.jsx`, `roomUtils.js`):**
   - TMDB API üzerinden Türkçe/İngilizce YouTube fragman bağlantısı çeker ve uygulama içi pop-up olarak oynatır.

---

##  4. Dosya Mimarisi (Architecture)

- **[src/App.jsx](file:///c:/repo/tindermove.v0/src/App.jsx)**: Uygulamanın merkezi (Orchestrator). State'leri, Firebase dinleyicilerini, TMDB API çağrılarını ve ekran geçişlerini kontrol eder.
- **[src/roomUtils.js](file:///c:/repo/tindermove.v0/src/roomUtils.js)**: Saf utility fonksiyonlar (Session ID üretme, URL parse etme, TMDB fragman alma, Deterministik kazanan hash hesaplama).
- **[src/firebase.js](file:///c:/repo/tindermove.v0/src/firebase.js)**: Firebase App ve Firestore veritabanı bağlantısı.
- **[src/components/](file:///c:/repo/tindermove.v0/src/components)**:
  - `MovieCard.jsx`: Kart görseli, puanı, sürükleme animasyonları.
  - `MovieModal.jsx`: Film detay penceresi.
  - `MatchModal.jsx`: Ortak eşleşme tebrik ekranı.
  - `CoupleModeModal.jsx`: Çift modu 3'er seçim takip ekranı.
  - `SpinWheelModal.jsx`: HTML5 Canvas çarkıfelek.
  - `CompatibilityModal.jsx`: Zevk uyum raporu.
  - `FilterModal.jsx` & `QuickMoods.jsx`: Filtre ve Mood arayüzleri.
  - `RoomEntry.jsx` & `AvatarSelector.jsx`: Giriş ve oda kurma arayüzü.
  - `TrailerModal.jsx`: YouTube embed fragman ekranı.

---