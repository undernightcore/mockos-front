import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpMethods } from '../../../../../../interfaces/route.interface';
import { CreateRouteInterface } from '../../../../../../interfaces/create-route.interface';
import { CreateFolderInterface } from '../../../../../../interfaces/create-folder.interface';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss'],
})
export class CreateRouteComponent {
  selectedTab = this.data?.isFolder ? 1 : 0;

  routeForm = new FormGroup({
    name: new FormControl(''),
    endpoint: new FormControl(''),
    method: new FormControl<HttpMethods>('get'),
    enabled: new FormControl(true),
  });

  methodOptions: HttpMethods[] = ['get', 'post', 'delete', 'put', 'patch'];

  constructor(
    public dialogRef: MatDialogRef<CreateRouteComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data?: {
      isFolder: boolean;
      data: CreateRouteInterface | CreateFolderInterface;
    }
  ) {
    this.routeForm.patchValue(data?.data ?? {});
  }

  emitData() {
    this.dialogRef.close({
      isFolder: Boolean(this.selectedTab),
      data: this.routeForm.value,
    });
  }
}
