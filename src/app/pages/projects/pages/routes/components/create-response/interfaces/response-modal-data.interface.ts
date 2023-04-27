import { ResponseInterface } from '../../../../../../../interfaces/response.interface';

export interface ResponseModalDataInterface {
  routeId: number;
  responseData?: ResponseInterface;
  selectedFile?: File;
}
