export interface AuthUser {
  id: string;
  name: string;
  title: string;
  email: string;
  role: "therapist" | "admin" | "client";
  avatarInitials: string;
  photoUrl?: string;
}

const DEFAULT_USER: AuthUser = {
  id: "doc-1",
  name: "Dr. Alex Harrison, PsyD",
  title: "Licensed Clinical Psychologist",
  email: "alex.harrison@hexpertify.com",
  role: "therapist",
  avatarInitials: "AH",
  photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
};

const STORAGE_KEY = "hexpertify_auth_user";

export function getAuthUser(): AuthUser | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_USER;
    const parsed = JSON.parse(data);
    
    // Auto-migrate legacy user profiles to synced therapist profile details
    if (
      !parsed.photoUrl ||
      parsed.photoUrl.includes("photo-1534528741775") ||
      parsed.title === "Platform Admin" ||
      parsed.name === "Dr. Alex Harrison"
    ) {
      parsed.photoUrl = DEFAULT_USER.photoUrl;
      parsed.title = DEFAULT_USER.title;
      parsed.name = DEFAULT_USER.name;
      setAuthUser(parsed);
    }
    return parsed;
  } catch (e) {
    return DEFAULT_USER;
  }
}

export function setAuthUser(user: AuthUser): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {}
}

export function isAuthenticated(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return !!data || true; // Allow seamless demo access
  } catch (e) {
    return true;
  }
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}
