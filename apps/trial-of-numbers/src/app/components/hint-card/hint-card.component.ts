import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintCard } from '../../models/game.interface';

@Component({
  selector: 'app-hint-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (hint) {
    <button
      class="hint-card"
      [class.flipped]="hint.isFlipped"
      [class.selectable]="selectable"
      [class.correct]="correct"
      [class.incorrect]="incorrect"
      [disabled]="!selectable"
      (click)="onCardClick()"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onCardClick()"
      [attr.aria-label]="'Hint card: ' + hint.text"
    >
      <div class="card-content">
        <span class="card-text">{{ hint.text }}</span>
      </div>
    </button>
    }
  `,
  styles: [
    `
      .hint-card {
        width: 100%;
        padding: 1rem;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;

        &.correct {
          background-color: #d4edda;
          border-color: #c3e6cb;
        }

        &.incorrect {
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }

        &:not(:disabled) {
          &.selectable:hover,
          &.selectable:focus {
            transform: translateY(-5px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            outline: 2px solid #007bff;
          }
        }

        &:disabled {
          cursor: default;
        }

        &.flipped {
          background: #f8d7da;
          border-color: #f5c6cb;
          transform: rotateY(180deg);
        }
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .card-type {
        font-size: 0.8rem;
        color: #666;
      }
    `,
  ],
})
export class HintCardComponent {
  @Input() hint?: HintCard | null;
  @Input() selectable = false;
  @Input() correct = false;
  @Input() incorrect = false;
  @Output() cardClick = new EventEmitter<HintCard>();

  onCardClick() {
    if (this.selectable && this.hint) {
      this.cardClick.emit(this.hint);
    }
  }
}
