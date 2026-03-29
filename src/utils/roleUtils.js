export function getRole() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('authRole');
}

export function isSuperAdmin() {
  return getRole() === 'super_admin';
}

// Define resource permission matrix
// actions: create, edit, delete
const permissions = {
  super_admin: 'all',
  admin_simple: {
    activites: { create: true, edit: true, delete: true },
    actualites: { create: true, edit: true, delete: true },
    messages: { create: false, edit: true, delete: true },
    newsletter: { create: true, edit: true, delete: true },
  },
};

export function can(resource, action) {
  const role = getRole();
  if (!role) return false;
  if (permissions[role] === 'all') return true;
  const res = permissions[role]?.[resource];
  if (!res) return false;
  return !!res[action];
}
