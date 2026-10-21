import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type { LoginCredentials, User, UserRecord } from "../types/auth";

const SESSION_KEY = "app_session";
const USERS_KEY = "hotel-rolex-users";

// La cuenta ADMIN se conserva como cuenta fija y no se puede crear desde el registro.
// Los usuarios normales se guardan en el almacenamiento local del navegador.
const administratorAccounts = (initialUsers as UserRecord[]).filter(
  (user) => user.role === "ADMIN",
);

const getUsers = (): UserRecord[] => {
  const savedUsers = storageService.get<UserRecord[]>(USERS_KEY) || [];
  const administratorCarnets = new Set(
    administratorAccounts.map((user) => user.carnet.trim()),
  );

  const registeredUsers = savedUsers.filter(
    (user) =>
      user.role !== "ADMIN" &&
      !administratorCarnets.has(user.carnet.trim()),
  );

  return [...administratorAccounts, ...registeredUsers];
};

export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const normalizedCarnet = credentials.carnet.trim();
    const foundUser = getUsers().find(
      (user) =>
        user.carnet.trim() === normalizedCarnet &&
        user.password === credentials.password,
    );

    if (!foundUser) return null;

    const user: User = {
      id: foundUser.id,
      name: foundUser.name,
      carnet: foundUser.carnet,
      role: foundUser.role,
    };

    storageService.set(SESSION_KEY, user);
    return user;
  },

  register(data: { name: string; carnet: string; password: string }): User | null {
    const users = getUsers();
    const name = data.name.trim();
    const carnet = data.carnet.trim();

    if (
      !name ||
      !carnet ||
      data.password.length < 4 ||
      users.some((user) => user.carnet.trim() === carnet)
    ) {
      return null;
    }

    const record: UserRecord = {
      id: `user-${Date.now()}`,
      name,
      carnet,
      password: data.password,
      role: "USUARIO",
    };

    // Se guarda la lista completa de cuentas normales; la cuenta ADMIN se
    // recupera siempre desde el archivo de cuentas iniciales.
    const registeredUsers = users.filter((user) => user.role !== "ADMIN");
    storageService.set(USERS_KEY, [...registeredUsers, record]);

    const user: User = {
      id: record.id,
      name: record.name,
      carnet: record.carnet,
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
