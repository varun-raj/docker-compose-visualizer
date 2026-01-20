/**
 * Encode YAML content to URL-safe base64 string
 */
export const encodeYamlToUrl = (yamlContent: string): string => {
  try {
    // Use base64 encoding with URL-safe characters
    const encoded = btoa(encodeURIComponent(yamlContent));
    return encoded;
  } catch (error) {
    console.error('Failed to encode YAML:', error);
    return '';
  }
};

/**
 * Decode URL-safe base64 string to YAML content
 */
export const decodeYamlFromUrl = (encoded: string): string | null => {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return decoded;
  } catch (error) {
    console.error('Failed to decode YAML:', error);
    return null;
  }
};

/**
 * Get YAML from URL hash or query parameter
 */
export const getYamlFromUrl = (): string | null => {
  const hash = window.location.hash.slice(1); // Remove #
  const params = new URLSearchParams(window.location.search);
  const yamlParam = params.get('yaml') || hash;

  if (yamlParam) {
    return decodeYamlFromUrl(yamlParam);
  }

  return null;
};

/**
 * Set YAML in URL hash
 */
export const setYamlInUrl = (yamlContent: string): void => {
  const encoded = encodeYamlToUrl(yamlContent);
  const newUrl = new URL(window.location.href);
  newUrl.hash = encoded;
  window.history.replaceState({}, '', newUrl.toString());
};

/**
 * Generate shareable URL
 */
export const generateShareUrl = (yamlContent: string): string => {
  const encoded = encodeYamlToUrl(yamlContent);
  const url = new URL(window.location.href);
  url.hash = encoded;
  return url.toString();
};
