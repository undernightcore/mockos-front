import { ResponseModel } from '../../../../../../../models/response.model';

export interface ResponseModalDataInterface {
  routeId: number;
  responseData?: ResponseModel;
  selectedFile?: File;
}
