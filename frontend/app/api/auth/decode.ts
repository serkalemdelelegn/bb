export function decodeJWT(token: any): any {
  try {
    const payload = token.split('.')[1] || '';
    const decoded = atob(payload); // decode base64
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Failed to decode JWT', e);
    return null;
  }
}
