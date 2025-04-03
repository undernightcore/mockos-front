import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss'],
})
export class SvgIconComponent implements OnChanges {
  @Input() localPath!: string; // Input to accept the local SVG path
  svgContent: SafeHtml = '';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    if (this.localPath) {
      this.#loadSvg(this.localPath);
    }
  }

  #loadSvg(path: string): void {
    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (svg) =>
        (this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg)),
      error: (err) => console.error('Error loading SVG:', err),
    });
  }
}
