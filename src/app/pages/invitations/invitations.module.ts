import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvitationsRoutingModule } from './invitations-routing.module';
import { InvitationsComponent } from './invitations.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { InvitationCardComponent } from './components/invitation-card/invitation-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChoiceModalModule } from '../../components/choice-modal/choice-modal.module';

@NgModule({
  declarations: [InvitationsComponent, InvitationCardComponent],
  imports: [
    CommonModule,
    InvitationsRoutingModule,
    NavbarModule,
    TranslateModule,
    ChoiceModalModule,
  ],
})
export class InvitationsModule {}
