# Tripli Partner Simülatörü — Sayfa Tasarım Dokümanı (Desktop-first)

## Global Styles (Design Tokens)
- Arka plan: `#0B0F19` (koyu), yüzey: `#111827`, kart: `#0F172A`
- Metin: birincil `#E5E7EB`, ikincil `#9CA3AF`, vurgu `#A78BFA`
- Tipografi: 16px temel; başlık 28/22/18 ölçek
- Buton: primary (vurgu), secondary (yüzey); hover’da +%8 parlaklık
- Link: underline + vurgu rengi; hover’da opacity 0.85
- Radius: 12px; gölge: hafif (card)
- Animasyon: 120–180ms ease-out (hover, modal)

## 1) Ana Sayfa
### Layout
- 12 kolon CSS Grid; içerik ortalanmış container (max 1040px).
- Üstte hero, altta iki kart: “Kurallar” ve “High Score”.

### Meta Information
- Title: “Tripli Partner Simülatörü”
- Description: “İki persona ile sohbet et, 20sn içinde cevap ver, sabrını tüketme.”
- Open Graph: title/description + basit paylaşım görseli (placeholder).

### Page Structure & Components
- Üst Bar: sol logo/isim, sağda “Skorlar” linki.
- Hero Panel:
  - H1 oyun adı
  - Kısa açıklama (1–2 satır)
  - Primary CTA: “Başla” (→ /game)
- Kurallar Kartı:
  - Maddeler: “Her tur 20sn”, “Zaman aşımı sabır düşürür”, “Doğru seçim skor kazandırır”, “2 persona node-diyalog”
- High Score Kartı:
  - Büyük sayı + “Skorlar” butonu (→ /scores)

## 2) Oyun (Sohbet) Sayfası
### Layout
- Ana iskelet: sol (Sohbet) / sağ (Durum Paneli) iki kolon Flex.
- Sohbet alanı: dikey akış + otomatik scroll; giriş alanı yerine seçenek butonları.

### Meta Information
- Title: “Oyun — Tripli Partner Simülatörü”
- Description: “20sn içinde cevap vererek skoru yükselt.”

### Sections & Components
- Header (sticky):
  - Sol: “Çık” (→ /)
  - Orta: aktif persona adı (badge)
  - Sağ: anlık skor
- Sohbet Paneli (sol):
  - Mesaj balonları: persona mesajı (sol), oyuncu seçimi (sağ)
  - Mesaj üstünde küçük persona etiketi (iki persona ayırt için)
  - Sistem mesajı stili: “Zaman aşımı!”
- Seçenek Şeridi (alt):
  - 2–4 adet seçenek butonu
  - Disabled state: tur biterken kısa süre kilit
- Durum Paneli (sağ):
  - 20sn countdown (büyük)
  - Sabır barı (0–max)
  - “Yeniden Başlat” secondary buton
- Game Over Modal:
  - Final skor, high score bilgisi, “Tekrar Oyna” ve “Ana Sayfa”

### Interaction States
- Tur başladığında: timer reset + seçenekler aktif.
- Seçim yapıldığında: seçenekler kilit + geçiş animasyonu + yeni node render.
- 20sn dolunca: otomatik sistem aksiyonu + sabır düşümü + yeni tur veya game over.

## 3) Skorlar
### Layout
- Tek kolon, center container; üstte başlık, altta kartlar.

### Meta Information
- Title: “Skorlar — Tripli Partner Simülatörü”
- Description: “LocalStorage high score görüntüle ve sıfırla.”

### Sections & Components
- Üst Bar: geri (→ /)
- High Score Kartı:
  - Büyük sayı
  - Açıklama: “Bu skor tarayıcında saklanır (LocalStorage).”
- Aksiyonlar:
  - “High Score’u Sıfırla” (danger) → confirm dialog

## Responsive Behavior (özet)
- >=1024px: iki kolon (sohbet + durum).
- <1024px: durum paneli üstte yatay bant; sohbet tam genişlik; seçenekler sabit altta.