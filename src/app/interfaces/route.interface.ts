export interface RouteInterface {
  id: number;
  name: string;
  method: HttpMethods;
  endpoint: string;
  enabled: boolean;
  is_folder: false;
  created_at: string;
  updated_at: string;
}

export interface FolderInterface {
  id: number;
  name: string;
  is_folder: true;
  created_at: string;
  updated_at: string;
}

export type HttpMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';
