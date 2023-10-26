export function isVersionGreater(currentVersion: string, newVersion: string) {
  const currentNumbers = currentVersion.split('.').map(Number)
  const newNumbers = newVersion.split('.').map(Number)

  while (currentNumbers.length < 3) {
    currentNumbers.push(0)
  }

  while (newNumbers.length < 3) {
    newNumbers.push(0)
  }

  const differentIndex = currentNumbers.findIndex((section, index) => section !== newNumbers[index])

  return differentIndex !== -1 ? newNumbers[differentIndex] > currentNumbers[differentIndex] : false
}
