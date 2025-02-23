import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { selectAllLobbySessions } from '@luna/api';

@Component({
  selector: 'app-lobbies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobbies.component.html',
  styleUrl: './lobbies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbiesComponent {
  lobbies$ = selectAllLobbySessions();
}
