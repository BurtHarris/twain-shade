// Token validation helper for CI tokens used as identifiers in build metadata.
// Allowed characters: letters, digits, dot, underscore, hyphen. Max length: 64.
export function validateCiToken(token) {
  if (token === undefined || token === null) return true; // nothing to validate
  if (typeof token !== 'string') throw new Error('CI token must be a string');
  const maxLen = 64;
  const re = /^[A-Za-z0-9._-]{1,64}$/;
  if (token.length === 0) throw new Error('CI token must not be empty');
  if (token.length > maxLen) throw new Error(`CI token must be at most ${maxLen} characters`);
  if (!re.test(token)) throw new Error('CI token contains invalid characters. Allowed: letters, digits, dot (.), underscore (_), hyphen (-)');
  return true;
}

export default validateCiToken;
