import { CreateResponseInterface } from '../interfaces/create-response.interface';

export class CreateResponseWithFileModel {
  formData = new FormData();

  constructor(data: CreateResponseInterface, file?: File) {
    if (file) this.formData.append('body', file);
    this.formData.append('name', data.name);
    this.formData.append('status', String(data.status));
    this.formData.append('enabled', String(data.enabled));
  }
}
