import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-edit-headers-response',
  templateUrl: './edit-headers-response.component.html',
  styleUrls: ['./edit-headers-response.component.scss'],
})
export class EditHeadersResponseComponent implements OnInit {
  constructor(public dialogRef: DialogRef) {}

  ngOnInit(): void {}
}
