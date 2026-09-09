import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type { LoginCredentials, User, UserRecord } from "../types/auth";

const SESSION_KEY = "app_session";
const USERS_KEY = "hotel-rolex-users";
const getUsers = (): UserRecord[] => storageService.get<UserRecord[]>(USERS_KEY) || (initialUsers as UserRecord[]);

export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const foundUser = getUsers().find(user => user.carnet.trim() === credentials.carnet.trim() && user.password === credentials.password);
    if (!foundUser) return null;
    const user: User = { id: foundUser.id, name: foundUser.name, carnet: foundUser.carnet, role: foundUser.role };
    storageService.set(SESSION_KEY, user); return user;
  },
  register(data: { name: string; carnet: string; password: string }): User | null {
    const users = getUsers(); const carnet = data.carnet.trim();
    if (!data.name.trim() || !carnet || data.password.length < 4 || users.some(u => u.carnet.trim() === carnet)) return null;
    const record: UserRecord = { id: `user-${Date.now()}`, name: data.name.trim(), carnet, password: data.password, role: "USUARIO" };
    storageService.set(USERS_KEY, [...users, record]);
    const user: User = { id: record.id, name: record.name, carnet: record.carnet, role: record.role };
    storageService.set(SESSION_KEY, user); return user;
  },
  getUsers,
  getUserCount: () => getUsers().length,
  logout: () => storageService.remove(SESSION_KEY),
  getCurrentUser: () => storageService.get<User>(SESSION_KEY),
  isAuthenticated: () => storageService.get<User>(SESSION_KEY) !== null,
};
