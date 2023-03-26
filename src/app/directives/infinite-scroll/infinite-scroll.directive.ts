import {
  AfterContentChecked,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[infiniteScroll]',
})
export class InfiniteScrollDirective implements AfterContentChecked {
  @Input() maxItems = 0;
  @Input() currentItems = 0;
  @Input() itemsPerPage = 0;

  @Input() heightThreshold = 200;
  @Output() newPageNeeded = new EventEmitter<number>();

  constructor(private element: ElementRef) {}

  get currentPage() {
    return Math.floor(this.currentItems / this.itemsPerPage);
  }

  get notEnoughScroll() {
    const { scrollHeight, clientHeight } = this.element.nativeElement;
    return (
      scrollHeight - this.heightThreshold < clientHeight &&
      this.currentItems < this.maxItems
    );
  }

  ngAfterContentChecked() {
    if (this.notEnoughScroll) this.newPageNeeded.emit(this.currentPage + 1);
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
