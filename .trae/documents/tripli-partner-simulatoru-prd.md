## 1. Product Overview
Tripli Partner Simülatörü, iki farklı persona ile sohbet ederek “sabır” yönetmeye dayalı kısa turlu bir chat oyunudur.
Amaç, her turda 20sn zaman aşımına düşmeden doğru yanıtları seçip skoru yükseltmek ve LocalStorage’daki high score’u geçmektir.

## 2. Core Features

### 2.1 Feature Module
Ürün aşağıdaki ana sayfalardan oluşur:
1. **Ana Sayfa**: oyuna başlatma, kurallar/mekanik özet, son high score özeti.
2. **Oyun (Sohbet) Sayfası**: iki persona node-diyalog akışı, 20sn tur zamanlayıcı, sabır barı, skor ve oyun sonu.
3. **Skorlar**: LocalStorage high score görüntüleme ve sıfırlama.

### 2.3 Page Details
| Page Name | Module Name | Feature description |
|---|---|---|
| Ana Sayfa | Başlat | Oyunu başlatmak için “Başla” CTA ve son high score’u göstermek. |
| Ana Sayfa | Kurallar | Sabır/20sn zaman aşımı ve iki persona sohbet mantığını kısa maddelerle açıklamak. |
| Oyun (Sohbet) Sayfası | Sohbet Akışı | İki persona için ayrı node tabanlı diyalog grafiğinden sıradaki mesajı üretmek ve chat geçmişinde göstermek. |
| Oyun (Sohbet) Sayfası | Yanıt Seçimi | Aktif node’un seçeneklerini butonlarla sunmak; seçime göre next node’a geçmek ve skor/sabır etkilerini uygulamak. |
| Oyun (Sohbet) Sayfası | Zaman Aşımı (20sn) | Her tur 20sn sayacı başlatmak; süre dolunca otomatik “yanıt verilmedi” davranışı uygulayıp sabrı düşürmek ve diyalogu ilerletmek/bitirmek. |
| Oyun (Sohbet) Sayfası | Sabır ve Oyun Sonu | Persona (veya oyun) sabrı 0’a inince “Game Over” göstermek; yeniden başlatma sunmak. |
| Oyun (Sohbet) Sayfası | Skor ve High Score | Skoru tur bazında güncellemek; oyun sonunda LocalStorage high score ile karşılaştırıp gerekirse güncellemek. |
| Skorlar | High Score Görüntüleme | LocalStorage’dan high score’u okuyup tekil kayıt olarak göstermek. |
| Skorlar | Sıfırlama | High score’u kullanıcı onayı ile sıfırlamak. |

## 3. Core Process
- Oyuncu Ana Sayfa’dan oyunu başlatır.
- Oyun Sayfası ilk persona mesajını (node) gösterir ve 20sn tur sayacı başlar.
- Oyuncu seçeneklerden birini seçer:
  - Seçim, ilgili persona diyalog grafiğinde bir sonraki node’a geçer ve skor/sabır değişir.
  - Oyun, sıradaki persona/turn mesajını chat’e ekleyerek yeni tur başlatır.
- Oyuncu 20sn içinde yanıt vermezse zaman aşımı tetiklenir; sabır düşer ve tur otomatik ilerler veya oyun biter.
- Oyun bittiğinde skor yazılır; high score gerekiyorsa LocalStorage’a kaydedilir.
- Oyuncu Skorlar sayfasından high score’u görür veya sıfırlar.

```mermaid
graph TD
  A["Ana Sayfa"] --> B["Oyun (Sohbet) Sayfası"]
  A --> C["Skorlar"]
  B --> D["Oyun Sonu (Modal/Ekr