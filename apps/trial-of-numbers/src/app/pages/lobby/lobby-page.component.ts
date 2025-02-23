import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addLobbySession, addPlayer } from '@luna/api';
import { makeLobbySession, makePlayer } from '@luna/model';
import { Player } from '@luna/definitions';

@Component({
  selector: 'app-lobby-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss'],
})
export class LobbyPageComponent {
  private router = inject(Router);
  playerName = '';
  joinCode = '';
  isLoading = false;
  error: string | null = null;

  async createLobby() {
    if (!this.playerName.trim()) return;

    try {
      this.isLoading = true;
      this.error = null;

      // Create a new player
      let player: Player = makePlayer({
        name: this.playerName,
      });

      // Create a new lobby session with this player as host
      const lobbySession = makeLobbySession({
        hostId: player.id,
        gameState: 'waiting',
      });

      // update the player with the lobby session id
      player = {
        ...player,
        lobbySessionId: lobbySession.id,
      };

      // Save both entities
      await Promise.all([addLobbySession(lobbySession), addPlayer(player)]);

      // Store player ID for persistence
      localStorage.setItem('playerId', player.id);

      // Navigate to the game page
      this.router.navigate(['/game', lobbySession.joinCode]);
    } catch (error) {
      console.error('Error creating lobby:', error);
      this.error = 'Failed to create lobby. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
