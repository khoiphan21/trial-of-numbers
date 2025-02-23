import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { selectHintType } from '@luna/api';
import { filterUndefinedValues } from '@luna/core';
import { HintSubmission, HintType } from '@luna/definitions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hint-card',
  imports: [CommonModule],
  templateUrl: './hint-card.component.html',
  styleUrl: './hint-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintCardComponent implements OnInit {
  @Input({ required: true }) hint!: HintSubmission;

  hintType$?: Observable<HintType>;

  ngOnInit(): void {
    this.hintType$ = selectHintType(this.hint.hintTypeId).pipe(
      filterUndefinedValues()
    );
  }
}
