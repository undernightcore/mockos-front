import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import { InvitationInterface } from '../../interfaces/invitation.interface';
import { MessageInterface } from '../../interfaces/message.interface';
import { EnvService } from '../env/env.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  getInvitations(page = 1, perPage = 10) {
    return this.httpClient.get<PaginatedResponseInterface<InvitationInterface>>(
      `${this.envService.getEnv('apiUrl')}/invitations`,
      { params: { page, perPage } }
    );
  }

  acceptInvitation(invitationId: number) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/invitations/${invitationId}/accept`,
      {}
    );
  }

  rejectInvitation(invitationId: number) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/invitations/${invitationId}/reject`,
      {}
    );
  }
}
