import type { User, UserRole } from '../types';

export const normalizeUser = (apiUser: any): User => {
  const roles: UserRole[] =
    apiUser.roles?.map((r: any) => {
      if (typeof r === 'string') return { id: 0, name: r };
      return { id: r?.id ?? 0, name: r?.name ?? String(r) };
    }) ?? [{ id: 0, name: 'buyer' }];

  return {
    id: apiUser.id,
    name: apiUser.name,
    username: apiUser.username ?? apiUser.name,
    email: apiUser.email,
    roles,
    avatar: apiUser.avatar ?? null,
    phone: apiUser.phone ?? null,
    postal_code: apiUser.postal_code ?? null,
    birth_date: apiUser.birth_date ?? null,
    bio: apiUser.bio ?? null,
    stores: apiUser.stores ?? undefined,
  };
};