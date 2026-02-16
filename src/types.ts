export type PersonaId = "male" | "female";

export type DifficultyId = "easy" | "normal" | "hard";

export type Sender = "partner" | "user" | "system";

export type ReplyKind = "empathy" | "explain" | "trigger";

export type GamePhase = "playing" | "gameover";

export interface PersonaMeta {
  id: PersonaId;
  displayName: string;
  statusText: string;
}

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  turnSeconds: number;
  timeoutPenalty: number;
  timeoutPenaltyAngry: number;
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

export interface ReplyOption {
  id: string;
  label: string;
  kind: ReplyKind;
  patienceDelta: number;
  angerDelta: number;
  nextNodeId: string | null;
}

export interface DialogueNode {
  id: string;
  partnerMessage: string;
  replyOptions: [ReplyOption, ReplyOption, ReplyOption];
}

export interface FallbackMessage {
  text: string;
  minAnger: number;
}

export interface GameState {
  personaId: PersonaId;
  difficultyId: DifficultyId;
  phase: GamePhase;
  patience: number;
  angerLevel: number;
  messageCount: number;
  highScore: number;
  currentNodeId: string | null;
  messages: ChatMessage[];
  isPartnerTyping: boolean;
  pendingNodeId: string | null;
  awaitingUserSince: number | null;
  turnSeconds: number;
  turnToken: number;
}

