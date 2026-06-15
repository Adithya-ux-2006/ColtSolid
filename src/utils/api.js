export function getApiUrl(path) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl}${path}`;
}
