export type AuthProvider = "guest" | "email" | "google";

export interface SessionUser {
  id: string;
  name: string;
  email?: string;
  provider: AuthProvider;
  role: "trader" | "admin";
}

export function createGuestSession() {
  const user: SessionUser = {
    id: `guest-${Date.now()}`,
    name: "Guest Trader",
    provider: "guest",
    role: "trader"
  };

  return {
    user,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  };
}

export function createEmailLoginIntent(email: string) {
  return {
    provider: "email" as const,
    email,
    message: "Email magic-link provider can be connected here."
  };
}

export function getGoogleAuthConfig() {
  return {
    provider: "google" as const,
    clientId: process.env.GOOGLE_CLIENT_ID,
    configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  };
}
