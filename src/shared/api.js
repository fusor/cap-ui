import config from '../../config/fusor/config';

export function getBaseUrl() {
  return `${config.apiRoot}`;
}

export function getResourceUrl(resource) {
  return `${config.apiRoot}/${resource}`;
}
