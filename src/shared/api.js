import config from '../../config/cap/config';

export function getBaseUrl() {
  return `${config.apiRoot}`;
}

export function getResourceUrl(resource) {
  return `${config.apiRoot}/${resource}`;
}

export function getHealthCheckUrl() {
  return `${config.apiRoot}/health-check`;
}
