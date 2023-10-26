import {UserInterface} from "./user.interface";

export interface ContractInterface {
  id: number;
  version: string;
  swagger: string;
  created_at: string;
  updated_at: string;
  author: UserInterface | null;
}

export interface ContractVersionInterface {
  id: number;
  version: string;
  created_at: string;
  updated_at: string;
  author: UserInterface | null;
}

export interface MinimalContractInterface {
  swagger: string;
  info: { version: string };
}
