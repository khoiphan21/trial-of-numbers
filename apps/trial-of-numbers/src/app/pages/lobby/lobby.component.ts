import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Luna Academy: Trial of Numbers</h1>

      <div class="create-game">
        <h2>Create New Game</h2>
        <input
          type="text"
          [(ngModel)]="playerName"
          placeholder="Enter your name"
          required
        />
        <button (click)="createGame()" [disabled]="!playerName">
          Create Game
        </button>
      </div>

      <div class="join-game">
        <h2>Join Game</h2>
        <input
          type="text"
          [(ngModel)]="playerName"
          placeholder="Enter your name"
          required
        />
        <input
          type="text"
          [(ngModel)]="gameId"
          placeholder="Enter game ID"
          required
        />
        <button (click)="joinGame()" [disabled]="!playerName || !gameId">
          Join Game
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
      }

      h1 {
        text-align: center;
        margin-bottom: 2rem;
      }

      .create-game,
      .join-game {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      input {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
        padding: 0.5rem;
      }

      button {
        width: 100%;
        padding: 0.5rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    `,
  ],
})
export class LobbyComponent {
  private gameService = inject(GameService);
  private router = inject(Router);

  playerName = '';
  gameId = '';

  async createGame() {
    try {
      const gameId = await this.gameService.createGame(this.playerName);
      if (this.gameService.currentPlayerId) {
        localStorage.setItem('playerId', this.gameService.currentPlayerId);
      }
      this.router.navigate(['/game', gameId]);
    } catch (error) {
      console.error('Error creating game:', error);
      // TODO: Add error handling UI
    }
  }

  async joinGame() {
    try {
      const playerId = await this.gameService.joinGame(
        this.gameId.toUpperCase(),
        this.playerName
      );
      localStorage.setItem('playerId', playerId);
      this.router.navigate(['/game', this.gameId.toUpperCase()]);
    } catch (error) {
      console.error('Error joining game:', error);
      // TODO: Add error handling UI
    }
  }
}
