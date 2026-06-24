/**
 * Races a promise (or thenable, e.g. a Supabase query builder) against a
 * timeout. Resolves to `null` if the timeout wins, used to keep server
 * components responsive when Supabase is slow or unreachable.
 */
export function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T | null> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<null>(resolve => setTimeout(() => resolve(null), ms)),
  ])
}
