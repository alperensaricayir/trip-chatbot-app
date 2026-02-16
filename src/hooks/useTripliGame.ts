"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import type { DifficultyConfig, GameState, PersonaId, ReplyKind } from "@/types";
import {
  clamp,
  computeEarlyBonus,
  computeTimeoutPenalty,
  createId,
  createInitialState,
  getActiveReplyOptions,
  getDifficultyConfig,
  getPersonaMeta,
  pickReplyOptionIndexByKind,
} from "@/lib/gameEngine";
import { getFallbackMessage, getNode } from "@/lib/dialogue";
import { loadHighScore, saveHighScore } from "@/lib/storage";

type Action =
  | {
      type: "INIT";
      personaId: PersonaId;
      difficultyId: string | null | undefined;
      highScore: number;
    }
  | { type: "USER_REPLY"; text: string; kind: ReplyKind }
  | { type: "USER_REPLY_AI"; text: string; kind: ReplyKind; patienceDelta: number; angerDelta: number }
  | { type: "TIMEOUT" }
  | { type: "PARTNER_MESSAGE" }
  | { type: "PARTNER_AI"; text: string }
  | { type: "RESTART" };

function getRemainingSeconds(state: GameState, now: number): number {
  if (!state.awaitingUserSince) return 0;
  const elapsed = Math.floor((now - state.awaitingUserSince) / 1000);
  return Math.max(0, state.turnSeconds - elapsed);
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "INIT":
      return createInitialState(action.personaId, action.difficultyId, action.highScore);
    case "RESTART":
      return createInitialState(state.personaId, state.difficultyId, state.highScore);
    case "USER_REPLY": {
      if (state.phase !== "playing" || !state.awaitingUserSince) return state;

      const now = Date.now();
      const remaining = getRemainingSeconds(state, now);
      const earlyBonus = computeEarlyBonus(remaining);

      const options = getActiveReplyOptions(state);
      const idx = pickReplyOptionIndexByKind(options, action.kind);
      const picked = options[idx];

      const patience = clamp(
        state.patience + picked.patienceDelta + earlyBonus,
        0,
        100,
      );
      const angerLevel = clamp(state.angerLevel + picked.angerDelta, 1, 7);

      const nextNodeId = picked.nextNodeId;
      const nextMessageCount = state.messageCount + 1;
      const nextHigh = Math.max(state.highScore, nextMessageCount);

      const nextState: GameState = {
        ...state,
        patience,
        angerLevel,
        messageCount: nextMessageCount,
        highScore: nextHigh,
        messages: [
          ...state.messages,
          { id: createId(), sender: "user", text: action.text, timestamp: now },
        ],
        awaitingUserSince: null,
        isPartnerTyping: patience > 0,
        pendingNodeId: patience > 0 ? nextNodeId : null,
      };

      if (patience <= 0) {
        return { ...nextState, phase: "gameover", isPartnerTyping: false, pendingNodeId: null };
      }

      return nextState;
    }
    case "USER_REPLY_AI": {
      if (state.phase !== "playing" || !state.awaitingUserSince) return state;
      const now = Date.now();
      const remaining = getRemainingSeconds(state, now);
      const earlyBonus = computeEarlyBonus(remaining);
      const options = getActiveReplyOptions(state);
      const idx = pickReplyOptionIndexByKind(options, action.kind);
      const picked = options[idx];
      const patience = clamp(state.patience + action.patienceDelta + earlyBonus, 0, 100);
      const angerLevel = clamp(state.angerLevel + action.angerDelta, 1, 7);
      const nextNodeId = picked.nextNodeId;
      const nextMessageCount = state.messageCount + 1;
      const nextHigh = Math.max(state.highScore, nextMessageCount);
      const nextState: GameState = {
        ...state,
        patience,
        angerLevel,
        messageCount: nextMessageCount,
        highScore: nextHigh,
        messages: [
          ...state.messages,
          { id: createId(), sender: "user", text: action.text, timestamp: now },
        ],
        awaitingUserSince: null,
        isPartnerTyping: patience > 0,
        pendingNodeId: patience > 0 ? nextNodeId : null,
      };
      if (patience <= 0) {
        return { ...nextState, phase: "gameover", isPartnerTyping: false, pendingNodeId: null };
      }
      return nextState;
    }
    case "TIMEOUT": {
      if (state.phase !== "playing" || !state.awaitingUserSince) return state;

      const now = Date.now();
      const difficulty = getDifficultyConfig(state.difficultyId);
      const penalty = computeTimeoutPenalty(difficulty, state.angerLevel);

      const patience = clamp(state.patience - penalty, 0, 100);
      const angerLevel = clamp(state.angerLevel + 1, 1, 7);

      const options = getActiveReplyOptions(state);
      const harsh = options[2];

      const nextState: GameState = {
        ...state,
        patience,
        angerLevel,
        messages: [
          ...state.messages,
          {
            id: createId(),
            sender: "system",
            text: `Zaman aşımı! (${penalty} sabır)`,
            timestamp: now,
          },
        ],
        awaitingUserSince: null,
        isPartnerTyping: patience > 0,
        pendingNodeId: patience > 0 ? harsh.nextNodeId : null,
      };

      if (patience <= 0) {
        return { ...nextState, phase: "gameover", isPartnerTyping: false, pendingNodeId: null };
      }

      return nextState;
    }
    case "PARTNER_MESSAGE": {
      if (state.phase !== "playing" || !state.isPartnerTyping) return state;

      const now = Date.now();
      const nextNodeId = state.pendingNodeId;

      const nextNode = nextNodeId ? getNode(state.personaId, nextNodeId) : null;
      const partnerText =
        nextNode?.partnerMessage ?? getFallbackMessage(state.personaId, state.angerLevel);

      return {
        ...state,
        currentNodeId: nextNode?.id ?? null,
        messages: [
          ...state.messages,
          { id: createId(), sender: "partner", text: partnerText, timestamp: now },
        ],
        isPartnerTyping: false,
        pendingNodeId: null,
        awaitingUserSince: now,
        turnToken: state.turnToken + 1,
      };
    }
    case "PARTNER_AI": {
      if (state.phase !== "playing" || !state.isPartnerTyping) return state;
      const now = Date.now();
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: createId(), sender: "partner", text: action.text, timestamp: now },
        ],
        isPartnerTyping: false,
        pendingNodeId: null,
        awaitingUserSince: now,
        turnToken: state.turnToken + 1,
      };
    }
    default:
      return state;
  }
}

