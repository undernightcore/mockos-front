export function prettifyJson(value: string) {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function compressJson(value: string) {
  return JSON.stringify(JSON.parse(value));
}
