export function omitBy(obj: { [key: string]: any }, value: any) {
  return Object.entries(obj)
    .filter(([_, val]) => val !== value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
