import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectInterface } from '../../../../interfaces/project.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss'],
})
export class ProjectModalComponent {
  projectForm = new FormGroup({
    name: new FormControl(this.data.project?.name ?? '', Validators.required),
    description: new FormControl(this.data.project?.description ?? ''),
  });

  constructor(
    public dialogRef: MatDialogRef<ProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { message?: string; project?: ProjectInterface }
  ) {}

  handleSave() {
    this.projectForm.markAllAsTouched();
    if (this.projectForm.invalid) return;
    this.dialogRef.close({
      name: this.projectForm.value.name,
      description: this.projectForm.value.description || null,
    });
  }
}
