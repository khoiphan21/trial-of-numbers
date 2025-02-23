import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game, Player } from '@luna/definitions';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scoreboard">
      <h3>Current Scores</h3>
      <div class="scores">
        @for (player of game.players; track player.id) {
        <div
          class="player-score"
          [class.current-player]="player.id === currentPlayerId"
        >
          <div class="player-info">
            <span class="player-name">{{ player.name }}</span>
            <span class="player-status" *ngIf="player.id === currentPlayerId"
              >(You)</span
            >
          </div>
          <div class="score-details">
            <div class="points">{{ player.score }} points</div>
            @if (hasCorrectGuess(player)) {
            <div class="correct-guess">✓ Correct!</div>
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .scoreboard {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;

        h3 {
          margin: 0 0 1rem;
          color: #2c3e50;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }
      }

      .scores {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.75rem;

        @media (min-width: 768px) {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
      }

      .player-score {
        padding: 0.75rem;
        font-size: 0.9rem;
        border-radius: 4px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;

        &.current-player {
          background: #e7f1ff;
          border-color: #b8daff;
        }

        @media (min-width: 768px) {
          padding: 1rem;
          font-size: 1rem;
        }
      }

      .player-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;

        .player-name {
          font-weight: 500;
        }

        .player-status {
          color: #6c757d;
          font-size: 0.9rem;
        }
      }

      .score-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .points {
        font-weight: 500;
        color: #2c3e50;
      }

      .correct-guess {
        color: #28a745;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    `,
  ],
})
export class ScoreboardComponent {
  @Input() game!: Game;
  @Input() currentPlayerId?: string;

  hasCorrectGuess(player: Player): boolean {
    return this.game.guesses.some(
      (guess) =>
        guess.playerId === player.id &&
        guess.sequence.every((num, index) => num === this.game.numberSet[index])
    );
  }
}
