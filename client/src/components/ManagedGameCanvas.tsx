import { useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GameCanvas, { type ProgressEvent } from "./GameCanvas";

export default function ManagedGameCanvas() {
  const { user } = useAuth();
  const saveProgress = trpc.progress.save.useMutation();
  const persistedProgress = trpc.progress.list.useQuery(undefined, { enabled: Boolean(user) });
  const persistedCompleted = persistedProgress.data?.filter((item) => item.completed === 1).length ?? 0;
  const onProgress = useCallback((event: ProgressEvent) => {
    if (!user) return;
    saveProgress.mutate(event);
  }, [saveProgress, user]);
  return <GameCanvas persistedCompleted={persistedCompleted} onProgress={onProgress} />;
}
