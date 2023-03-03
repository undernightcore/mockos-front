import { PaginationInterface } from './pagination.interface';

export interface PaginatedResponseInterface<T> {
  meta: PaginationInterface;
  data: T[];
}
