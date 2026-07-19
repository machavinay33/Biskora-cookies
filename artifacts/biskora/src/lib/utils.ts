export function getAdminHeaders() {
  const token = localStorage.getItem('biskora_admin_token');
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function setAdminToken(token: string) {
  localStorage.setItem('biskora_admin_token', token);
}

export function clearAdminToken() {
  localStorage.removeItem('biskora_admin_token');
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
