'use client';

/**
 * Root error boundary. Without this, a render/hydration failure (e.g. a chunk
 * missing while offline) leaves the screen blank/black. This catches it and
 * shows a friendly, branded screen instead — including a manual retry.
 */
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console for debugging (never crashes the page).
    console.error('[TableRounds] global error:', error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#01503b] text-2xl font-bold text-white">
        TR
      </div>
      <h1 className="text-2xl font-bold text-zinc-900">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-zinc-500">
        The page failed to load — this can happen when you are offline. Check
        your connection and try again.
        {error.digest ? (
          <span className="mt-1 block text-xs text-zinc-400">
            digest: {error.digest}
          </span>
        ) : null}
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.assign('/')}>
          Go home
        </Button>
      </div>
    </div>
  );
}