import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LobbySession } from '@luna/definitions';

@Component({
  selector: 'app-game-in-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-in-progress.component.html',
  styleUrls: ['./game-in-progress.component.scss'],
})
export class GameInProgressComponent {
  @Input({ required: true }) lobby!: LobbySession;
}
