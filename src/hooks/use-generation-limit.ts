'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GenerationLimitData {
  limit: number;
  used: number;
  remaining: number;
  resetAt: string | null;
  retryAfter: number;
  globalLimitReached: boolean;
  loading: boolean;
  minutesUntilReset: number | null;
  refresh: () => Promise<void>;
  updateFromResponse: (data: Partial<GenerationLimitData>) => void;
}

export function useGenerationLimit(): GenerationLimitData {
  const [data, setData] = useState<{
    limit: number;
    used: number;
    remaining: number;
    resetAt: string | null;
    retryAfter: number;
    globalLimitReached: boolean;
    loading: boolean;
  }>({
    limit: 2,
    used: 0,
    remaining: 2,
    resetAt: null,
    retryAfter: 0,
    globalLimitReached: false,
    loading: true,
  });

  const [now, setNow] = useState(() => Date.now());

  const fetchLimit = useCallback(async () => {
    try {
      const res = await fetch('/api/generation-limit', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData({
          limit: json.limit ?? 2,
          used: json.used ?? 0,
          remaining: json.remaining ?? 2,
          resetAt: json.resetAt ?? null,
          retryAfter: json.retryAfter ?? 0,
          globalLimitReached: !!json.globalLimitReached,
          loading: false,
        });
      } else {
        setData((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.warn('Could not fetch generation limit:', err);
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // Fetch inicial ao montar
  useEffect(() => {
    let isMounted = true;

    fetch('/api/generation-limit', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted || !json) return;
        setData({
          limit: json.limit ?? 2,
          used: json.used ?? 0,
          remaining: json.remaining ?? 2,
          resetAt: json.resetAt ?? null,
          retryAfter: json.retryAfter ?? 0,
          globalLimitReached: !!json.globalLimitReached,
          loading: false,
        });
      })
      .catch((err) => {
        console.warn('Could not fetch generation limit:', err);
        if (isMounted) setData((prev) => ({ ...prev, loading: false }));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Atualização em tempo real do timer localmente sem polling desnecessário
  useEffect(() => {
    if (!data.resetAt || data.remaining > 0) return;

    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);

      if (new Date(data.resetAt!).getTime() <= currentNow) {
        fetchLimit();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [data.resetAt, data.remaining, fetchLimit]);

  // Cálculo derivado puro de minutos restantes sem cascading renders
  const diffMs =
    data.resetAt && data.remaining === 0
      ? new Date(data.resetAt).getTime() - now
      : 0;

  const minutesUntilReset = diffMs > 0 ? Math.max(1, Math.ceil(diffMs / 60000)) : null;

  const updateFromResponse = useCallback((partial: Partial<GenerationLimitData>) => {
    setData((prev) => ({
      ...prev,
      ...partial,
      remaining: partial.remaining !== undefined ? partial.remaining : prev.remaining,
      resetAt: partial.resetAt !== undefined ? partial.resetAt : prev.resetAt,
      globalLimitReached:
        partial.globalLimitReached !== undefined
          ? partial.globalLimitReached
          : prev.globalLimitReached,
    }));
  }, []);

  return {
    ...data,
    minutesUntilReset,
    refresh: fetchLimit,
    updateFromResponse,
  };
}
