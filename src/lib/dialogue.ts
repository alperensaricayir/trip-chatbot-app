import type {
  DifficultyConfig,
  DialogueNode,
  FallbackMessage,
  PersonaId,
  PersonaMeta,
  ReplyKind,
  ReplyOption,
} from "@/types";

export const personas: Record<PersonaId, PersonaMeta> = {
  male: {
    id: "male",
    displayName: "Alper",
    statusText: "çevrimiçi",
  },
  female: {
    id: "female",
    displayName: "Ece",
    statusText: "çevrimiçi",
  },
};

export const difficulties: Record<string, DifficultyConfig> = {
  easy: {
    id: "easy",
    label: "Kolay",
    turnSeconds: 24,
    timeoutPenalty: 12,
    timeoutPenaltyAngry: 18,
  },
  normal: {
    id: "normal",
    label: "Orta",
    turnSeconds: 20,
    timeoutPenalty: 15,
    timeoutPenaltyAngry: 20,
  },
  hard: {
    id: "hard",
    label: "Zor",
    turnSeconds: 16,
    timeoutPenalty: 18,
    timeoutPenaltyAngry: 25,
  },
};

function makeOption(
  id: string,
  label: string,
  kind: ReplyKind,
  patienceDelta: number,
  angerDelta: number,
  nextNodeId: string | null,
): ReplyOption {
  return { id, label, kind, patienceDelta, angerDelta, nextNodeId };
}

function node(
  id: string,
  partnerMessage: string,
  nextId: string | null,
): DialogueNode {
  return {
    id,
    partnerMessage,
    replyOptions: [
      makeOption(
        `${id}_a`,
        "Haklısın, geciktim. Özür dilerim.",
        "empathy",
        8,
        -1,
        nextId,
      ),
      makeOption(
        `${id}_b`,
        "Trafikte kaldım, hemen yazamadım.",
        "explain",
        4,
        0,
        nextId,
      ),
      makeOption(
        `${id}_c`,
        "Abartıyorsun, büyütme.",
        "trigger",
        -12,
        1,
        nextId,
      ),
    ],
  };
}

export function getStartNodeId(personaId: PersonaId): string {
  return personaId === "male" ? "m1" : "f1";
}

