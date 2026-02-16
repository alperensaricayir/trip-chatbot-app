## 1.Architecture design
```mermaid
graph TD
  U["User Browser"] --> F["React Frontend Application"]
  F --> LS["Web Storage (LocalStorage)"]
  F --> DE["Dialogue Engine (In-App)"]

  subgraph "Frontend Layer"
    F
    DE
  end

  subgraph "Browser Services"
    LS
  end
```

## 2.Technology Description
- Frontend: React@18 + TypeScript + vite
- Styling: tailwindcss@3 (opsiyonel)
- Backend: None

## 3.Route definitions
| Route | Purpose |
|---|---|
| / | Ana sayfa (başlat, kurallar, high score özeti) |
| /game | Oyun (sohbet, 20sn timeout, sabır, skor) |
| /scores | High score görüntüleme ve sıfırlama |

## 6.Data model(if applicable)
### 6.1 Data model definition
Oyun state’i istemci tarafında tutulur; high score LocalStorage’da saklanır.
```mermaid
erDiagram
  PERSONA ||--o{ DIALOG_NODE : has
  DIALOG_NODE ||--o{ DIALOG_CHOICE : offers

  PERSONA {
    string id
    string displayName
    int patienceMax
  }
  DIALOG_NODE {
    string id
    string personaId
    string text
  }
  DIALOG_CHOICE {
    string id
    string nodeId
    string label
    string nextNodeId
    int scoreDelta
    int patienceDelta
  }
```

### 6.2 Data Definition Language
Veritabanı yok (DDL uygulanmaz). LocalStorage anahtarları:
- `tps_high_score`: number
- `tps_settings` (opsiyonel): `{ soundEnabled: boolean }`