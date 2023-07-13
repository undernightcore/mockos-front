import { ResponseInterface } from '../interfaces/response.interface';
import { isValidJson, prettifyJson } from '../utils/string.utils';
import { HeadersInterface } from '../interfaces/headers.interface';
import { EditorTypeEnum } from '../interfaces/response-type.interface';
import { getEditorType } from '../utils/const.utils';

export class ResponseModel {
  id: number;
  name: string;
  status: number;
  is_file: boolean;
  headers: HeadersInterface[];
  editorType: EditorTypeEnum;
  body: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;

  constructor(data: ResponseInterface) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.is_file = data.is_file;
    this.headers = data.headers;
    this.editorType = this.#getEditorType(data.headers);
    this.body =
      !data.is_file && isValidJson(data.body)
        ? prettifyJson(data.body)
        : data.body;
    this.enabled = data.enabled;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  #getEditorType(headers: HeadersInterface[]) {
    const contentType = headers.find((header) => header.key === 'content-type');
    return !contentType
      ? EditorTypeEnum.JSON
      : getEditorType(contentType.value);
  }
}
