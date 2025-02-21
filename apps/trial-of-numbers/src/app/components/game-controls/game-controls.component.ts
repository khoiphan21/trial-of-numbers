import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Game, Player } from '../../models/game.interface';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="game-controls">
      <!-- Host Controls -->
      @if (isHost && game.gameState === 'waiting') {
      <button
        class="start-button"
        [disabled]="game.players.length < 2"
        (click)="startGame()"
      >
        Start Game @if (game.players.length < 2) {
        <span>(Waiting for more players...)</span>
        }
      </button>
      }

      <!-- Number Guess Form -->
      @if (game.gameState === 'in_progress') {
      <div class="number-guess">
        <h3>Make a Guess</h3>
        <div class="guess-inputs">
          @for (slot of ['A', 'B', 'C', 'D', 'E']; track slot) {
          <input
            type="number"
            min="0"
            max="9"
            [(ngModel)]="guessSequence[slot]"
            placeholder="Slot {{ slot }}"
          />
          }
        </div>
        <button
          [disabled]="!isValidGuess()"
          (click)="submitGuess()"
          class="guess-button"
        >
          Submit Guess
        </button>
        <p class="warning">Warning: An incorrect guess will eliminate you!</p>
      </div>
      }

      <!-- Round Timer -->
      @if (game.gameState === 'in_progress' && roundTimeLeft) {
      <div class="round-timer">Time left: {{ roundTimeLeft }}s</div>
      }
    </div>
  `,
  styles: [
    `
      .game-controls {
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .start-button {
        width: 100%;
        padding: 1rem;
        font-size: 1.2rem;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        span {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-left: 0.5rem;
        }
      }

      .number-guess {
        margin-top: 1rem;

        .guess-inputs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;

          input {
            width: 4rem;
            padding: 0.5rem;
            text-align: center;
            border: 1px solid #ced4da;
            border-radius: 4px;
          }
        }

        .warning {
          color: #dc3545;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
      }

      .round-timer {
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
        color: #dc3545;
        margin-top: 1rem;
      }
    `,
  ],
})
export class GameControlsComponent {
  @Input() game!: Game;
  @Input() currentPlayer!: Player;

  private gameService = inject(GameService);
  guessSequence: Record<string, number> = {};
  roundTimeLeft: number | null = null;

  get isHost(): boolean {
    return this.currentPlayer?.id === this.game?.host;
  }

  async startGame(): Promise<void> {
    if (this.game && this.isHost) {
      await this.gameService.startGame(this.game.id);
    }
  }

  isValidGuess(): boolean {
    return (
      Object.keys(this.guessSequence).length === 5 &&
      Object.values(this.guessSequence).every(
        (num) => num >= 0 && num <= 9 && Number.isInteger(num)
      )
    );
  }

  async submitGuess(): Promise<void> {
    if (this.isValidGuess()) {
      const sequence = ['A', 'B', 'C', 'D', 'E'].map(
        (slot) => this.guessSequence[slot]
      );
      await this.gameService.submitGuess(
        this.game.id,
        this.currentPlayer.id,
        sequence
      );
    }
  }

  ngOnInit() {
    this.startRoundTimer();
  }

  private startRoundTimer() {
    if (
      this.game?.gameState === 'in_progress' &&
      this.game?.currentRound?.endTime
    ) {
      const updateTimer = () => {
        const now = new Date();
        const endTime = new Date(this.game.currentRound.endTime);
        const diff = Math.max(
          0,
          Math.floor((endTime.getTime() - now.getTime()) / 1000)
        );
        this.roundTimeLeft = diff;

        if (diff > 0) {
          requestAnimationFrame(updateTimer);
        }
      };

      updateTimer();
    }
  }
}
