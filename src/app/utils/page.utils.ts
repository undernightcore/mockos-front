export function calculateAmountToFetch(currentAmount: number, perPage: number) {
  return Math.ceil((currentAmount || 1) / perPage) * perPage;
}
