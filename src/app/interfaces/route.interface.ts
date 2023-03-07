export interface RouteInterface {
  id: number;
  name: string;
  method: HttpMethods;
  endpoint: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type HttpMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';
