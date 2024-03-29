import { CreateResponseInterface } from '../interfaces/create-response.interface';
import { compressJson, isValidJson } from '../utils/string.utils';

export class CreateResponseModel {
  name: string;
  status: number;
  body: string;
  enabled: boolean;

  constructor(data: CreateResponseInterface) {
    this.name = data.name;
    this.status = data.status;
    this.body = isValidJson(data.body) ? compressJson(data.body) : data.body;
    this.enabled = data.enabled;
  }
}
