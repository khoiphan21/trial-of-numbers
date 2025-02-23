import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Game, getValidSlots, Player, ValidSlot } from '@luna/definitions';
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
        @if (!hasSubmittedGuess) {
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
              (input)="validateInput($event)"
              maxlength="1"
            />
          </div>
          }
        </div>
        <div class="button-group">
          <button
            class="submit-guess"
            (click)="submitGuess()"
            [disabled]="!isValidGuess()"
          >
            Submit Guess
          </button>
          <button
            class="reset-guess"
            (click)="resetGuess()"
            [disabled]="!hasAnyInput()"
          >
            Reset
          </button>
        </div>
        } @else {
        <div class="guess-result" [class.correct]="lastGuessResult?.correct">
          <p>
            @if (lastGuessResult?.correct) { Correct! You earned
            {{ lastGuessResult?.score }} points. } @else { Incorrect. Better
            luck next time! }
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
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.5rem;
        margin-bottom: 1rem;

        @media (max-width: 480px) {
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
      }

      .input-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;

        label {
          font-weight: 500;
          color: #2c3e50;
        }

        input {
          width: 100%;
          max-width: 4rem;
          padding: 0.5rem;
          text-align: center;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1.1rem;

          @media (max-width: 480px) {
            padding: 0.75rem;
            font-size: 1.2rem;
          }
        }
      }

      .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;

        @media (max-width: 480px) {
          flex-direction: column;
        }
      }

      .submit-guess,
      .reset-guess {
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;

        &:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
      }

      .submit-guess {
        flex: 2;
        background: #007bff;
        color: white;

        &:hover:not(:disabled) {
          background: #0056b3;
        }
      }

      .reset-guess {
        flex: 1;
        background: #6c757d;
        color: white;

        &:hover:not(:disabled) {
          background: #5a6268;
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
export class GameControlsComponent implements OnInit, OnChanges {
  @Input() game!: Game;
  @Input() currentPlayer!: Player;

  private gameService = inject(GameService);
  readonly SLOTS: ValidSlot[] = getValidSlots();

  guessNumbers: Record<string, number> = {};
  roundTimeLeft: number | null = null;
  lastGuessResult?: { correct: boolean; score?: number };
  hasGuessed = false;

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

  get hasSubmittedGuess(): boolean {
    return this.game.guesses.some(
      (guess) => guess.playerId === this.currentPlayer.id
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
    if (!this.isValidGuess() || this.hasSubmittedGuess) return;

    try {
      const numbers = this.SLOTS.map((slot) => this.guessNumbers[slot]);
      const result = await this.gameService.submitGuess(
        this.game.id,
        this.currentPlayer.id,
        numbers
      );
      this.lastGuessResult = result;
      this.hasGuessed = true;
    } catch (error) {
      console.error('Error submitting guess:', error);
    }
  }

  validateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 1) {
      input.value = input.value.slice(0, 1);
    }
    const num = parseInt(input.value);
    if (isNaN(num) || num < 0 || num > 9) {
      input.value = '';
      const slot = input.id.replace(
        'slot-',
        ''
      ) as keyof typeof this.guessNumbers;
      delete this.guessNumbers[slot];
    } else {
      const slot = input.id.replace(
        'slot-',
        ''
      ) as keyof typeof this.guessNumbers;
      this.guessNumbers[slot] = num;
    }
  }

  resetGuess() {
    this.guessNumbers = {};
  }

  hasAnyInput(): boolean {
    return Object.values(this.guessNumbers).some((val) => val !== undefined);
  }

  ngOnInit() {
    this.initializeLastGuessResult();
    this.startRoundTimer();
    this.resetGuess();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Reset inputs when round number changes (new game starts)
    if (changes['game'] && !changes['game'].firstChange) {
      const prevRound = changes['game'].previousValue?.roundNumber;
      const currentRound = changes['game'].currentValue?.roundNumber;

      if (prevRound !== currentRound) {
        this.resetGuess();
        this.lastGuessResult = undefined;
        this.hasGuessed = false;
      }
    }
  }

  private initializeLastGuessResult() {
    const playerGuess = this.game.guesses.find(
      (guess) => guess.playerId === this.currentPlayer.id
    );

    if (playerGuess) {
      this.lastGuessResult = {
        correct: playerGuess.isCorrect,
        score: playerGuess.isCorrect ? 10 - this.game.roundNumber : undefined,
      };
      this.hasGuessed = true;
    }
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
