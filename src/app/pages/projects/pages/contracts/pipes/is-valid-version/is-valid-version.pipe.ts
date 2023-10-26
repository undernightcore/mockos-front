import { Pipe, PipeTransform } from '@angular/core';
import {isVersionGreater} from "../../../../../../utils/version.utils";

@Pipe({
  name: 'isValidVersion',
})
export class IsValidVersion implements PipeTransform {
  transform(remoteVersion?: string, localVersion?: string | number) {
    if (!localVersion || typeof localVersion === 'number') return false;

    const localParsedVersion = localVersion.split('.').map(Number);

    if (
      localParsedVersion.length > 3 ||
      localParsedVersion.some((value) => isNaN(value))
    )
      return false;

    return isVersionGreater(remoteVersion ?? '', localVersion)
  }
}