export const dialogueByPersona: Record<PersonaId, Record<string, DialogueNode>> = {
  male: {
    m1: node("m1", "Nerdesin sen? Yarım saattir mesaj atmanı bekliyorum.", "m2"),
    m2: node("m2", "Yani bir 'geciktim' demek bu kadar mı zor?", "m3"),
    m3: node("m3", "Şu an ne yapıyorsun da yazamıyorsun?", "m4"),
    m4: node("m4", "Ben mi fazla düşünüyorum yoksa sen mi umursamıyorsun?", "m5"),
    m5: node("m5", "İki dakika arayıp haber vermek vardı.", "m6"),
    m6: node("m6", "Tamam tamam... ama bunu sürekli yapıyorsun.", "m7"),
    m7: node("m7", "Bir planımız vardı, unuttun mu?", "m8"),
    m8: node("m8", "İnsan bir an önce cevap verir ya.", "m9"),
    m9: node("m9", "Şimdi 'yoğundum' diyeceksin, değil mi?", "m10"),
    m10: node("m10", "Bak ben böyle belirsizliği sevmiyorum.", "m11"),
    m11: node("m11", "Bir şey mi var? Sesin çok kısa.", "m12"),
    m12: node("m12", "Beni geçiştiriyormuşsun gibi geliyor.", "m13"),
    m13: node("m13", "Senin için önemli miyim gerçekten?", "m14"),
    m14: node("m14", "Hadi net ol, beni bekletme.", "m15"),
    m15: node("m15", "Şu an neredesin?", "m16"),
    m16: node("m16", "Ben konuşmayınca rahat mı ediyorsun?", "m17"),
    m17: node("m17", "İletişim bu kadar zor olmamalı.", "m18"),
    m18: node("m18", "Bazen kendimi görünmez hissediyorum.", "m19"),
    m19: node("m19", "Sana değer veriyorum ama karşılığını görmek istiyorum.", "m20"),
    m20: node("m20", "Bu akşam konuşalım, tamam mı?", "m21"),
    m21: node("m21", "Söz verip tutmamak sinir ediyor beni.", "m22"),
    m22: node("m22", "Bir daha böyle olursa gerçekten kırılırım.", "m23"),
    m23: node("m23", "Bana 'tamam' de, rahatlayayım.", "m24"),
    m24: node("m24", "Şu an beni dinliyor musun?", "m25"),
    m25: node("m25", "Son kez soruyorum: bu ilişki senin için ne?", null),
  },
  female: {
    f1: node("f1", "Nerdesin sen? Yarım saattir mesaj atmanı bekliyorum.", "f2"),
    f2: node("f2", "Bir mesaj atmak bu kadar mı zor gerçekten?", "f3"),
    f3: node("f3", "Günüm zaten gergin, bir de sen ekleniyorsun.", "f4"),
    f4: node("f4", "Ben mi fazla alınganım yoksa sen mi soğuksun?", "f5"),
    f5: node("f5", "Haber vermeden kaybolmayı hiç sevmiyorum.", "f6"),
    f6: node("f6", "Bak yine aynı şey... ben yoruluyorum.", "f7"),
    f7: node("f7", "İnsan biraz özen gösterir.", "f8"),
    f8: node("f8", "Ben senin yerinde olsam çoktan yazmıştım.", "f9"),
    f9: node("f9", "Bana değer veriyorsan bunu hissettir.", "f10"),
    f10: node("f10", "Şimdi ne diyeceksin merak ediyorum.", "f11"),
    f11: node("f11", "Beni oyalıyormuşsun gibi.", "f12"),
    f12: node("f12", "Bu tavır beni sinirlendiriyor.", "f13"),
    f13: node("f13", "İçimde bir şüphe oluşuyor, biliyor musun?", "f14"),
    f14: node("f14", "Bir kere de ben sormadan anlat.", "f15"),
    f15: node("f15", "Neredesin, ne yapıyorsun?", "f16"),
    f16: node("f16", "Sessizlik bazen çok şey anlatır.", "f17"),
    f17: node("f17", "Benimle dalga geçmiyorsundur umarım.", "f18"),
    f18: node("f18", "Kırıldığımda toparlaması zor oluyor.", "f19"),
    f19: node("f19", "Benimle konuşmak senin için yük mü?", "f20"),
    f20: node("f20", "Bir söz ver, bu kez tut.", "f21"),
    f21: node("f21", "Güven böyle böyle yıkılıyor.", "f22"),
    f22: node("f22", "Yine aynı şey olursa gerçekten uzaklaşırım.", "f23"),
    f23: node("f23", "Beni anladığını söyle lütfen.", "f24"),
    f24: node("f24", "Şu an benimle misin yoksa başka bir yerde misin?", "f25"),
    f25: node("f25", "Net ol: ben mi varım yoksa bahane mi?", null),
  },
};

