export interface AuthUser {
  id: string;
  name: string;
  title: string;
  profession?: string;
  email: string;
  role: "therapist" | "admin" | "client";
  avatarInitials: string;
  photoUrl?: string;
  image?: string;
  avatarUrl?: string;
}

export const DEFAULT_THERAPIST: AuthUser = {
  id: "doc-1",
  name: "Dr. Evelyn Reed",
  title: "Licensed Clinical Psychologist",
  profession: "Licensed Clinical Psychologist",
  email: "dr.evelyn@hexpertify.com",
  role: "therapist",
  avatarInitials: "ER",
  photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
};

const STORAGE_KEY = "hexpertify_auth_user";

function checkSsoTransfer(): AuthUser | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const ssoTicket = params.get("sso_ticket");
    let ssoRaw = params.get("sso_user") || params.get("sso");

    // 1. Verify signed cryptographic SSO ticket if present
    if (ssoTicket) {
      const endpoints = ["/api/auth/sso-verify", "http://localhost:5000/api/auth/sso-verify", "http://localhost:3000/api/auth/sso-verify"];
      for (const ep of endpoints) {
        fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticket: ssoTicket }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.success && data?.user) {
              const verifiedUser: AuthUser = {
                id: data.user.id || data.user._id,
                name: data.user.name,
                title: data.user.profession || data.user.title || "Licensed Clinical Psychologist",
                email: data.user.email,
                role: data.user.role || "therapist",
                avatarInitials: (data.user.name || "TH")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
                photoUrl: data.user.image || data.user.photoUrl || DEFAULT_THERAPIST.photoUrl,
                image: data.user.image || data.user.photoUrl || DEFAULT_THERAPIST.photoUrl
              };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedUser));
              window.dispatchEvent(new Event("auth_state_change"));
            }
          })
          .catch(() => {});
      }
    }

    // 2. Immediate synchronous payload decode
    if (ssoTicket && !ssoRaw) {
      try {
        const b64 = ssoTicket.replace(/-/g, "+").replace(/_/g, "/");
        const jsonStr = atob(b64);
        const parsed = JSON.parse(jsonStr);
        if (parsed?.payload) {
          ssoRaw = encodeURIComponent(JSON.stringify(parsed.payload));
        }
      } catch {}
    }

    if (ssoRaw || ssoTicket) {
      let user: AuthUser = DEFAULT_THERAPIST;
      if (ssoRaw) {
        try {
          const parsed = JSON.parse(decodeURIComponent(ssoRaw));
          user = {
            id: parsed.id || parsed._id || DEFAULT_THERAPIST.id,
            name: parsed.name || DEFAULT_THERAPIST.name,
            title: parsed.profession || parsed.title || DEFAULT_THERAPIST.title,
            email: parsed.email || DEFAULT_THERAPIST.email,
            role: "therapist",
            avatarInitials: (parsed.name || "TH")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            photoUrl: parsed.image || parsed.photo || parsed.photoUrl || DEFAULT_THERAPIST.photoUrl,
            image: parsed.image || parsed.photo || parsed.photoUrl || DEFAULT_THERAPIST.photoUrl
          };
        } catch {}
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      const url = new URL(window.location.href);
      url.searchParams.delete("sso_ticket");
      url.searchParams.delete("sso_user");
      url.searchParams.delete("sso");
      window.history.replaceState({}, document.title, url.pathname + url.search);
      return user;
    }
  } catch (e) {}
  return null;
}

export function getAuthUser(): AuthUser | null {
  try {
    const ssoUser = checkSsoTransfer();
    if (ssoUser) return ssoUser;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_THERAPIST;
    const parsed = JSON.parse(data);
    return parsed;
  } catch (e) {
    return DEFAULT_THERAPIST;
  }
}

export function setAuthUser(user: AuthUser): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("auth_state_change"));
  } catch (e) {}
}

export function isAuthenticated(): boolean {
  try {
    if (checkSsoTransfer()) return true;
    const data = localStorage.getItem(STORAGE_KEY);
    return !!data;
  } catch (e) {
    return false;
  }
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("auth_state_change"));
  } catch (e) {}
}
