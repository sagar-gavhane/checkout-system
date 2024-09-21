export function groupBy<T>(arr: T[], keys: string): Record<string, T[]> {
  return arr.reduce((accumulator, current) => {
    const groupKey = getNestedValue(current, keys).toString();
    if (!accumulator[groupKey]) {
      accumulator[groupKey] = [];
    }
    accumulator[groupKey].push(current);
    return accumulator;
  }, {} as Record<string, T[]>);
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((o, p) => (o && o[p]) || "", obj);
}
