import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpChipComponent } from './http-chip.component';

@NgModule({
  declarations: [HttpChipComponent],
  imports: [CommonModule],
  exports: [HttpChipComponent],
})
export class HttpChipModule {}
