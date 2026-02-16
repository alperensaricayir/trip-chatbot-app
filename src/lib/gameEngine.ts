import type {
  DifficultyConfig,
  DialogueNode,
  GameState,
  PersonaId,
  ReplyKind,
  ReplyOption,
} from "@/types";
import { difficulties, getNode, getStartNodeId, personas } from "@/lib/dialogue";

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return String(Date.now()) + String(Math.random()).slice(2);
}

export function getDifficultyConfig(id: string | null | undefined): DifficultyConfig {
  const key = id ?? "normal";
  return difficulties[key] ?? difficulties.normal;
}

export function getPersonaOrDefault(value: string | null | undefined): PersonaId {
  return value === "female" || value === "male" ? value : "female";
}

export function getInitialPartnerMessage(personaId: PersonaId): string {
  const startId = getStartNodeId(personaId);
  const start = getNode(personaId, startId);
  return start?.partnerMessage ?? "Nerdesin sen?";
}

export function getActiveNode(state: GameState): DialogueNode | null {
  if (!state.currentNodeId) return null;
  return getNode(state.personaId, state.currentNodeId);
}

export function getActiveReplyOptions(state: GameState): [ReplyOption, ReplyOption, ReplyOption] {
  const node = getActiveNode(state);
  if (node) return node.replyOptions;

  const next: string | null = null;
  return [
    {
      id: "fallback_a",
      label: "Haklısın, özür dilerim.",
      kind: "empathy",
      patienceDelta: 7,
      angerDelta: -1,
      nextNodeId: next,
    },
    {
      id: "fallback_b",
      label: "Yoğundum, şimdi buradayım.",
      kind: "explain",
      patienceDelta: 3,
      angerDelta: 0,
      nextNodeId: next,
    },
    {
      id: "fallback_c",
      label: "Abartıyorsun bence.",
      kind: "trigger",
      patienceDelta: -10,
      angerDelta: 1,
      nextNodeId: next,
    },
  ];
}

export function computeEarlyBonus(remainingSeconds: number): number {
  if (remainingSeconds >= 12) return 2;
  return 0;
}

export function computeTimeoutPenalty(difficulty: DifficultyConfig, angerLevel: number): number {
  return angerLevel >= 4 ? difficulty.timeoutPenaltyAngry : difficulty.timeoutPenalty;
}

export function pickNextNodeIdByOptionIndex(
  state: GameState,
  optionIndex: number,
): string | null {
  const node = getActiveNode(state);
  if (!node) return null;
  return node.replyOptions[optionIndex]?.nextNodeId ?? null;
}

export function pickReplyOptionIndexByKind(
  options: [ReplyOption, ReplyOption, ReplyOption],
  kind: ReplyKind,
): 0 | 1 | 2 {
  const idx = options.findIndex((o) => o.kind === kind);
  if (idx === 0 || idx === 1 || idx === 2) return idx;
  return 1;
}

export function createInitialState(
  personaId: PersonaId,
  difficultyId: string | null | undefined,
  highScore: number,
): GameState {
  const difficulty = getDifficultyConfig(difficultyId);
  const firstNodeId = getStartNodeId(personaId);
  const firstText = getInitialPartnerMessage(personaId);
  const now = Date.now();

  return {
    personaId,
    difficultyId: difficulty.id,
    phase: "playing",
    patience: 70,
    angerLevel: 1,
    messageCount: 0,
    highScore,
    currentNodeId: firstNodeId,
    messages: [
      {
        id: createId(),
        sender: "partner",
        text: firstText,
        timestamp: now,
      },
    ],
    isPartnerTyping: false,
    pendingNodeId: null,
    awaitingUserSince: now,
    turnSeconds: difficulty.turnSeconds,
    turnToken: 1,
  };
}

export function getPersonaMeta(personaId: PersonaId) {
  return personas[personaId];
}