export function useTripliGame(
  personaId: PersonaId,
  difficultyId: string | null | undefined,
) {
  const [state, dispatch] = useReducer(
    reducer,
    { personaId, difficultyId } as {
      personaId: PersonaId;
      difficultyId: string | null | undefined;
    },
    (arg) => createInitialState(arg.personaId, arg.difficultyId, loadHighScore()),
  );

  useEffect(() => {
    dispatch({
      type: "INIT",
      personaId,
      difficultyId,
      highScore: loadHighScore(),
    });
  }, [personaId, difficultyId]);

  useEffect(() => {
    if (state.phase !== "gameover") return;
    saveHighScore(state.highScore);
  }, [state.phase, state.highScore]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, []);

  const difficulty: DifficultyConfig = useMemo(
    () => getDifficultyConfig(state.difficultyId),
    [state.difficultyId],
  );

  const remainingSeconds = useMemo(
    () => getRemainingSeconds(state, now),
    [state, now],
  );

  useEffect(() => {
    if (state.phase !== "playing" || !state.awaitingUserSince) return;
    if (remainingSeconds !== 0) return;

    const tokenAtSchedule = state.turnToken;
    const t = window.setTimeout(() => {
      if (tokenAtSchedule !== state.turnToken) return;
      dispatch({ type: "TIMEOUT" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [state.phase, state.awaitingUserSince, remainingSeconds, state.turnToken]);

  useEffect(() => {
    if (state.phase !== "playing" || !state.isPartnerTyping) return;
    const delay = 800 + Math.floor(Math.random() * 700);
    const tokenAtSchedule = state.turnToken;
    const t = window.setTimeout(async () => {
      if (tokenAtSchedule !== state.turnToken) return;
      try {
        const messages = state.messages.map((m) => ({
          role: m.sender === "partner" ? "partner" : "user",
          text: m.text,
        }));
        const persona = getPersonaMeta(state.personaId).displayName;
        const res = await fetch("/api/hf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona,
            angerLevel: state.angerLevel,
            patience: state.patience,
            messages,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text: string = data.text || "";
          if (text.trim()) {
            dispatch({ type: "PARTNER_AI", text });
            return;
          }
        }
      } catch {}
      dispatch({ type: "PARTNER_MESSAGE" });
    }, delay);
    return () => window.clearTimeout(t);
  }, [state.phase, state.isPartnerTyping, state.turnToken, state.messages, state.personaId, state.angerLevel, state.patience]);

  const persona = useMemo(() => getPersonaMeta(state.personaId), [state.personaId]);
  const replyOptions = useMemo(() => getActiveReplyOptions(state), [state]);

  function send(text: string, kind: ReplyKind) {
    const useAi = true;
    if (useAi) {
      (async () => {
        try {
          const messages = state.messages.map((m) => ({
            role: m.sender === "partner" ? "partner" : "user",
            text: m.text,
          }));
          const persona = getPersonaMeta(state.personaId).displayName;
          const res = await fetch("/api/hf/eval", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              persona,
              angerLevel: state.angerLevel,
              patience: state.patience,
              userText: text,
              history: messages,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            const mappedKind: ReplyKind =
              data.class === "empathy" ? "empathy" : data.class === "trigger" ? "trigger" : "explain";
            dispatch({
              type: "USER_REPLY_AI",
              text,
              kind: mappedKind,
              patienceDelta: Number(data.patienceDelta ?? 0),
              angerDelta: Number(data.angerDelta ?? 0),
            });
            return;
          }
        } catch {}
        dispatch({ type: "USER_REPLY", text, kind });
      })();
      return;
    }
    dispatch({ type: "USER_REPLY", text, kind });
  }

  function timeoutNow() {
    dispatch({ type: "TIMEOUT" });
  }

  function restart() {
    dispatch({ type: "RESTART" });
  }

  return {
    state,
    persona,
    difficulty,
    remainingSeconds,
    replyOptions,
    send,
    timeoutNow,
    restart,
  };
}
