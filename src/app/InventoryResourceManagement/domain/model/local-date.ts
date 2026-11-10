/** Fecha de hoy como AAAA-MM-DD, en hora local (no en UTC). */
export const todayIso = (): string => new Date().toLocaleDateString('en-CA');
