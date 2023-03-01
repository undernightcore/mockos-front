import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verification-result',
  templateUrl: './verification-result.component.html',
  styleUrls: ['./verification-result.component.scss'],
})
export class VerificationResultComponent implements OnInit {
  successful?: boolean;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.successful = data['successful'] ?? false;
    });
  }
}