export const fallbackTripMessages: Record<PersonaId, FallbackMessage[]> = {
  male: [
    { text: "Hala cevap yok... ilginç.", minAnger: 1 },
    { text: "Bir 'tamam' bile yazmak zor olmamalı.", minAnger: 1 },
    { text: "Beni bekletmek artık alışkanlık oldu galiba.", minAnger: 1 },
    { text: "Bazen kendimi gereksiz hissediyorum.", minAnger: 1 },
    { text: "İki kelime yazsan yeterdi.", minAnger: 1 },
    { text: "Ben mi fazla takıyorum?", minAnger: 1 },
    { text: "Tam benlik hareket... yine kayıp.", minAnger: 2 },
    { text: "Şu an cidden umursamıyorsun gibi.", minAnger: 2 },
    { text: "Neyse, demek ki önceliğin değilim.", minAnger: 2 },
    { text: "Bunu konuşacağız.", minAnger: 2 },
    { text: "Benim sabrım da bir yere kadar.", minAnger: 2 },
    { text: "Kısa cevaplar beni deli ediyor.", minAnger: 3 },
    { text: "Beni geçiştirme, lütfen.", minAnger: 3 },
    { text: "Göz göre göre beni geriyorsun.", minAnger: 3 },
    { text: "Şu an ciddi ciddi soğuyorum.", minAnger: 3 },
    { text: "Bunu bana yapman hoş değil.", minAnger: 3 },
    { text: "Bak böyle devam ederse ben de yokum.", minAnger: 4 },
    { text: "Beni yok sayıyorsan ben de seni yok sayarım.", minAnger: 4 },
    { text: "Gerçekten çok kırıcı olmaya başladı.", minAnger: 4 },
    { text: "Şu an sinirden elim titriyor.", minAnger: 4 },
    { text: "Hadi ya... yine bahane mi?", minAnger: 4 },
    { text: "Bu son uyarım.", minAnger: 5 },
    { text: "Şaka gibi ya.", minAnger: 5 },
    { text: "Tamam, anladım ben.", minAnger: 5 },
    { text: "Yeter.", minAnger: 5 },
    { text: "Böyle bir şey beklemiyordum.", minAnger: 1 },
    { text: "Bana net konuş.", minAnger: 2 },
    { text: "Sürekli aynı döngü.", minAnger: 3 },
    { text: "Bu kadarına gerek var mıydı?", minAnger: 2 },
    { text: "Şu an içimden konuşmak gelmiyor.", minAnger: 4 },
  ],
  female: [
    { text: "Yine sessizsin... tamam.", minAnger: 1 },
    { text: "Bir mesaj atmak bu kadar mı zor?", minAnger: 1 },
    { text: "Beni bekletmeyi seviyorsun galiba.", minAnger: 1 },
    { text: "Şu an cidden kırıldım.", minAnger: 1 },
    { text: "Ben burada düşünüp duruyorum.", minAnger: 1 },
    { text: "Bir iki kelime yazsan yeterdi.", minAnger: 1 },
    { text: "Hadi canım... yine mi?", minAnger: 2 },
    { text: "Benimle dalga geçiyorsun gibi.", minAnger: 2 },
    { text: "Bunu hak etmiyorum.", minAnger: 2 },
    { text: "Bu tavır beni geriyor.", minAnger: 2 },
    { text: "Benim sabrım da sınırsız değil.", minAnger: 2 },
    { text: "Beni geçiştirme lütfen.", minAnger: 3 },
    { text: "Bir kere de ben istemeden yaz.", minAnger: 3 },
    { text: "Şu an içimde fırtına var.", minAnger: 3 },
    { text: "Benimle konuşmak bu kadar zor olmamalı.", minAnger: 3 },
    { text: "Cidden soğumaya başladım.", minAnger: 3 },
    { text: "Bak böyle giderse engel yeriz.", minAnger: 4 },
    { text: "Beni yok sayma.", minAnger: 4 },
    { text: "Bu kadar saygısızlık fazla.", minAnger: 4 },
    { text: "Sinirden gülüyorum şu an.", minAnger: 4 },
    { text: "Yeter artık.", minAnger: 4 },
    { text: "Bu son uyarım.", minAnger: 5 },
    { text: "Tamam, anladım.", minAnger: 5 },
    { text: "Bitti.", minAnger: 5 },
    { text: "Şu an konuşmak istemiyorum.", minAnger: 5 },
    { text: "Ben böyle bir şey beklemiyordum.", minAnger: 1 },
    { text: "Bana net ol.", minAnger: 2 },
    { text: "Sürekli aynı bahane.", minAnger: 3 },
    { text: "Benim yerimde olsan ne hissederdin?", minAnger: 2 },
    { text: "Şu an sabrım taştı.", minAnger: 4 },
  ],
};

export function getNode(personaId: PersonaId, nodeId: string): DialogueNode | null {
  return dialogueByPersona[personaId][nodeId] ?? null;
}

export function getFallbackMessage(personaId: PersonaId, angerLevel: number): string {
  const pool = fallbackTripMessages[personaId];
  const eligible = pool.filter((m) => angerLevel >= m.minAnger);
  const pickFrom = eligible.length > 0 ? eligible : pool;
  const idx = Math.floor(Math.random() * pickFrom.length);
  return pickFrom[idx]?.text ?? "...";
}

