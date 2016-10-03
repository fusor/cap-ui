const API_RESOURCE_BASE = 'http://cap.example.com:3001';

export function getBaseUrl() {
  return `${API_RESOURCE_BASE}`;
}

export function getResourceUrl(resource) {
  return `${API_RESOURCE_BASE}/${resource}`;
}
