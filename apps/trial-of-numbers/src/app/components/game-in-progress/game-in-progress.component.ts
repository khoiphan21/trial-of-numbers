import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  selectGameSessionsForLobby,
  selectHintBoard,
  selectPlayersByLobbySessionId,
} from '@luna/api';
import { filterUndefinedValues } from '@luna/core';
import {
  GameSession,
  HintBoard,
  LobbySession,
  Player,
} from '@luna/definitions';
import { map, Observable, switchMap } from 'rxjs';
import { GameBoardComponent } from '../game-board';
import { PlayerHandComponent } from '../player-hand';

@Component({
  selector: 'app-game-in-progress',
  standalone: true,
  imports: [CommonModule, PlayerHandComponent, GameBoardComponent],
  templateUrl: './game-in-progress.component.html',
  styleUrls: ['./game-in-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameInProgressComponent implements OnInit {
  @Input({ required: true }) lobby!: LobbySession;

  currentPlayerId = localStorage.getItem('playerId');

  gameSessions$?: Observable<GameSession[]>;
  players$?: Observable<Player[]>;

  activeGameSession$?: Observable<GameSession>;

  hintBoard$?: Observable<HintBoard>;

  ngOnInit(): void {
    this.gameSessions$ = selectGameSessionsForLobby(this.lobby.id);
    this.players$ = selectPlayersByLobbySessionId(this.lobby.id);

    this.activeGameSession$ = this.gameSessions$.pipe(
      map((gameSessions) =>
        gameSessions.find(
          (gameSession) => gameSession.gameSessionState === 'in_progress'
        )
      ),
      filterUndefinedValues()
    );

    this.hintBoard$ = this.activeGameSession$.pipe(
      switchMap((gameSession) => selectHintBoard(gameSession.id))
    );
  }
}
