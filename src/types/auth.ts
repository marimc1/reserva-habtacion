export type UserRole = "ADMIN" | "USUARIO";

export interface User {
  id: string;
  name: string;
  email: string;
  // Campo opcional para mantener compatibilidad con reservas antiguas.
  carnet?: string;
  role: UserRole;
}

export interface UserRecord extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
