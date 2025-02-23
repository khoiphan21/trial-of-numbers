import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HintBoard } from '@luna/definitions';
import { HintCardComponent } from '../hint-card';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, HintCardComponent],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
  @Input({ required: true }) hintBoard!: HintBoard;
}
