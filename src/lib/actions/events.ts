"use server";

import { logEvent } from "@/lib/data";

export async function logEventAction(
  eventType: string,
  payload: { businessId?: string; categoryId?: string; metadata?: Record<string, unknown> } = {}
) {
  try {
    await logEvent(eventType, payload);
  } catch {
    // Analytics logging must never break the user-facing action it's attached to.
  }
}
