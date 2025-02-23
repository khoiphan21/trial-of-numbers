import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { selectHintType, validateHint } from '@luna/api';
import { filterUndefinedValues } from '@luna/core';
import { HintSubmission, HintType } from '@luna/definitions';
import { distinctUntilChanged, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-hint-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hint-card.component.html',
  styleUrls: ['./hint-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintCardComponent implements OnInit {
  @Input({ required: true }) hint!: HintSubmission;
  @Input() slotValue?: number;

  hintType$?: Observable<HintType>;

  ngOnInit(): void {
    this.hintType$ = selectHintType(this.hint.hintTypeId).pipe(
      filterUndefinedValues(),
      distinctUntilChanged()
    );
  }
}
