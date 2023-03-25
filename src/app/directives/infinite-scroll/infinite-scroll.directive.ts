import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Directive({
  selector: '[infiniteScroll]',
})
export class InfiniteScrollDirective implements OnChanges {
  @Input() maxItems = 0;
  @Input() currentItems = 0;
  @Input() itemsPerPage = 0;

  @Input() heightThreshold = 200;
  @Output() newPageNeeded = new EventEmitter<number>();

  constructor(private element: ElementRef) {}

  get currentPage() {
    return Math.floor(this.currentItems / this.itemsPerPage);
  }

  ngOnChanges() {
    const { scrollHeight, clientHeight } = this.element.nativeElement;
    if (scrollHeight === clientHeight && this.currentItems < this.maxItems) {
      this.newPageNeeded.emit(this.currentPage + 1);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const { scrollTop, scrollHeight, offsetHeight } =
      event.target as HTMLElement;
    if (
      scrollHeight - (scrollTop + offsetHeight) > this.heightThreshold ||
      this.currentItems >= this.maxItems
    )
      return;
    this.newPageNeeded.emit(this.currentPage + 1);
  }
}
