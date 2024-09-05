export interface AuthUser {
  realm_access: RealmAccess;
  name: string;
  email: string;
}

export interface RealmAccess {
  roles: string[];
}

export interface UserAccess {
  name: string;
  email: string;
  role?: string[];
  isAdmin: boolean;
}
