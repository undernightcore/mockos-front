import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isValidVersion',
})
export class IsValidVersion implements PipeTransform {
  transform(remoteVersion?: string, localVersion?: string | number) {
    if (!localVersion || typeof localVersion === 'number') return false;

    const remoteParsedVersion = remoteVersion?.split('.').map(Number);
    const localParsedVersion = localVersion.split('.').map(Number);

    if (
      localParsedVersion.length > 3 ||
      localParsedVersion.some((value) => isNaN(value))
    )
      return false;

    return localParsedVersion > (remoteParsedVersion ?? []);
  }
}
