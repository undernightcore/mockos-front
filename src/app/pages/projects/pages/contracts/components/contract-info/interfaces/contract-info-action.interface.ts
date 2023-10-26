import { ContractInterface } from '../../../../../../../interfaces/contract.interface';

export interface ContractInfoActionInterface {
  action: 'rollback' | 'compare';
  contract: ContractInterface;
}
