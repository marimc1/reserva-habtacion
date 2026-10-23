import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type { LoginCredentials, User, UserRecord } from "../types/auth";

const SESSION_KEY = "app_session";
const USERS_KEY = "hotel-rolex-users";
const ADMIN_EMAIL = "admin@santacecilia.com";

// El archivo inicial puede no incluir correo; asignamos uno al normalizar
// los registros antes de tratarlos como UserRecord.
const administratorAccounts: UserRecord[] = initialUsers
  .filter((user) => user.role === "ADMIN")
  .map((user) => ({
    id: user.id,
    name: user.name,
    email:
      "email" in user && typeof user.email === "string" && user.email.trim()
        ? user.email.trim()
        : ADMIN_EMAIL,
    password: user.password,
    role: user.role as UserRecord["role"],
  }));

const getUsers = (): UserRecord[] => {
  const savedUsers = storageService.get<UserRecord[]>(USERS_KEY) || [];
  const administratorEmails = new Set(
    administratorAccounts.map((user) => user.email.toLowerCase()),
  );

  const registeredUsers = savedUsers.filter(
    (user) =>
      user.role !== "ADMIN" &&
      typeof user.email === "string" &&
      !administratorEmails.has(user.email.toLowerCase()),
  );

  return [...administratorAccounts, ...registeredUsers];
};

export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const foundUser = getUsers().find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === credentials.password,
    );

    if (!foundUser) return null;

    const user: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };

    storageService.set(SESSION_KEY, user);
    return user;
  },

  register(data: { name: string; email: string; password: string }): User | null {
    const users = getUsers();
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const isGmail = /^[^\s@]+@gmail\.com$/.test(email);

    if (
      !name ||
      !isGmail ||
      data.password.length < 4 ||
      users.some((user) => user.email.toLowerCase() === email)
    ) {
      return null;
    }

    const record: UserRecord = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: data.password,
      role: "USUARIO",
    };

    // Los usuarios nuevos se guardan localmente; el ADMIN siempre se obtiene
    // desde el archivo de cuentas iniciales y no puede crearse desde el formulario.
    const registeredUsers = users.filter((user) => user.role !== "ADMIN");
    storageService.set(USERS_KEY, [...registeredUsers, record]);

    const user: User = {
      id: record.id,
      name: record.name,
      email: record.email,
      role: record.role,
    };

    storageService.set(SESSION_KEY, user);
    return user;
  },

  getUsers,
  getUserCount: () => getUsers().length,
  logout: () => storageService.remove(SESSION_KEY),
  getCurrentUser: () => storageService.get<User>(SESSION_KEY),
  isAuthenticated: () => storageService.get<User>(SESSION_KEY) !== null,
};
