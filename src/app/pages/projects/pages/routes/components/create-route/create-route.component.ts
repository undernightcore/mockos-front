import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpMethods } from '../../../../../../interfaces/route.interface';
import { CreateRouteInterface } from '../../../../../../interfaces/create-route.interface';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss'],
})
export class CreateRouteComponent {
  routeForm = new FormGroup({
    name: new FormControl(this.data?.name ?? ''),
    endpoint: new FormControl(this.data?.endpoint ?? ''),
    method: new FormControl<HttpMethods>(this.data?.method ?? 'get'),
    enabled: new FormControl(this.data?.enabled ?? true),
  });

  methodOptions: HttpMethods[] = ['get', 'post', 'delete', 'put', 'patch'];

  constructor(
    public dialogRef: MatDialogRef<CreateRouteComponent>,
    @Inject(MAT_DIALOG_DATA) private data?: CreateRouteInterface
  ) {}
}
