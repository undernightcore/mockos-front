export interface ContractInterface {
  id: number;
  version: string;
  swagger: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractVersionInterface {
  id: number;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface MinimalContractInterface {
  swagger: string;
  info: { version: string };
}
