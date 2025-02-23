import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addPlayer, selectLobbySessionByCode } from '@luna/api';
import { makePlayer } from '@luna/model';
import { firstValueFrom } from 'rxjs';
import { GAME_ROUTE, GAME_ROUTE_SESSION_ID } from '@luna/definitions';

@Component({
  selector: 'app-join-lobby-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './join-lobby-session-page.component.html',
  styleUrls: ['./join-lobby-session-page.component.scss'],
})
export class JoinLobbySessionPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  playerName = '';
  isLoading = false;
  error: string | null = null;
  joinCode = this.route.snapshot.paramMap.get('joinCode');

  async joinLobby() {
    if (!this.playerName.trim() || !this.joinCode) return;

    try {
      this.isLoading = true;
      this.error = null;

      const lobbySession = await firstValueFrom(
        selectLobbySessionByCode(this.joinCode)
      );

      if (!lobbySession) {
        this.error = 'Lobby not found. Please check the join code.';
        return;
      }
      const player = makePlayer({
        name: this.playerName,
        lobbySessionId: lobbySession.id,
      });

      await addPlayer(player);

      // Store player ID for persistence
      localStorage.setItem('playerId', player.id);

      // Navigate to lobby session page
      this.router.navigate([GAME_ROUTE, this.joinCode]);
    } catch (error) {
      console.error('Error joining lobby:', error);
      this.error = 'Failed to join lobby. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
