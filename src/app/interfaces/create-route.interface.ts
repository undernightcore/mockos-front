import { HttpMethods } from './route.interface';

export interface CreateRouteInterface {
  name: string;
  method: HttpMethods;
  endpoint: string;
  enabled: boolean;
}
