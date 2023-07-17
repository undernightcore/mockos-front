import { HeadersInterface } from './headers.interface';

export interface ResponseInterface {
  id: number;
  name: string;
  status: number;
  is_file: boolean;
  headers: HeadersInterface[];
  body: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SimpleResponseInterface {
  id: number;
  name: string;
  enabled: boolean;
  status: number;
}
