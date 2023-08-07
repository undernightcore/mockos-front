import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { DialogRef } from '@angular/cdk/dialog';
import { TokensService } from '../../../../../../services/tokens/tokens.service';
import { TokensInterface } from '../../../../../../interfaces/tokens.interface';
import { tap } from 'rxjs';
import { openToast } from '../../../../../../utils/toast.utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent implements OnInit {
  tokens?: TokensInterface[];
  maxTokens = 0;
  #isFetching = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public projectId: number,
    public dialogRef: DialogRef,
    private tokensService: TokensService,
    private translateService: TranslateService,
    private dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.#getTokens();
  }

  handlePageChange(page: number) {
    if (this.#isFetching) return;
    this.#getTokens(page);
  }

  showCopied() {
    openToast(
      this.translateService.instant('COMMON.COPIED_TO_CLIPBOARD'),
      'success'
    );
  }

  #getTokens(page = 1) {
    this.tokensService
      .getTokens(this.projectId, page, 20)
      .pipe(
        tap({
          subscribe: () => (this.#isFetching = true),
          finalize: () => (this.#isFetching = false),
        })
      )
      .subscribe((tokens) => {
        this.maxTokens = tokens.meta.total;
        this.tokens =
          page === 1 ? tokens.data : [...(this.tokens ?? []), ...tokens.data];
      });
  }
}
