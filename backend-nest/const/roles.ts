export const Role = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  USER: 'USER',
} as const;

export type Role = typeof Role[keyof typeof Role];

export const ROLES_KEY = "roles"
