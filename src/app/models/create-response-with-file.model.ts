import { CreateResponseModel } from './create-response.model';

export class CreateResponseWithFileModel {
  formData = new FormData();

  constructor(data: CreateResponseModel, file?: File) {
    if (file) this.formData.append('body', file);
    this.formData.append('name', data.name);
    this.formData.append('status', String(data.status));
    this.formData.append('enabled', String(data.enabled));
  }
}
