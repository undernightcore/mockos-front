import { RESPONSE_TYPES } from '../const/response-types.const';
import { EditorTypeEnum } from '../interfaces/response-type.interface';

export function getEditorType(responseType: string) {
  const foundType = RESPONSE_TYPES.find(
    (type) => responseType === type.contentType
  );
  return foundType?.editorType ?? EditorTypeEnum.TEXT;
}
