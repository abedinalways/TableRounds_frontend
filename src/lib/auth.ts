export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  err:string
}

const STORAGE_KEY = 'authUser';

export function saveUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as AuthUser;
  } catch {
    return null;
  }
}

export function getRole(): UserRole | null {
  return getUser()?.role ?? null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function login(email: string, password: string): AuthUser {
 
  if (email === 'admin@doctor.com' && password === 'admin123') {
    const user = {
      id: '1',
      name: 'Admin User',
      email,
      role: 'admin',
    } as AuthUser;
    saveUser(user);
    return user;
  }
  if (email === 'user@doctor.com' && password === 'user123') {
    const user = {
      id: '2',
      name: 'Shahin',
      email,
      role: 'user',
    } as AuthUser;
    saveUser(user);
    return user;
  }
  throw new Error('Invalid email or password');
}
