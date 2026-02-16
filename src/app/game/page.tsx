import { ChatScreen } from "@/components/ChatScreen";
import { getPersonaOrDefault } from "@/lib/gameEngine";
import type { PersonaId } from "@/types";

export default async function GamePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  const rawPersona = typeof sp.persona === "string" ? sp.persona : null;
  const rawDifficulty = typeof sp.difficulty === "string" ? sp.difficulty : null;

  const personaId: PersonaId = getPersonaOrDefault(rawPersona);

  return <ChatScreen personaId={personaId} difficultyId={rawDifficulty} />;
}
