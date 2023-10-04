export interface ResponseTypeInterface {
  contentType: string;
  editorType: EditorTypeEnum;
}

export enum EditorTypeEnum {
  JSON = 'ace/mode/json',
  HTML = 'ace/mode/html',
  TEXT = 'ace/mode/text',
  YAML = 'ace/mode/yaml',
}
