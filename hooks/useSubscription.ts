"use client";

// Stub hook — replace with real plan-fetching logic when billing is wired up.
// `limits.maxDurationPerSession` is in minutes.

export interface SubscriptionLimits {
  maxDurationPerSession: number; // minutes
  maxSessionsPerMonth: number;
}

const DEFAULT_LIMITS: SubscriptionLimits = {
  maxDurationPerSession: 15,
  maxSessionsPerMonth: 10,
};

export function useSubscription() {
  // TODO: fetch real plan limits from your billing backend / Clerk metadata
  return {
    limits: DEFAULT_LIMITS,
    isLoading: false,
  };
}

export default useSubscription;
