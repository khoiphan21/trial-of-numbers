import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintBoard } from '@luna/definitions';

@Component({
  selector: 'app-player-hand',
  imports: [CommonModule],
  templateUrl: './player-hand.component.html',
  styleUrl: './player-hand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerHandComponent {
  @Input({ required: true }) hintBoard!: HintBoard;
}
