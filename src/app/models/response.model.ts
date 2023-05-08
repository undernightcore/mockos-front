import { ResponseInterface } from '../interfaces/response.interface';

export class ResponseModel {
  id: number;
  name: string;
  status: number;
  is_file: boolean;
  body: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;

  constructor(data: ResponseInterface) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.is_file = data.is_file;
    this.body = !data.is_file
      ? JSON.stringify(JSON.parse(data.body), null, 2)
      : data.body;
    this.enabled = data.enabled;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
