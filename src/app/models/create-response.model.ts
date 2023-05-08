import { CreateResponseInterface } from '../interfaces/create-response.interface';

export class CreateResponseModel {
  name: string;
  status: number;
  body: string;
  enabled: boolean;

  constructor(data: CreateResponseInterface) {
    this.name = data.name;
    this.status = data.status;
    this.body = JSON.stringify(JSON.parse(data.body));
    this.enabled = data.enabled;
  }
}
