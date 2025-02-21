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
      <div class="guess-controls">
        <h3>Make a Guess</h3>
        <div class="number-inputs">
          @for (slot of SLOTS; track slot) {
          <div class="input-group">
            <label [for]="'slot-' + slot">{{ slot }}</label>
            <input
              [id]="'slot-' + slot"
              type="number"
              min="0"
              max="9"
              [(ngModel)]="guessNumbers[slot]"
              [disabled]="hasCorrectGuess"
            />
          </div>
          }
        </div>
        <button
          class="submit-guess"
          (click)="submitGuess()"
          [disabled]="!isValidGuess() || hasCorrectGuess"
        >
          Submit Guess
        </button>
        @if (lastGuessResult) {
        <div class="guess-result" [class.correct]="lastGuessResult.correct">
          <p>
            @if (lastGuessResult.correct) { Correct! You earned
            {{ lastGuessResult.score }} points. } @else { Incorrect. Try again!
            }
          </p>
        </div>
        }
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

      .guess-controls {
        margin-top: 1rem;
      }

      .number-inputs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
          font-weight: 500;
          color: #2c3e50;
        }

        input {
          width: 4rem;
          padding: 0.5rem;
          text-align: center;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
      }

      .submit-guess {
        width: 100%;
        padding: 0.75rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: #0056b3;
        }

        &:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
      }

      .guess-result {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 4px;
        text-align: center;
        background: #f8d7da;
        color: #721c24;

        &.correct {
          background: #d4edda;
          color: #155724;
        }

        p {
          margin: 0;
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
  readonly SLOTS = ['A', 'B', 'C', 'D', 'E'];

  guessNumbers: Record<string, number> = {};
  roundTimeLeft: number | null = null;
  lastGuessResult?: { correct: boolean; score?: number };

  get isHost(): boolean {
    return this.currentPlayer?.id === this.game?.host;
  }

  get hasCorrectGuess(): boolean {
    return this.game.guesses.some(
      (guess) =>
        guess.playerId === this.currentPlayer.id &&
        guess.sequence.every((num, index) => num === this.game.numberSet[index])
    );
  }

  isValidGuess(): boolean {
    return this.SLOTS.every((slot) => {
      const num = this.guessNumbers[slot];
      return typeof num === 'number' && num >= 0 && num <= 9;
    });
  }

  async startGame(): Promise<void> {
    if (this.game && this.isHost) {
      await this.gameService.startGame(this.game.id);
    }
  }

  async submitGuess() {
    if (!this.isValidGuess()) return;

    const numbers = this.SLOTS.map((slot) => this.guessNumbers[slot]);
    try {
      const result = await this.gameService.submitGuess(
        this.game.id,
        this.currentPlayer.id,
        numbers
      );
      this.lastGuessResult = result;

      if (result.correct) {
        // Clear inputs after correct guess
        this.guessNumbers = {};
      }
    } catch (error) {
      console.error('Error submitting guess:', error);
      // TODO: Add error handling UI
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
