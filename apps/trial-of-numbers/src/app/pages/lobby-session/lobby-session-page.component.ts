import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  selectLobbySessionByCode,
  selectPlayersByLobbySessionId,
} from '@luna/api';
import { LobbySession, Player } from '@luna/definitions';
import { Observable, switchMap } from 'rxjs';
import { LobbyInWaitingComponent } from '../../components/lobby-in-waiting/lobby-in-waiting.component';
import { GameInProgressComponent } from '../../components/game-in-progress/game-in-progress.component';
import { filterUndefinedValues } from '@luna/core';

@Component({
  selector: 'app-lobby-session-page',
  standalone: true,
  imports: [CommonModule, LobbyInWaitingComponent, GameInProgressComponent],
  templateUrl: './lobby-session-page.component.html',
  styleUrls: ['./lobby-session-page.component.scss'],
})
export class LobbySessionPageComponent implements OnInit {
  private cd = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  joinCode = this.route.snapshot.paramMap.get('joinCode');
  currentPlayerId = localStorage.getItem('playerId');

  lobbySession$?: Observable<LobbySession | undefined>;
  players$?: Observable<Player[]>;
  isHost = false;

  ngOnInit(): void {
    console.log('joinCode', this.joinCode);
    if (this.joinCode) {
      this.lobbySession$ = selectLobbySessionByCode(this.joinCode).pipe(
        filterUndefinedValues()
      );

      this.players$ = this.lobbySession$.pipe(
        switchMap((lobby) => {
          if (!lobby) return [];
          this.isHost = lobby.hostId === this.currentPlayerId;
          return selectPlayersByLobbySessionId(lobby.id);
        })
      );

      this.cd.detectChanges();
    }
  }
}
