import { ProjectInterface } from './project.interface';

export interface InvitationInterface {
  id: number;
  verified: boolean;
  project: ProjectInterface;
}
