import {
  EditorTypeEnum,
  ResponseTypeInterface,
} from '../interfaces/response-type.interface';

export const RESPONSE_TYPES: ResponseTypeInterface[] = [
  {
    contentType: 'application/json',
    editorType: EditorTypeEnum.JSON,
  },
  {
    contentType: 'text/html',
    editorType: EditorTypeEnum.HTML,
  }
];
