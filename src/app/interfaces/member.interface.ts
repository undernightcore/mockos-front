import { UserInterface } from './user.interface';

export interface MemberInterface {
  id: number;
  verified: boolean;
  user: UserInterface;
}
