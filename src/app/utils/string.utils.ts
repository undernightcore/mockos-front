import { load } from 'js-yaml';

export function prettifyJson(value: string) {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function compressJson(value: string) {
  return JSON.stringify(JSON.parse(value));
}

export function isValidJson(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidYaml(value: string) {
  try {
    load(value);
    return true;
  } catch {
    return false;
  }
}
